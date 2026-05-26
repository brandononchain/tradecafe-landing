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
  BookOpen,
  MessageSquare,
  Globe,
  Boxes,
  Pickaxe,
} from "lucide-react";

export const APP_NAV = [
  {
    section: "Main",
    items: [
      { label: "Overview", to: "/app", icon: LayoutDashboard, end: true },
      { label: "Analytics", to: "/app/analytics", icon: LineChart },
      { label: "Journal", to: "/app/journal", icon: BookOpen },
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
      { label: "Mining Pool", to: "/app/mining", icon: Pickaxe },
      { label: "VITRIOL", to: "/app/vitriol", icon: Gem },
    ],
  },
  {
    section: "Community",
    items: [
      { label: "VITchat", to: "/app/vitchat", icon: MessageSquare },
      { label: "VITworld", to: "/app/vitworld", icon: Globe },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Products", to: "/app/products", icon: Boxes },
      { label: "Card", to: "/app/card", icon: CreditCard },
      { label: "Affiliate", to: "/app/affiliate", icon: Users },
      { label: "Subscriptions", to: "/app/subscriptions", icon: CreditCard },
    ],
  },
];

export const APP_NAV_FOOTER = [
  { label: "Settings", to: "/app/settings", icon: Settings },
];
