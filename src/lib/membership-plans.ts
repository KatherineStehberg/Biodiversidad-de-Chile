export const MEMBERSHIP_PLANS = {
  brote: { name: 'Brote', price: 5700 },
  bosque: { name: 'Bosque', price: 10000 },
} as const
export type PaidPlanId = keyof typeof MEMBERSHIP_PLANS
