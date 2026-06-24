import type { MarketingInputs } from "@/lib/types";

export const MARKETING_INPUTS: MarketingInputs = {
  region: "North Vancouver, BC",
  weather: [
    { label: "Cooling degree days +18% vs 10-yr avg", impact: "+12–18% cooling demand", window: "Jun–Aug",        hot: true  },
    { label: "First major heat event projected",       impact: "+$28K install pipeline", window: "Jul 8–12",       hot: true  },
    { label: "Above-normal August temps",              impact: "AC service spike likely", window: "75% probability", hot: true },
    { label: "Wildfire smoke season earlier",          impact: "+24% IAQ filter demand", window: "Late Jul onward", hot: false },
  ],
  coop: [
    { name: "Daikin Comfort Pro Co-op",   available: "$4,200", expires: "Aug 31",  match: "50/50", used: "$1,800 / $6,000", total: "$6,000"  },
    { name: "Bosch IDS Dealer Co-op",     available: "$2,800", expires: "Sept 15", match: "50/50", used: "$1,200 / $4,000", total: "$4,000"  },
    { name: "Lennox Premier Dealer",      available: "$1,500", expires: "Dec 31",  match: "40/60", used: "$0 / $1,500",     total: "$1,500"  },
    { name: "Mitsubishi Diamond Dealer",  available: "$3,000", expires: "Dec 31",  match: "50/50", used: "$0 / $3,000",     total: "$3,000"  },
  ],
  utility: [
    { program: "CleanBC Heat Pump Rebate",      audience: "Consumer",   amount: "$3,000–$11,000",  notes: "Stacks with federal", active: true },
    { program: "BC Hydro Power Smart",          audience: "Commercial", amount: "Up to $2,000",    notes: "Per-unit cap",        active: true },
    { program: "FortisBC Dual-Fuel Rebate",     audience: "Consumer",   amount: "Up to $4,000",    notes: "HP + gas furnace",    active: true },
    { program: "Canada Greener Homes Grant",    audience: "Consumer",   amount: "Up to $5,000",    notes: "Year-round",          active: true },
    { program: "Canada Greener Homes Loan",     audience: "Consumer",   amount: "0% up to $40,000",notes: "10-yr term",          active: true },
  ],
};
