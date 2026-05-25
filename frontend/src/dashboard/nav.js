import {
  LayoutDashboard,
  CandlestickChart,
  Radio,
  Bot,
  Layers,
  Users,
  Settings,
  LineChart,
  Gem,
  CreditCard,
} from "lucide-react";

export const APP_NAV = [
  {
    section: "Main",
    items: [
      { label: "Overview", to: "/app", icon: LayoutDashboard, end: true },
      { label: "Analytics", to: "/app/analytics", icon: LineChart },
    ],
  },
  {
    section: "Trading",
    items: [
      { label: "Terminal", to: "/app/terminal", icon: CandlestickChart, badge: "Live" },
      { label: "Signals", to: "/app/signals", icon: Radio },
      { label: "Automation", to: "/app/automation", icon: Bot },
    ],
  },
  {
    section: "Earn",
    items: [
      { label: "Trading Pool", to: "/app/pool", icon: Layers },
      { label: "VITRIOL", to: "/app/vitriol", icon: Gem },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Affiliate", to: "/app/affiliate", icon: Users },
      { label: "Subscriptions", to: "/app/subscriptions", icon: CreditCard },
    ],
  },
];

export const APP_NAV_FOOTER = [
  { label: "Settings", to: "/app/settings", icon: Settings },
];
