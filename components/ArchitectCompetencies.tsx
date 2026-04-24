import { architectCompetencies } from "@/lib/site-data";

export default function ArchitectCompetencies() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {architectCompetencies.map((item) => (
        <article key={item.id} className="section-card rounded-[24px] p-6">
          <p className="kicker">{`Competency ${item.id.split("-")[0]}`}</p>
          <h3 className="mt-3 font-display text-xl font-bold text-foreground md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-3 text-[0.98rem] leading-7 text-foreground">
            {item.prompt}
          </p>

          <div className="mt-5 space-y-3">
            <p className="panel-label">Signals interviewers score</p>
            <ul className="space-y-2 text-sm leading-7 text-muted">
              {item.signals.map((signal) => (
                <li key={signal} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tone-accent mt-6 rounded-[1.1rem] px-4 py-3 text-sm leading-6">
            <span className="font-semibold">Prep cue · </span>
            {item.preparationCue}
          </div>
        </article>
      ))}
    </div>
  );
}
