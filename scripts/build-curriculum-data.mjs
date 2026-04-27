// Topics library + curriculum + generator. Imported by build-curriculum.mjs.

export async function run({ NC, R, nc, ncTrack, daysRoot, weeksPath, root }) {
  const { TOPICS } = await import("./build-curriculum-topics.mjs").then((m) => m.build({ R }));
  const { CURRICULUM, WEEKS } = await import("./build-curriculum-plan.mjs").then((m) => m.build({ TOPICS }));
  const fs = await import("node:fs");
  const path = await import("node:path");

  // Sanity: topics exist
  for (const day of CURRICULUM) {
    for (const tid of day.topics ?? []) {
      if (!TOPICS[tid]) throw new Error(`Day ${day.day}: unknown topic "${tid}"`);
    }
  }

  // Generate each day file
  let written = 0;
  for (const day of CURRICULUM) {
    const tracks = [];

    if (day.dsa) {
      const [cat, start, count] = day.dsa;
      tracks.push(ncTrack(cat, start, count));
    }
    if (day.dsa2) {
      const [cat, start, count] = day.dsa2;
      tracks.push(ncTrack(cat, start, count, `DSA · NeetCode ${cat} (cont.)`));
    }
    for (const tid of day.topics ?? []) {
      const topic = TOPICS[tid];
      tracks.push({ label: topic.trackLabel, items: topic.items });
    }
    if (day.extraTracks) {
      for (const t of day.extraTracks) tracks.push(t);
    }

    // Day-level interview questions
    let dayQuestions = day.interviewQuestions ?? [];
    if (dayQuestions.length === 0) {
      // Pull from first ML topic if available
      for (const tid of day.topics ?? []) {
        if (TOPICS[tid].dayQuestions?.length) {
          dayQuestions = TOPICS[tid].dayQuestions;
          break;
        }
      }
    }

    // ML pillars must have 2-5 day-level questions
    const mlPillars = new Set([
      "math-stats", "traditional-ml", "deep-learning",
      "generative-ai", "llmops", "ml-system-design", "mlops",
    ]);
    if (mlPillars.has(day.pillar)) {
      if (dayQuestions.length < 2) {
        throw new Error(`Day ${day.day} (${day.pillar}) needs 2-5 interview questions, got ${dayQuestions.length}`);
      }
      if (dayQuestions.length > 5) dayQuestions = dayQuestions.slice(0, 5);
    }

    // Normalize per-item interviewQuestions: validator requires 2-5 when present
    for (const track of tracks) {
      track.items = track.items.map((it) => {
        if (it.interviewQuestions && it.interviewQuestions.length < 2) {
          const { interviewQuestions, ...rest } = it;
          return rest;
        }
        if (it.interviewQuestions && it.interviewQuestions.length > 5) {
          return { ...it, interviewQuestions: it.interviewQuestions.slice(0, 5) };
        }
        return it;
      });
    }

    // Dedup item ids per day (validator requires uniqueness)
    const seen = new Set();
    for (const track of tracks) {
      for (const item of track.items) {
        if (seen.has(item.id)) {
          throw new Error(`Day ${day.day}: duplicate item id "${item.id}"`);
        }
        seen.add(item.id);
      }
    }

    // References
    const refs = (day.references ?? []).map((key) => {
      if (typeof key === "string") {
        if (!R[key]) throw new Error(`Day ${day.day}: unknown reference "${key}"`);
        return R[key];
      }
      return key;
    });

    const out = {
      day: day.day,
      title: day.title,
      pillar: day.pillar,
      focus: day.focus,
      tracks,
      interviewQuestions: dayQuestions,
      references: refs,
    };
    if (day.topicId) out.topicId = day.topicId;

    const file = path.join(daysRoot, `day-${String(day.day).padStart(3, "0")}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
    written += 1;
  }

  // Weeks
  fs.writeFileSync(weeksPath, JSON.stringify(WEEKS, null, 2) + "\n");

  // Remove any stale day files beyond the curriculum length
  for (const file of fs.readdirSync(daysRoot)) {
    const m = file.match(/^day-(\d{3})\.json$/);
    if (!m) continue;
    const num = Number(m[1]);
    if (num > CURRICULUM.length) {
      fs.unlinkSync(path.join(daysRoot, file));
    }
  }

  console.log(`Wrote ${written} day files and ${WEEKS.length} weeks.`);
}
