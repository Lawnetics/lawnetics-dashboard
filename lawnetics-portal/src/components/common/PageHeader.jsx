export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="font-serif text-[1.65rem] font-bold text-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-[0.79rem] text-text-3 mt-[0.18rem]">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-[0.55rem] flex-wrap">{actions}</div>}
    </div>
  )
}
