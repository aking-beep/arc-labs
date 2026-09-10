# ☁️ AWS Quest — Andrew's Cloud Journey

A playable, retro pixel-RPG map of Andrew King's daily AWS lessons. You play a
cloud-knight who walks a continent — **Streaming Coast → Query Canyon →
Governance Keep → Audit Citadel** — where every glowing waypoint is a *real*
lesson. Professor Mac hands you the actual architecture scenario from that
lesson; make the right call to forge its artifact and earn XP.

Not a quiz app. A tangible way to *walk* the curriculum.

## Play it

Open `index.html` in a browser. That's it — it's a single, dependency-free file.

- In **Cursor**: right-click `index.html` → *Open with Live Server* (or just open
  the file in your browser).
- Controls: **← ↑ ↓ →** or **W A S D** to move; **Enter** / **Space** to enter a
  waypoint.
- Progress (XP, level, badges, cleared lessons) saves automatically via
  `localStorage`.

## What's wired in (prototype v1)

Eight lessons across four regions, forming the data-engineering arc:

| Region | Lessons |
|---|---|
| Streaming Coast | L066 Kinesis Data Streams · L067 Stream Transformation |
| Query Canyon | L068 Querying the Data Lake · L069 Pipeline Orchestration |
| Governance Keep | L070 Data Quality · L071 Lake Formation · L072 Access Auditing |
| Audit Citadel | ⚔️ L073 Durable Audit at Scale (boss) |

Each waypoint offers a role-play scenario, a link to **open the real lesson
`.docx`**, and a **Coursera** search for deeper study.

## Add a lesson (this is the whole point)

The game is fully data-driven. To add tomorrow's lesson, push **one object** into
the `LESSONS` array in `index.html` (look for the comment block at the top of
`<script>`):

```js
{
  id:"L074", region:"citadel", x:2560, y:200, color:"#c0392b", depth:3,
  title:"Your Lesson Title",
  macIntro:"The role-play scenario Professor Mac poses...",
  choices:[
    {t:"A wrong option", correct:false, fb:"why it's wrong"},
    {t:"The right call",  correct:true,  fb:"why it's right"},
    {t:"Another wrong option", correct:false, fb:"why it's wrong"},
  ],
  artifact:"🏆 Reward Name",
  doc:"Lesson_074_YYYY-MM-DD_Title.docx", // exact filename in the Drive folder
  course:CO("search terms for Coursera"),
},
```

Rendering, XP, badges, the region bands, and the win condition all pick it up
automatically. To add a whole new region, add an entry to `REGIONS` and extend
the `regionAt(x)` boundaries.

## Roadmap ideas

- Grow the world westward as new lessons drop (one node per day).
- Region bosses at each depth-3 lesson.
- A "codex" that pulls the lesson's SVG one-pager into an in-game panel.
- Sound, sprites, and an overworld/zoom map.
- Auto-append: a script that reads the lesson index and generates new nodes.

## A note on the "Open the real lesson" links

Those buttons use `computer://` paths to the lessons in Google Drive. They
resolve when you open `index.html` from **this Mac**. If you host the game
elsewhere (e.g. GitHub Pages), swap them for public URLs or bundle the docs.

## Tech

Single-file HTML5 canvas. No build step, no dependencies, no framework. ~26 KB.

---
Part of Andrew King's **Personal Growth OS**.
