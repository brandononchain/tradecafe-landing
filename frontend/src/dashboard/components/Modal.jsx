import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ title, sub, onClose, children, footer, width = 460 }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" data-testid="modal">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full rounded-2xl bg-surface border border-white/[0.05] max-h-[88vh] overflow-y-auto shadow-2xl"
        style={{ maxWidth: width }}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-white/[0.045] sticky top-0 bg-surface z-10">
          <div>
            <div className="text-[15px] font-semibold text-tradeWhite">{title}</div>
            {sub && <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/40 mt-0.5">{sub}</div>}
          </div>
          <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={onClose} aria-label="Close">
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-white/[0.045] flex gap-2.5">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function ModalField({ label, children }) {
  return (
    <label className="block mb-3.5">
      <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45 block mb-2">{label}</span>
      {children}
    </label>
  );
}

export function ModalInput(props) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[13px] text-white outline-none focus:border-tradeTeal/40 transition-colors"
    />
  );
}
