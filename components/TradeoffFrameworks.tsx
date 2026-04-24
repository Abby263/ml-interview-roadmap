import { tradeoffFrameworks } from "@/lib/site-data";

export default function TradeoffFrameworks() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {tradeoffFrameworks.map((item) => (
        <article key={item.title} className="section-card rounded-[24px] p-6">
          <p className="kicker">Trade-off</p>
          <h3 className="mt-3 font-display text-xl font-bold text-foreground">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            <span className="font-semibold text-foreground">Where it shows up · </span>
            {item.whenItAppears}
          </p>
          <div className="mt-5">
            <p className="panel-label">Axes to compare</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.axes.map((axis) => (
                <span
                  key={axis}
                  className="rounded-full border border-line bg-surface-strong px-3 py-1 text-xs font-medium text-foreground"
                >
                  {axis}
                </span>
              ))}
            </div>
          </div>
          <div className="surface-muted mt-5 rounded-[1rem] border border-line px-4 py-3 text-sm leading-6 text-foreground">
            <span className="font-semibold">Default stance · </span>
            {item.defaultStance}
          </div>
        </article>
      ))}
    </div>
  );
}
