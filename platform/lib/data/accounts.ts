import type { AdminAccount } from "@/lib/types";

export const ADM_ACCOUNTS: AdminAccount[] = [
  {
    id: "A001", name: "Northern HVAC Ltd",         email: "dealer.a@hvac.ca",
    biz: "Northern HVAC Ltd", stage: "blue",  status: "Active",
    mrr: 1899, lastLogin: "2min ago", tier: 3,
    phone: "+1 604 555 0101", city: "North Vancouver, BC",
    joinDate: "Jan 2024", notes: "Top performer, renewal Apr 2025",
  },
  {
    id: "A002", name: "North Van HVAC Solutions",  email: "john@northvanhvac.ca",
    biz: "North Van HVAC Solutions", stage: "green", status: "Active",
    mrr: 999, lastLogin: "Now", tier: 1,
    phone: "+1 604 555 0142", city: "North Vancouver, BC",
    joinDate: "Mar 2024", notes: "",
  },
  {
    id: "A005", name: "Fraser Valley Heat & Air",  email: "dealer.c@hvac.ca",
    biz: "Fraser Valley Heat & Air", stage: "orange", status: "At Risk",
    mrr: 999, lastLogin: "9 days ago", tier: 1,
    phone: "+1 604 555 0105", city: "Abbotsford, BC",
    joinDate: "Oct 2024", notes: "Payment failed — card declined. Login issues reported.",
  },
  {
    id: "A008", name: "Coquitlam HVAC Services",   email: "dealer.d@hvac.ca",
    biz: "Coquitlam HVAC Services", stage: "orange", status: "New",
    mrr: 0, lastLogin: "3 weeks ago", tier: 0,
    phone: "+1 604 555 0108", city: "Coquitlam, BC",
    joinDate: "Apr 2025", notes: "Trial ends May 31. Follow up to convert.",
  },
];

/** Demo login credentials — replace with real auth in production */
export const DEMO_ACCOUNTS = [
  { email: "john@northvanhvac.ca", password: "demo123",  role: "dealer" as const },
  { email: "admin@mszrme.com",     password: "admin123", role: "admin"  as const },
  { email: "new@hvacdealer.ca",    password: "welcome1", role: "new"    as const },
];
