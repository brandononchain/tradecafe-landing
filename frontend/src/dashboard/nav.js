import {
  LayoutDashboard,
  CandlestickChart,
  Radio,
  Bot,
  Layers,
  Users,
  Settings,
  LineChart,
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
      { label: "Terminal", to: "/app/terminal", icon: CandlestickChart, badge: "Soon" },
      { label: "Signals", to: "/app/signals", icon: Radio },
      { label: "Automation", to: "/app/automation", icon: Bot },
      { label: "Pool", to: "/app/pool", icon: Layers },
    ],
  },
  {
    section: "Growth",
    items: [
      { label: "Affiliate", to: "/app/affiliate", icon: Users },
    ],
  },
];

export const APP_NAV_FOOTER = [
  { label: "Settings", to: "/app/settings", icon: Settings },
];
