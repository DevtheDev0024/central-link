import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
} from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import CreateMemberModal from './CreateMemberModal';
import EditMemberModal from './EditMemberModal';
import MemberStatusConfirmModal from './MemberStatusConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { updateMemberStatus } from '../../lib/api';
import type { MemberAccount, MemberStatus } from '../../types/memberAccount';
import { db } from '../../lib/firebase';

type StatusFilter = 'all' | MemberStatus;

function mapMemberDocument(id: string, data: Record<string, unknown>): MemberAccount {
  const membershipNumber = data.membershipNumber
    ? String(data.membershipNumber)
    : data.memberId
      ? String(data.memberId)
      : undefined;

  return {
    uid: id,
    email: String(data.email ?? ''),
    displayName: String(data.displayName ?? ''),
    membershipNumber,
    programmeYear: data.programmeYear ? String(data.programmeYear) : undefined,
    clubRole: data.clubRole ? String(data.clubRole) : undefined,
    emergencyContactName: data.emergencyContactName ? String(data.emergencyContactName) : undefined,
    emergencyContactNumber: data.emergencyContactNumber ? String(data.emergencyContactNumber) : undefined,
    role: data.role === 'admin' ? 'admin' : 'member',
    status: data.status === 'inactive' ? 'inactive' : 'active',
    mustChangePassword: Boolean(data.mustChangePassword),
    createdAt: String(data.createdAt ?? ''),
    createdBy: String(data.createdBy ?? ''),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
  };
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatLastActive(iso?: string): string {
  if (!iso) return '—';

  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return '—';

  const elapsedMs = Date.now() - timestamp;
  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 60) return minutes <= 1 ? 'Just now' : `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks} weeks ago`;
}

function getRoleLabel(member: MemberAccount): string {
  if (member.clubRole) return member.clubRole;
  if (member.role === 'admin') return 'Admin';
  return 'Member';
}

function getRoleTone(roleLabel: string): string {
  const normalized = roleLabel.toLowerCase();

  if (normalized.includes('president')) return 'is-president';
  if (normalized.includes('education') || normalized.includes('vpe')) return 'is-education';
  if (normalized.includes('treasurer')) return 'is-treasurer';
  if (normalized.includes('secretary')) return 'is-secretary';
  if (normalized.includes('membership')) return 'is-membership';
  if (normalized.includes('sergeant')) return 'is-sergeant';
  if (normalized.includes('admin')) return 'is-admin';
  return 'is-member';
}

