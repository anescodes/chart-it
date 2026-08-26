export interface DefaultCategory {
  name: string;
  color: string;
  type: "INCOME" | "EXPENSE";
  iconName: string;
}

export class CategoryDefaults {
  public static readonly LIST: DefaultCategory[] = [
    { name: "Food & Dining", color: "#10b981", type: "EXPENSE", iconName: "Utensils" },
    { name: "Housing & Rent", color: "#6366f1", type: "EXPENSE", iconName: "Home" },
    { name: "Shopping", color: "#f59e0b", type: "EXPENSE", iconName: "ShoppingBag" },
    { name: "Transportation", color: "#06b6d4", type: "EXPENSE", iconName: "Car" },
    { name: "Subscriptions", color: "#8b5cf6", type: "EXPENSE", iconName: "Tv" },
    { name: "Salary", color: "#10b981", type: "INCOME", iconName: "Briefcase" },
  ];
}