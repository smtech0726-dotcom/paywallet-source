export interface StaticBiller {
  id: string;
  category:
    | "mobile_recharge"
    | "dth"
    | "electricity"
    | "water"
    | "gas"
    | "broadband"
    | "insurance"
    | "loan_payment";
  name: string;
}

export const BILLERS: StaticBiller[] = [
  { id: "airsphere-prepaid", category: "mobile_recharge", name: "Airsphere Prepaid" },
  { id: "jiofiber-mobile", category: "mobile_recharge", name: "JioFiber Mobile" },
  { id: "vi-prepaid", category: "mobile_recharge", name: "Vi Prepaid" },
  { id: "bsnl-prepaid", category: "mobile_recharge", name: "BSNL Prepaid" },
  { id: "tata-play", category: "dth", name: "Tata Play" },
  { id: "dish-tv", category: "dth", name: "Dish TV" },
  { id: "airsphere-digital-dth", category: "dth", name: "Airsphere Digital TV" },
  { id: "state-electricity-board", category: "electricity", name: "State Electricity Board" },
  { id: "city-power-utility", category: "electricity", name: "City Power Utility" },
  { id: "municipal-water-board", category: "water", name: "Municipal Water Board" },
  { id: "indane-gas", category: "gas", name: "Indane Gas" },
  { id: "hp-gas", category: "gas", name: "HP Gas" },
  { id: "actfiber-broadband", category: "broadband", name: "ActFiber Broadband" },
  { id: "netlink-broadband", category: "broadband", name: "Netlink Broadband" },
  { id: "lifeguard-insurance", category: "insurance", name: "LifeGuard Insurance" },
  { id: "securenow-insurance", category: "insurance", name: "SecureNow Insurance" },
  { id: "quickcredit-loan", category: "loan_payment", name: "QuickCredit Loan EMI" },
  { id: "homefin-loan", category: "loan_payment", name: "HomeFin Loan EMI" },
];

export function findBiller(id: string): StaticBiller | undefined {
  return BILLERS.find((b) => b.id === id);
}

const CATEGORY_LABELS: Record<StaticBiller["category"], string> = {
  mobile_recharge: "Mobile Recharge",
  dth: "DTH",
  electricity: "Electricity",
  water: "Water",
  gas: "Gas",
  broadband: "Broadband",
  insurance: "Insurance",
  loan_payment: "Loan Payment",
};

export function categoryLabel(category: StaticBiller["category"]): string {
  return CATEGORY_LABELS[category];
}
