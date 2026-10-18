/** Split header: title on the left, supporting copy on the right at desktop widths. */
export default function SectionHeader({ id, title, children }) {
  return (
    <div className="grid gap-5 border-b border-line pb-8 md:grid-cols-12 md:gap-8">
      <h2 id={id} className="section-title md:col-span-6">
        {title}
      </h2>
      {children && <div className="text-lg leading-relaxed text-ink-muted md:col-span-6 md:pt-1">{children}</div>}
    </div>
  );
}
