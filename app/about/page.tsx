export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p className="eyebrow">About</p>
          <h1 className="hero-title">
            A public, structured roadmap for machine learning and AI interviews.
          </h1>
          <p className="hero-copy">
            The mission is simple: give candidates a clear prep system for ML,
            deep learning, GenAI, ML system design, and MLOps interviews without
            forcing them into expensive or opaque platforms on day one.
          </p>
        </div>

        <aside className="section-card rounded-[32px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Product position
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
            <p>More structured than blogs.</p>
            <p>More specialized than generic roadmap sites.</p>
            <p>More open than interview platforms that lock the best material behind login walls.</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="section-card rounded-[28px] p-6">
          <h2 className="font-display text-3xl font-bold text-foreground">
            What the MVP includes
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            <li>• Public homepage and roadmap navigation</li>
            <li>• 30, 60, and 90-day tracks</li>
            <li>• Pillar pages and topic cards</li>
            <li>• Question bank and case-study library</li>
            <li>• Curated resources and SEO-oriented blog scaffolding</li>
          </ul>
        </article>

        <article className="section-card rounded-[28px] p-6">
          <h2 className="font-display text-3xl font-bold text-foreground">
            What comes next
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            <li>• Saved progress and bookmarking</li>
            <li>• Interview readiness scoring per user</li>
            <li>• AI-generated study plans from resumes and job descriptions</li>
            <li>• Mock interview simulations with scoring and feedback</li>
            <li>• Community contribution workflows and peer practice</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
