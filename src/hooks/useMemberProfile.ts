import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';

type MemberProfile = {
  displayName: string;
  email: string;
  membershipNumber: string;
  roleLabel: string;
  initials: string;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function useMemberProfile(): MemberProfile {
  const { user, isAdmin } = useAuth();
  const [clubRole, setClubRole] = useState<string | null>(null);
  const [firestoreName, setFirestoreName] = useState<string | null>(null);
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setClubRole(null);
      setFirestoreName(null);
      setMembershipNumber(null);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'members', user.uid), (snapshot) => {
      const data = snapshot.data();
      setClubRole(data?.clubRole ? String(data.clubRole) : null);
      setFirestoreName(data?.displayName ? String(data.displayName) : null);
      setMembershipNumber(data?.membershipNumber ? String(data.membershipNumber) : null);
    });

    return unsubscribe;
  }, [user?.uid]);

  const displayName =
    firestoreName?.trim() || user?.displayName?.trim() || user?.email?.split('@')[0] || 'Member';
  const email = user?.email ?? '';

  const roleParts = ['Member'];
  if (clubRole && clubRole !== 'Member') {
    roleParts.push(clubRole);
  } else if (isAdmin) {
    roleParts.push('Admin');
  }

  return {
    displayName,
    email,
    membershipNumber: membershipNumber?.trim() ?? '',
    roleLabel: roleParts.join(' • '),
    initials: getInitials(displayName),
  };
}
