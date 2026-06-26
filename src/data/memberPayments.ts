import type { MemberPaymentSummary } from '../types/payments';

const memberPaymentSummaryFixtures = new Map<string, MemberPaymentSummary>();

export function getMemberPaymentSummary(_memberEmail: string) {
  return memberPaymentSummaryFixtures.get(_memberEmail.toLowerCase()) ?? null;
}