export default function MembersGrid() {
  const { getIdToken } = useAuth();
  const [members, setMembers] = useState<MemberAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusUpdatingUid, setStatusUpdatingUid] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberAccount | null>(null);
  const [statusConfirmMember, setStatusConfirmMember] = useState<MemberAccount | null>(null);
  const [statusConfirmError, setStatusConfirmError] = useState<string | null>(null);
  const [expandedMemberUids, setExpandedMemberUids] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const membersQuery = query(collection(db, 'members'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        setMembers(
          snapshot.docs.map((document) => mapMemberDocument(document.id, document.data() as Record<string, unknown>)),
        );
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const counts = useMemo(
    () => ({
      all: members.length,
      active: members.filter((member) => member.status === 'active').length,
      inactive: members.filter((member) => member.status === 'inactive').length,
    }),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesStatus = statusFilter === 'all' ? true : member.status === statusFilter;

      const matchesSearch = !normalizedSearch
        ? true
        : [
            member.displayName,
            member.email,
            member.membershipNumber,
            member.clubRole,
            member.emergencyContactName,
            member.emergencyContactNumber,
          ]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [members, search, statusFilter]);

  const toggleExpanded = (uid: string) => {
    setExpandedMemberUids((current) => {
      const next = new Set(current);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  };

  const handleStatusChange = async (member: MemberAccount) => {
    const nextStatus: MemberStatus = member.status === 'active' ? 'inactive' : 'active';
    setStatusUpdatingUid(member.uid);
    setStatusConfirmError(null);
    setActionError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('You must be signed in as an admin to update member status.');
      }

      await updateMemberStatus(token, member.uid, { status: nextStatus });
      setStatusConfirmMember(null);
    } catch (statusError) {
      const message = statusError instanceof Error ? statusError.message : 'Unable to update member status.';
      setStatusConfirmError(message);
      setActionError(message);
    } finally {
      setStatusUpdatingUid(null);
    }
  };

  const openStatusConfirm = (member: MemberAccount) => {
    setStatusConfirmError(null);
    setStatusConfirmMember(member);
  };

  const closeStatusConfirm = () => {
    if (statusUpdatingUid) return;
    setStatusConfirmMember(null);
    setStatusConfirmError(null);
  };

  return (
    <>
      <section className="admin-user-management">
        <div className="admin-page-header">
          <h1>User Management</h1>
        </div>

        <div className="admin-control-bar">
          <div className="admin-filter-group" role="group" aria-label="Filter members">
            {([
              ['all', 'All', counts.all],
              ['active', 'Active', counts.active],
              ['inactive', 'Inactive', counts.inactive],
            ] as const).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                className={statusFilter === value ? 'is-active' : undefined}
                onClick={() => setStatusFilter(value)}
              >
                <span>{label}</span>
                <strong>{count}</strong>
              </button>
            ))}
          </div>

          <label className="admin-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="admin-control-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} aria-hidden="true" />
              Add User
            </button>
          </div>
        </div>

        {loading ? <p className="admin-empty-state">Loading members…</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}
        {actionError ? <p className="admin-error">{actionError}</p> : null}

        {!loading && !error && filteredMembers.length === 0 ? (
          <p className="admin-empty-state">No members match your current filters.</p>
        ) : null}

        {!loading && !error && filteredMembers.length > 0 ? (
          <ul className="admin-roster-list">
            {filteredMembers.map((member) => {
              const roleLabel = getRoleLabel(member);
              const lastActive = formatLastActive(member.updatedAt ?? member.createdAt);
              const isInactive = member.status === 'inactive';
              const isUpdating = statusUpdatingUid === member.uid;
              const isExpanded = expandedMemberUids.has(member.uid);
              const hasExpandedDetails =
                Boolean(member.membershipNumber) ||
                Boolean(member.emergencyContactName) ||
                Boolean(member.emergencyContactNumber);

              return (
                <li
                  key={member.uid}
                  className={`admin-roster-card${isInactive ? ' is-inactive' : ''}${isExpanded ? ' is-expanded' : ''}`}
                >
                  <div className="admin-roster-row">
                    <div className="admin-roster-primary">
                      <div className="admin-avatar" aria-hidden="true">
                        {getInitials(member.displayName || member.email)}
                      </div>

                      <div className="admin-roster-identity">
                        <strong>{member.displayName || 'Unnamed member'}</strong>
                        <span className="admin-roster-email">{member.email}</span>
                        <span className={`admin-roster-status ${isInactive ? 'is-inactive' : 'is-active'}`}>
                          {isInactive ? 'Inactive' : 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="admin-roster-role-column">
                      <span className={`admin-role-badge ${getRoleTone(roleLabel)}`}>{roleLabel}</span>
                    </div>

                    <div className="admin-roster-meta">
                      <span className="admin-roster-meta-label">Last active</span>
                      <strong>{lastActive}</strong>
                    </div>

                    <div className="admin-roster-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-compact"
                        onClick={() => setEditingMember(member)}
                      >
                        <Pencil size={15} aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`admin-btn admin-btn-compact ${
                          isInactive ? 'admin-btn-success-soft' : 'admin-btn-danger-soft'
                        }`}
                        disabled={isUpdating}
                        onClick={() => openStatusConfirm(member)}
                      >
                        {isInactive ? (
                          <>
                            <RotateCcw size={15} aria-hidden="true" />
                            {isUpdating ? 'Updating…' : 'Reactivate'}
                          </>
                        ) : (
                          <>
                            <Power size={15} aria-hidden="true" />
                            {isUpdating ? 'Updating…' : 'Deactivate'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className={`admin-btn admin-btn-icon admin-btn-expand${isExpanded ? ' is-expanded' : ''}`}
                        aria-label={isExpanded ? 'Collapse member details' : 'Expand member details'}
                        aria-expanded={isExpanded}
                        disabled={!hasExpandedDetails}
                        onClick={() => toggleExpanded(member.uid)}
                      >
                        <ChevronDown size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && hasExpandedDetails ? (
                    <div className="admin-roster-expanded">
                      {member.membershipNumber ? (
                        <p>
                          <span>Membership</span>
                          <strong>#{member.membershipNumber}</strong>
                        </p>
                      ) : null}
                      {member.emergencyContactName || member.emergencyContactNumber ? (
                        <p>
                          <span>Emergency</span>
                          <strong>
                            {member.emergencyContactName ?? '—'}
                            {member.emergencyContactNumber ? ` · ${member.emergencyContactNumber}` : ''}
                          </strong>
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <CreateMemberModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <EditMemberModal
        member={editingMember}
        isOpen={editingMember !== null}
        onClose={() => setEditingMember(null)}
      />
      <MemberStatusConfirmModal
        member={statusConfirmMember}
        isOpen={statusConfirmMember !== null}
        submitting={statusConfirmMember !== null && statusUpdatingUid === statusConfirmMember.uid}
        error={statusConfirmError}
        onClose={closeStatusConfirm}
        onConfirm={() => {
          if (statusConfirmMember) {
            void handleStatusChange(statusConfirmMember);
          }
        }}
      />
    </>
  );
}
