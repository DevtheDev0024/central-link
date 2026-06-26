import type { MemberNotification } from '../types/notifications';

const memberNotificationFixtures: MemberNotification[] = [];

export function getMemberNotifications(_memberEmail: string) {
  return memberNotificationFixtures;
}
