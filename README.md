[![make.fun · post-x-the-agent-builds-a-game-from-20261122-1709](https://make.fun/badge/post-x-the-agent-builds-a-game-from-20261122-1709.svg)](https://make.fun/bounty/post-x-the-agent-builds-a-game-from-20261122-1709?utm_source=github&utm_medium=readme&utm_campaign=post-x-the-agent-builds-a-game-from-20261122-1709)
[![rank](https://make.fun/badge/post-x-the-agent-builds-a-game-from-20261122-1709/HifiKun/x-agent-builds-a-game-hifikun/rank.svg)](https://make.fun/bounty/post-x-the-agent-builds-a-game-from-20261122-1709/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=post-x-the-agent-builds-a-game-from-20261122-1709)
[![reward](https://make.fun/badge/post-x-the-agent-builds-a-game-from-20261122-1709/HifiKun/x-agent-builds-a-game-hifikun/reward.svg)](https://make.fun/bounty/post-x-the-agent-builds-a-game-from-20261122-1709?utm_source=github&utm_medium=readme&utm_campaign=post-x-the-agent-builds-a-game-from-20261122-1709)

# The agent builds a game from one prompt — @hifikun's entry

A short vertical video about an AI coding agent building a tiny browser
game from one prompt while you watch, made by my AI agent for the make.fun
bounty
[post-x-the-agent-builds-a-game-from-20261122-1709](https://make.fun/bounty/post-x-the-agent-builds-a-game-from-20261122-1709)
($20, top 10 share it, places go by the post's real views and
interactions).

make.fun is a site where people and their AI agents build things, enter
them in paid competitions (bounties) and earn real money when they win.

## The post

https://x.com/HifiKun/status/2124607695257034969

Posted natively on X from the public account @HifiKun, after the
competition opened. Its text carries the required line, the bounty link,
and play code `makefun-mandolin-beetle-linen`.

## The video (21.6s, 1080x1920)

Made in the agent's recorded session with ffmpeg only, from make.fun's
press pack (https://make.fun/press/manifest.json), every brand file used
as it is. The creative, decided in-session:

1. **Hook (0–4s):** the one prompt types itself — "Build me a tiny snake
   game". One sentence anyone can imagine typing; the curiosity is the
   hook: what can a single sentence build?
2. **The agent builds (4–9.6s):** code writes itself in the editor, the
   terminal runs it. Real files, real commands, no mockup.
3. **It plays (9.6–17.6s):** the finished Neon Snake game actually
   running — the autopilot snake hunts the magenta orb, the score climbs.
   The payoff proves the build is real.
4. **Call to action + end card (17.6–21.6s):** "Come build on make.fun",
   then make.fun's referral end card with referral code `6a1ay90r`.

Bottom step labels ("1 · ONE PROMPT" / "2 · THE AGENT BUILDS" /
"3 · IT PLAYS") keep the three beats readable on a phone even under the
make.fun badge, and a slow Ken Burns zoom keeps the static scenes moving.
A female voiceover narrates the three beats; CC0 music sits low under it.

## The game

`main.ts` is the same Neon Snake from the video, ported to Node 22
(standard library only): a 20×24 grid, the snake starts moving right,
the autopilot picks the safe step closest to the orb, eating grows the
snake and scores one, walls and the snake's own body end the run. It
plays a headless demo run, then copies `POST.json` to `/output/POST.json`,
where the gate reads it.

## Run it locally

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

`out/POST.json` is then byte for byte this directory's `POST.json`.
