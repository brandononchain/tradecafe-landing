import { useState } from "react";
import { User, ShieldCheck, KeyRound, Bell, Globe } from "lucide-react";
import { PageHead, Panel } from "../ui";
import Modal, { ModalField, ModalInput } from "../components/Modal";
import TradeAccountModal from "../components/TradeAccountModal";
import { useNotifications } from "../NotificationContext";
import { usePersistentState } from "../lib/usePersistentState";
import { ACCOUNT } from "../data";

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`tc-switch ${on ? "is-on" : ""}`}
      role="switch"
      aria-checked={on}
    >
      <span className="tc-switch-knob" />
    </button>
  );
}

function Row({ icon: Icon, title, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
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
  const { notify } = useNotifications();
  const [twoFA, setTwoFA] = usePersistentState("tc-2fa", ACCOUNT.twoFA);
  const [alerts, setAlerts] = usePersistentState("tc-alerts", true);
  const [emails, setEmails] = usePersistentState("tc-emails", false);

  const [profile, setProfile] = usePersistentState("tc-profile", { username: ACCOUNT.username, email: ACCOUNT.email });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [apiOpen, setApiOpen] = useState(false);

  const openEdit = () => { setDraft(profile); setEditing(true); };
  const saveProfile = () => {
    setProfile(draft);
    setEditing(false);
    notify({ type: "system", title: "Profile updated", body: "Your account details were saved." });
  };
  const toggle2FA = () => {
    setTwoFA((v) => {
      const next = !v;
      notify({ type: "system", title: next ? "Two-factor enabled" : "Two-factor disabled", body: next ? "Your account is now more secure." : "We recommend keeping 2FA on." });
      return next;
    });
  };

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Account & Security" title="Settings" desc="Manage your profile, security, API keys, and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel icon={User} title="Profile">
          <div className="flex flex-col gap-3">
            <Field label="Username" value={profile.username} />
            <Field label="Email" value={profile.email} />
            <Field label="Member since" value={ACCOUNT.memberSince} />
          </div>
          <button className="tc-btn tc-btn-ghost w-full mt-4" onClick={openEdit} data-testid="edit-profile">Edit profile</button>
        </Panel>

        <Panel icon={ShieldCheck} title="Security">
          <div className="flex flex-col gap-3">
            <Row icon={ShieldCheck} title="Two-Factor Auth" sub={twoFA ? "Enabled" : "Disabled — recommended"}>
              <Toggle on={twoFA} onClick={toggle2FA} />
            </Row>
            <Row icon={KeyRound} title="API Keys" sub="Connect exchanges for auto-trading">
              <button className="tc-btn tc-btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => setApiOpen(true)} data-testid="manage-api">Manage</button>
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

      {editing && (
        <Modal title="Edit profile" sub="Account details" onClose={() => setEditing(false)}
          footer={
            <>
              <button className="tc-btn tc-btn-ghost flex-1" onClick={() => setEditing(false)}>Cancel</button>
              <button className="tc-btn tc-btn-primary flex-1" disabled={!draft.username.trim() || !draft.email.trim()}
                style={(!draft.username.trim() || !draft.email.trim()) ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                onClick={saveProfile} data-testid="save-profile">Save changes</button>
            </>
          }>
          <ModalField label="Username">
            <ModalInput value={draft.username} onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))} data-testid="profile-username" />
          </ModalField>
          <ModalField label="Email">
            <ModalInput type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} data-testid="profile-email" />
          </ModalField>
        </Modal>
      )}
      {apiOpen && <TradeAccountModal initialMode="exchange" onClose={() => setApiOpen(false)} />}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45">{label}</span>
      <span className="text-[13px] text-white/85 font-medium truncate ml-3">{value}</span>
    </div>
  );
}
