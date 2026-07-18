import { cn } from "../../lib/utils";

const PageHeader = ({ title, subtitle, children, className }) => {
  return (
    <div className={cn("mb-8 flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg shadow-black/20 backdrop-blur md:flex-row md:items-end md:justify-between md:p-6", className)}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Gloss Pharma ERP</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>

      {children}
    </div>
  );
};

export default PageHeader;