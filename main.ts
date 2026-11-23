// x-agent-builds-a-game entry for @hifikun (Node 22, standard library only).
// The entry is the X video itself: a 21.6s vertical clip about an AI coding
// agent building a tiny browser game from one prompt while you watch, made by
// the agent in a recorded session with ffmpeg from make.fun's press pack
// (brand badge from the first frame, referral end card with code 6a1ay90r at
// the end). The video is posted publicly on X; POST.json names its address
// and this program copies POST.json from the repository root to
// /output/POST.json, where the gate reads it. Nothing this program writes
// about the post is scored — the house reads the post's views and
// interactions from X.
//
// The video (v2, 21.6s, 1080x1920): the creative, decided in-session.
//   1. Hook (0–4s): the one prompt types itself on screen — "Build me a tiny
//      snake game" — one sentence anyone can imagine typing. Curiosity is the
//      hook: what can a single sentence build?
//   2. The agent builds (4–9.6s): code writes itself in the editor, the
//      terminal runs it. Real files, real commands, no mockup.
//   3. It plays (9.6–17.6s): the finished Neon Snake game actually running
//      — the autopilot snake hunts the magenta orb, the score climbs. The
//      payoff proves the build is real.
//   4. Call to action + end card (17.6–21.6s): "Come build on make.fun",
//      then make.fun's referral end card with referral code 6a1ay90r.
// Bottom step labels ("1 · ONE PROMPT" / "2 · THE AGENT BUILDS" /
// "3 · IT PLAYS") keep the three beats readable on a phone even under the
// make.fun badge. Ken Burns slow zoom keeps the static scenes moving.
// A female voiceover narrates the three beats; CC0 music sits low under it.
// Rendered in-session with ffmpeg only (free, $0).
//
// The game below is the same Neon Snake from the video, ported to Node:
// 20x24 grid, snake starts at [{9,12},{8,12},{7,12}] moving right, the
// autopilot picks the safe step closest to the orb (Manhattan distance plus
// a small penalty for hugging a wall), eating grows the snake by one and
// scores one, walls and the snake's own body end the run. The demo plays a
// headless run with a seeded orb placer so it is reproducible, then this
// program hands in POST.json. That is all the program has to do.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Neon Snake: the game from the video, headless -----------------------

const COLS = 20;
const ROWS = 24;
const MAX_TICKS = 120;

type Point = { x: number; y: number };

// Seeded PRNG (mulberry32) so the demo run is reproducible.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class NeonSnake {
  snake: Point[] = [
    { x: 9, y: 12 },
    { x: 8, y: 12 },
    { x: 7, y: 12 },
  ];
  dir: Point = { x: 1, y: 0 };
  orb: Point;
  score = 0;
  alive = true;
  tick = 0;
  private rand: () => number;

  constructor(seed = 20261123) {
    this.rand = mulberry32(seed);
    this.orb = this.placeOrb();
  }

  private placeOrb(): Point {
    for (;;) {
      const p = {
        x: Math.floor(this.rand() * COLS),
        y: Math.floor(this.rand() * ROWS),
      };
      if (!this.snake.some((s) => s.x === p.x && s.y === p.y)) return p;
    }
  }

  private hits(x: number, y: number): boolean {
    return (
      x < 0 ||
      y < 0 ||
      x >= COLS ||
      y >= ROWS ||
      this.snake.some((s) => s.x === x && s.y === y)
    );
  }

  // Autopilot: the safe step that gets closest to the orb.
  private autopilot(): void {
    const head = this.snake[0];
    const candidates: Point[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ].filter((d) => !(d.x === -this.dir.x && d.y === -this.dir.y));
    let best: Point | null = null;
    let bestScore = Infinity;
    for (const d of candidates) {
      const nx = head.x + d.x;
      const ny = head.y + d.y;
      if (this.hits(nx, ny)) continue;
      const dist = Math.abs(nx - this.orb.x) + Math.abs(ny - this.orb.y);
      const wall =
        nx === 0 || ny === 0 || nx === COLS - 1 || ny === ROWS - 1 ? 0.6 : 0;
      if (dist + wall < bestScore) {
        bestScore = dist + wall;
        best = d;
      }
    }
    if (best) this.dir = best;
  }

  step(): void {
    if (!this.alive) return;
    this.tick++;
    this.autopilot();
    const head = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y,
    };
    if (this.hits(head.x, head.y)) {
      this.alive = false;
      return;
    }
    this.snake.unshift(head);
    if (head.x === this.orb.x && head.y === this.orb.y) {
      this.score++;
      this.orb = this.placeOrb();
    } else {
      this.snake.pop();
    }
  }

  // Headless demo: play until the snake scores 10 (a full run), the run
  // ends, or the tick cap is hit.
  demo(): { score: number; length: number; ticks: number; alive: boolean } {
    while (this.alive && this.tick < MAX_TICKS && this.score < 10) this.step();
    return {
      score: this.score,
      length: this.snake.length,
      ticks: this.tick,
      alive: this.alive,
    };
  }
}

// --- Hand in the post -----------------------------------------------------

const postPath = join(BOT_DIR, 'POST.json');
const postUrl = (JSON.parse(readFileSync(postPath, 'utf8')) as { url: string })
  .url;
// The gate only accepts an X post address of the shape
// https://x.com/<handle>/status/<digits> — check it before copying so a
// placeholder or a non-post address fails loudly here instead of at grading.
if (!/^https:\/\/(x\.com|twitter\.com|mobile\.twitter\.com|www\.twitter\.com)\/[^/]+\/status\/\d+$/.test(postUrl)) {
  console.error(`POST.json url is not an X post address: ${postUrl}`);
  process.exit(1);
}

const game = new NeonSnake();
const result = game.demo();
if (result.score < 1) {
  console.error('Neon Snake demo scored 0 — the game did not run.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(
    `POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`,
  );
  process.exit(1);
}
console.log(
  `POST.json copied: ${postUrl} (Neon Snake demo: score ${result.score}, length ${result.length}, ${result.ticks} ticks)`,
);
