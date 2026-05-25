import { useState } from "react";
import { User, ShieldCheck, KeyRound, Bell, Globe } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { ACCOUNT } from "../data";

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-tradeTeal" : "bg-white/12"}`}
      role="switch"
      aria-checked={on}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(20px)" : "none" }}
      />
    </button>
  );
}

function Row({ icon: Icon, title, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="tc-action-ico shrink-0"><Icon className="w-4 h-4" strokeWidth={2} /></span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-tradeWhite">{title}</div>
          {sub && <div className="text-[11.5px] text-white/45 truncate">{sub}</div>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [twoFA, setTwoFA] = useState(ACCOUNT.twoFA);
  const [alerts, setAlerts] = useState(true);
  const [emails, setEmails] = useState(false);

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Account & Security" title="Settings" desc="Manage your profile, security, API keys, and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel icon={User} title="Profile">
          <div className="flex flex-col gap-3">
            <Field label="Username" value={ACCOUNT.username} />
            <Field label="Email" value={ACCOUNT.email} />
            <Field label="Member since" value={ACCOUNT.memberSince} />
          </div>
          <button className="tc-btn tc-btn-ghost w-full mt-4">Edit profile</button>
        </Panel>

        <Panel icon={ShieldCheck} title="Security">
          <div className="flex flex-col gap-3">
            <Row icon={ShieldCheck} title="Two-Factor Auth" sub={twoFA ? "Enabled" : "Disabled — recommended"}>
              <Toggle on={twoFA} onClick={() => setTwoFA((v) => !v)} />
            </Row>
            <Row icon={KeyRound} title="API Keys" sub="Connect exchanges for auto-trading">
              <button className="tc-btn tc-btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }}>Manage</button>
            </Row>
          </div>
        </Panel>

        <Panel icon={Bell} title="Notifications">
          <div className="flex flex-col gap-3">
            <Row icon={Bell} title="Signal alerts" sub="Push notifications for new signals">
              <Toggle on={alerts} onClick={() => setAlerts((v) => !v)} />
            </Row>
            <Row icon={Bell} title="Email summaries" sub="Weekly performance digest">
              <Toggle on={emails} onClick={() => setEmails((v) => !v)} />
            </Row>
          </div>
        </Panel>

        <Panel icon={Globe} title="Preferences">
          <div className="flex flex-col gap-3">
            <Field label="Language" value={ACCOUNT.language} />
            <Field label="Timezone" value="UTC" />
            <Field label="Theme" value="TradeCafe Dark" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
      <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45">{label}</span>
      <span className="text-[13px] text-white/85 font-medium truncate ml-3">{value}</span>
    </div>
  );
}
