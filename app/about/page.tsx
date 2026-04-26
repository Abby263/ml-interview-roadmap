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
            deep learning, MLOps, GenAI, LLMOps, and ML system design interviews
            without forcing them into expensive or opaque platforms on day one.
          </p>
          <p className="max-w-3xl text-base leading-8 text-muted">
            The project is now developed as a public GitHub repository with an
            explicit CI/CD path: automated lint and build checks on pushes and
            pull requests, release automation for version tags, and Vercel
            deployment workflow scaffolding for production delivery. The live
            app is available at{" "}
            <a
              className="font-semibold text-foreground underline decoration-border underline-offset-4 transition hover:text-accent"
              href="https://ml-interview-roadmap.vercel.app"
              rel="noreferrer"
              target="_blank"
            >
              ml-interview-roadmap.vercel.app
            </a>
            .
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
            <p>More transparent because the content, workflows, and delivery pipeline are visible in public.</p>
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
            <li>• Ordered pillar pages and topic cards from statistics to ML system design</li>
            <li>• Question bank and case-study library</li>
            <li>• Curated resources and SEO-oriented blog scaffolding</li>
            <li>• Public GitHub repo with CI, release, and deployment workflow setup</li>
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

      <section className="grid gap-5 md:grid-cols-3">
        <article className="section-card rounded-[28px] p-6">
          <p className="panel-label">Open repo</p>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            Public by default
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            The repository is intended to be inspectable, forkable, and easy to
            extend by contributors who want to improve ML interview prep
            content, UX, and tooling.
          </p>
        </article>

        <article className="section-card rounded-[28px] p-6">
          <p className="panel-label">CI/CD</p>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            Checks and deploy path
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            GitHub Actions validates the app on push and pull request. Release
            tags create GitHub Releases, and the repo includes a Vercel deploy
            workflow tied to the live production deployment at{" "}
            <a
              className="font-semibold text-foreground underline decoration-border underline-offset-4 transition hover:text-accent"
              href="https://ml-interview-roadmap.vercel.app"
              rel="noreferrer"
              target="_blank"
            >
              ml-interview-roadmap.vercel.app
            </a>
            .
          </p>
        </article>

        <article className="section-card rounded-[28px] p-6">
          <p className="panel-label">Content model</p>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            Content-first foundation
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Roadmaps, blog posts, and case studies are stored in versioned MDX
            so the platform can scale through clear editorial workflows rather
            than hidden CMS state.
          </p>
        </article>
      </section>
    </div>
  );
}
