import { ArrowUpRight } from "lucide-react";
import { PageHead, Panel } from "../ui";

export default function ComingSoon({ eyebrow, title, desc, icon: Icon, points = [] }) {
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow={eyebrow} title={title} desc={desc} />

      <Panel glow>
        <div className="tc-soon">
          <span className="tc-soon-ico">{Icon && <Icon className="w-7 h-7" strokeWidth={1.8} />}</span>
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-tradeTeal mb-2">In Progress</div>
            <h2 className="font-heading text-[24px] font-semibold tracking-[-0.02em] text-tradeWhite">
              This module is being crafted
            </h2>
            <p className="text-[14px] text-white/55 mt-3 max-w-[480px] mx-auto leading-[1.6]">
              We&apos;re bringing this experience into the new dashboard with the same calm, premium feel.
              Check back shortly.
            </p>
          </div>
        </div>
      </Panel>

      {points.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {points.map((p) => (
            <Panel key={p.title} hover>
              <div className="text-[14px] font-semibold text-tradeWhite tracking-[-0.01em] flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-tradeTeal" strokeWidth={2} /> {p.title}
              </div>
              <p className="text-[12.5px] text-white/55 mt-1.5 leading-[1.5]">{p.desc}</p>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
