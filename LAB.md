# RECEPCE.TECH LAB

Creative & Technical Direction — source of truth for the Lab experience.

Status: source of truth.
Read together with: `PROJECT_VISION.md`, `VOICE.md`, `GRAMMAR.md`.
Last revision: MVP definition (first pass).

---

## 0. How this document works

This document defines the Lab — the cinematic 3D destination at `/lab`.

The core principle, restated once so it is never forgotten:

> Do not build a website in 3D.
> Build a 3D world that happens to function as a website.

Everything below serves one emotional arc. The visitor should think:

1. "What is this?"
2. "I can explore this."
3. "This is what they are building."
4. "I can actually try it."
5. "This is not a normal company website."

The Lab is not a gimmick layered on top of the website. For the visitor who
enters it, the Lab is the website. The ordinary pages still exist — the Lab
must earn the right to exist instead of them.

### 0.1 Relationship to the rest of the system

The Lab is one surface of Recepce.tech. The graph of questions, observations,
experiments and systems (`src/data/entities.ts`) is the source of content.
Every interactive object in the Lab renders a node of that graph, or a piece
of a story about a node. If a prop has no node behind it, it is decoration —
and decoration is not allowed.

Three rules from the grammar docs apply at full strength inside the Lab:

- **Voice.** Short sentences. One idea each. No marketing vocabulary.
  Confidence is quiet.
- **Grammar.** The cycle `Question → Observation → Experiment → System`
  organizes rooms, objects, and copy. Content is placed on the cycle, never
  off it.
- **Vision.** The Lab strengthens the ecosystem or it does not exist.

### 0.2 Definitions of good

The Lab is good when a person who knows nothing about Recepce.tech finishes
the experience and can say all four of these sentences:

- "I was in a real place."
- "I understood what they build."
- "I tried it myself."
- "I remember it."

Performance is part of that definition. A Lab that takes twenty seconds to
become interactive has failed before the visitor sees anything.

---

## 1. Current prototype baseline

A working prototype already exists at `/lab`
(`src/app/lab/Lab.tsx`, `src/app/lab/LabScene.tsx`,
route: `src/app/(immersive)/lab/page.tsx`). It is the honest starting point
and the proof the core loop is feasible. This spec upgrades it; it does not
replace it from zero.

### 1.1 What exists today

| Capability | State in prototype | Notes |
|---|---|---|
| Entry screen | Basic | Dark screen, "ENTER THE LAB", accent button, click → identity |
| Character creation | Basic | Silhouette / Clothing / Detail (3 options each), 5 accent swatches, optional name ≤ 18 chars, accent-colored confirm button |
| Character in world | Basic | Capsule-ish avatar (head sphere + rounded body + accent torso), shadow ring, floating name label |
| First room | Minimal | One room: floor, three walls, single reception desk with terminal, one monitor, one server-ish box, papers, one chair |
| Click movement | Basic | Floor raycast → click to walk; clamped room bounds; smooth eased step in `useFrame`; camera offsets behind player |
| Camera | Basic | Exponential damped follow (pos `lerp` k≈3.2, lookAt k≈4.2), blends toward terminal when in range |
| Interactive objects | 1 of 6+ | One "Reception Terminal" interact zone; proximity gate (~1.05 m); SPACE/click to start call |
| Product demo | Scripted | 6-stage call sequence: incoming → connected → ai → understood → completed → resolved; status text; final result card with exit button |
| Ambient life | None | Static scene |
| Sound | Minimal | WebAudio-generated room hum + filtered noise; global SOUND toggle |
| HUD | Ad-hoc | Top-left STATUS chip, top-right instruction card, bottom utility buttons |
| Performance | Unmanaged | No DPR cap, no budget tracking, no mobile preset |

### 1.2 Deltas this spec demands

Everything below is the gap between the prototype and the intended
experience. The rest of this document defines each item; section 20 turns
them into an ordered build plan.

1. Real character creation with a live preview, persistence, and restraint.
2. A first room that reads as a place people work in, not a white box with
   three walls and a prop desk.
3. Six interactive objects minimum, each discoverable, each diegetic, each
   wired to real content.
4. An information system where screens become readable in-world instead of
   windows popping over the world.
5. Camera work with focus transitions, not just a follow rig.
6. Ambient life: the room breathes while the visitor does nothing.
7. Sound design with layers, cause, and consequence; quiet by default.
8. The exit moment that resolves the story and converts.
9. A `Skip Lab` fallback and a credible mobile path.
10. Performance budgets enforced from day one.

### 1.3 Structural defects to fix in code

- **Nested `<html>`.** `src/app/layout.tsx` renders `<html><body>` with
  `Navigation` + `Footer`; `src/app/(immersive)/layout.tsx` renders another
  `<html><body>`. A route group layout cannot own `<html>`, and the root
  chrome must not paint over the Lab. Restructure: keep `<html>`/`<body>` in
  the root layout only; move site chrome (`Navigation`, `Footer`) into a
  `(site)` route-group layout, and let `(immersive)` render the bare frame.
  The immersive route group may then define its own dark background and
  viewport rules without fighting the root layout.
- **Route clarity.** The render components live in `src/app/lab/` while the
  page lives in `(immersive)/lab/`. Move the experience into
  `src/components/lab/` (or `src/experience/lab/`) so app folders contain
  only routes. See section 16.
- **No navigation surface linking to `/lab`.** The Lab must be reachable by
  direct link and from the homepage. See section 2.3.

---

## 2. The whole experience in one paragraph

The visitor lands on a nearly black screen. One quiet line of text: the
wordmark, the name of the place, and an invitation — "ENTER". No navbar, no
hero, no scroll. They are asked to make a simple representation of
themselves — silhouette, clothing, color, a small detail, an optional name —
and then they step through a door.

They are in the working room of a small technology studio. A desk with a
phone that rings. A monitor on the wall showing what is being built. A
whiteboard covered in questions. A workstation with code and logs on screen.
A server rack breathing softly in the corner. Papers — real notes, not
lorem — scattered where work happens. The visitor walks by clicking where
they want to be. When they approach something, the camera settles, the world
quietly narrows, and the object opens itself: the phone takes a call, the
monitor tells a story, the papers are read where they lie. When they have
seen enough, a door they passed earlier is now lit. It leads to a calm
closing room with one question: whether they want to build something too.
Then the world is behind them, and the message is: a real message can reach
a real person.

The visitor never browsed. They visited.

---

## 3. Visual identity

### 3.1 The feeling

The Lab is a quiet technology laboratory, a creative studio, and a place
where someone is actually working. It is premium the way a well-made
physical space is premium — material, light, proportion — not the way a
gradient is premium.

References for the emotional register (not for copying):
a working film set after hours; a photography darkroom; a boutique audio
studio; the quiet parts of an airport at night. Warm, low, intentional,
alive.

### 3.2 Palette

Dark, warm-charcoal base with restrained amber accent. The accent is the
existing brand accent — `#c2410c` burnt orange — used sparingly, never as
decoration, only as meaning (what is active, what is reachable, what
happened).

| Role | Token | Hex | Use |
|---|---|---|---|
| Void | `lab-void` | `#050505` | entry screen, fog color, background |
| Surface | `lab-surface` | `#0d0d0e` | walls, floor base, dark furniture |
| Surface lift | `lab-lift` | `#161617` | furniture tops, cases, near objects |
| Metal | `lab-metal` | `#1e1f20` | racks, machines, stands |
| Warm light | `lab-light` | `#3a322a` | lit wall planes under lamps |
| Text primary | `lab-paper` | `#e8e2d6` | readable text, UI labels |
| Text muted | `lab-paper-dim` | `#8d877c` | secondary labels, dim copy |
| Accent | (existing) | `#c2410c` | active, interactive, alerts — meaning only |
| Accent soft | — | `#6b3b1d` | glows, shadows of accent light |
| Paper | — | `#d6cdbd` | physical documents |
| Glass | — | `#9fb2b8` @ 6–12 % | glazing, screens |

Rules:

- Never use the accent as a fill for large surfaces.
- No rainbow gradients, no purple/blue "AI" lighting, no neon.
- Warm light vs. faint cool ambient light is the entire color story
  (see lighting, section 14).
- Screen content is light-on-dark, low contrast, like a real terminal at
  low brightness.

### 3.3 Material language

Everything is matte or softly metallic. No plastic gloss, no chrome, no
vinyl shine.

| Material | Roughness | Metalness | Notes |
|---|---|---|---|
| Painted wall / plaster | 0.95 | 0.00 | the dominant material |
| Warm wood (desk top) | 0.55 | 0.05 | the only warm material |
| Powder-coated metal | 0.65 | 0.35 | racks, stands, cases |
| Brushed metal (subtle) | 0.45 | 0.75 | edges, handles only |
| Glass | 0.08 | 0.0 (transmissive) | screens, cabinet fronts |
| Rubber / plastic dark | 0.85 | 0.05 | cables, small objects |
| Paper | 0.98 | 0.00 | never emissive |

Screens are the only self-lit surfaces, and they emit soft light onto
nearby geometry (a small point light per screen cluster, not per screen).

### 3.4 Typography

The UI is the existing display face of the site — a clean neo-grotesque —
set in uppercase with wide tracking for labels, and sentence case for
readable content. Letterspacing does the hierarchy work that size normally
does. The Lab never shouts; it speaks at small sizes with generous space.

| Element | Style | Notes |
|---|---|---|
| Wordmark / eyebrow | 10 px, uppercase, `+0.28em` tracking | "RECEPCE.TECH", "THE LAB", "01 / RECEPTION" |
| Primary invitation | 11–14 px, uppercase, `+0.18em` | "ENTER", "CREATE YOURSELF" |
| Interface label | 10 px, uppercase, `+0.16em` | object names, states, keys |
| Readable content | 13–15 px, sentence case, 1.5 line-height | the actual information |
| Microcopy | 11 px, muted | hints, empty states, footnotes |
| Camera-only text (in world) | no font under 3 px on screen | legibility floor |

No giant headlines exist anywhere in the Lab. The largest text in the whole
experience is the wordmark on the entry screen.

### 3.5 UI language

The interface is a thin, quiet layer on the glass, styled as if it were a
label engraved on the world, not a dashboard floating over it.

- Every element is a hairline-border rectangle or a plain line of text.
- Backgrounds are `rgba(8,8,9,0.72)` with 6–8 px blur. Never solid panels
  with big radius. Radius ≤ 2 px.
- No cards, no grids, no buttons bigger than the action warrants.
- The only "button" language is a thin underline or a 1 px outline that
  fills with accent on hover. Primary actions fill with solid accent
  (`#c2410c`) — this happens perhaps four times in the whole experience.
- Movement = no pointer change until an object is interactable; then the
  cursor becomes a small ring that fills to 40 % when the trigger is
  confirmed. Never a giant glowing "CLICK" bubble.
- An object that can be opened shows a tiny tag in the world near it:
  its noun. The tag is the affordance. ("TERMINAL", "PHONE", "NOTES".)

### 3.6 Motion language

- Durations: micro-feedback 120–200 ms; world transitions 600–900 ms;
  cinematic focus 900–1400 ms.
- Easing: the site already uses `cubic-bezier(0.22, 1, 0.36, 1)` for UI.
  Use the same curve for world easing. Exponential damp constants for
  camera/movement are documented in sections 8–9.
- Nothing spins. Nothing bounces. Nothing shakes. Rotation only occurs on
  mechanical parts with a reason (a fan, a dial).
- Every motion is eased to rest; nothing moves at constant velocity except
  dust.

### 3.7 What is banned in the image

Cyberpunk, neon, purple/blue "AI" clichés, holograms floating mid-air,
glowing wireframe brains, spinning logos, particle fountains, orbs of light,
lens flares, chromatic aberration, aggressive bloom, gradient buttons,
giant cursor trails, "tech" backgrounds of connected dots. When in doubt,
remove.

---

## 4. The world model

### 4.1 The Lab is a building, not a scene

The long-term Lab is a small facility with several rooms. A visitor moves
between rooms through doors. Every room is a self-contained module: its own
geometry, lighting, object set, and content. Rooms are loaded on approach
and released on exit (section 19).

The facility layout (concept — the rooms are added over time):

```
        ┌─────────────────────────────────────────────┐
        │  ROOM 05 · EXPERIMENTS          (future)    │
        ├───────────────┬─────────────────────────────┤
        │               │                             │
        │  ROOM 03      │   ROOM 04 · BUILD           │
        │  AUTOMATION   │   (the workshop, future)    │
        │  (future)     │                             │
        │               │                             │
        ├───────────────┴───────────┬─────────────────┤
        │                          │                 │
        │   ROOM 01 · RECEPTION     │  ROOM 02 · AI   │
        │   (the working lab, MVP)  │  (future)       │
        │                          │                 │
        └───────────────┬──────────┴─────────────────┘
                        │  ENTRY · where visitors
                        │  arrive and leave
                        └─────────────────────────────
```

Room names double as wayfinding and as content positions. "RECEPTION" is not
a marketing name for a landing zone; it is the literal reception area of the
business — which is exactly what Recepce.tech automates. The building is the
metaphor, and the metaphor is load-bearing.

Room grammar:

| Room | Cycle position | Content it will hold |
|---|---|---|
| 01 Reception | Question | What this place is; the phone that answers |
| 02 AI | Observation | Assistants, conversation, the AI Receptionist system |
| 03 Automation | Experiment | Workflows, integrations, Cortex research pipeline |
| 04 Build | System | How Recepce.tech is built — stack, process, iterations |
| 05 Experiments | New question | Prototypes, concepts, failures, next ideas |
| 06 Future | — | The horizon; what happens when the system asks questions |

The future rooms are not six menu items. They are physical spaces behind
doors. In the MVP only Room 01 exists; a door set into one wall hints at a
dim corridor and a "COMING NEXT" panel beyond it, which doubles as honest
storytelling about a Lab that is itself still being built.

### 4.2 Room conventions (for every room, present and future)

- Floor grid: 10 m × 8 m inside dimensions, ceiling 3.2 m. Origin at room
  center, `y = 0` at floor.
- North wall (`-z` far side) is the "deep" wall where main displays live.
- Entry wall is the south wall. The exit door is always the door you came
  through until the story says otherwise.
- Units are meters. Player radius 0.25 m. Interaction reach 1.15 m.
- Fog per room: color = room void, near 8 m, far 16 m.
- Every room ships with its own `RoomManifest` (section 16.4): bounds,
  spawn, objects, lights, ambience hook, fog, and load priority.

### 4.3 Modular prop kit

Props are built from a small parametric kit so nothing is one-off geometry:
`Desk`, `Chair`, `Screen`, `WallScreen`, `RackUnit`, `Shelf`, `PaperStack`,
`Board`, `Door`, `CableRun`, `CeilingLight`, `FillerObject`. Each accepts
size/material overrides. This keeps polygon budgets predictable and makes
future rooms cheap. Kit primitives are the only hand-made geometry in MVP;
later rooms may use GLB assets but must keep the same manifest contract.

---

## 5. Room 01 · RECEPTION — defined in detail

The first room is the entire MVP stage. It must feel like a real room where
someone works every day on exactly the thing Recepce.tech sells. It is a
reception area of a one-person studio that has been quietly running an AI
reception service — the phone on the desk is real, the notes are real, the
server in the corner is really running something.

### 5.1 Floor plan

```
                          NORTH (deep wall, -z)
   ┌──────────────────────────────────────────────────────┐
   │   WALL MONITOR 02         ┌───────────────┐          │
   │   "what is built"         │ SERVER RACK   │          │
   │   (north wall)            │ 06 · systems  │  east    │
   │                           └───────────────┘  wall    │
   │   ┌────────────────────┐                             │
   │   │ WHITEBOARD 03      │      ┌───────────────┐      │
   │   │ "questions"        │      │  MAIN DESK    │      │
   │   └────────────────────┘      │  PHONE 01     │      │
   │        (west wall, high)      │  the demo     │      │
   │   ┌────────────────────┐      └───────────────┘      │
   │   │ WORKSTATION 04     │              CHAIR           │
   │   │ "how it is built"  │                             │
   │   └────────────────────┘                             │
   │   ┌───┐        ┌──────────────┐                      │
   │   │EXIT│        │ NOTES SHELF  │       ENTRY (south)  │
   │   │ 07 │        │ 05 · story   │            ▲         │
   │   └───┘        └──────────────┘        you arrive    │
   │  (west wall)       (south-west)       through here    │
   └──────────────────────────────────────────────────────┘
                              (sketch, not to scale)
```

### 5.2 Objects and their coordinate anchor (room origin at center)

All positions in meters `(x, z)`, `y` derived from the object type.

The room interior is 10 m × 8 m: `x ∈ [−5, 5]` (east = `+x`), `z ∈ [−4, 4]`
(south = `+z`). Walls sit at the bounds; the walkable clamp is `x ∈ [−4.4,
4.4]`, `z ∈ [−3.4, 3.4]`. The spawn point is just inside the entry,
`(0, 2.5)`, facing north into the room.

| ID | Object | Anchor `(x, z)` | Kind | Content (from the graph) |
|---|---|---|---|---|
| — | Entry door | `(0, 3.94)` south wall | Door (not interactive) | Arrival; behind you once inside |
| 01 | Phone on main desk | `(0.75, −0.3)` | **Interactive** | Live product demonstration — the AI Receptionist taking a call |
| 02 | Wall monitor | `(−0.3, −3.85)`, screen center ~1.65 m up | **Interactive** | "What is being built" — AI Receptionist + ecosystem story |
| 03 | Whiteboard | `(−3.85, −1.9)` west wall, center ~1.5 m up | **Interactive** | The questions / cycle of the work |
| 04 | Workstation | `(−2.8, 0.7)` | **Interactive** | How it is built — stack, iterations, honest notes |
| 05 | Notes shelf / papers | `(−2.2, 3.2)` south-west | **Interactive** | The story — observations that started it |
| 06 | Server rack | `(4.35, −2.6)` east wall | **Interactive** | Automation / infrastructure / Cortex |
| 07 | Exit door | `(−4.85, 2.6)` west wall | **Interactive** | The way to the closing room (unlocks late) |
| — | Hidden note | under main desk `(0.35, −0.05)`, low | **Interactive (hidden)** | Easter egg: "the first question" — sets up Room 02 AI |
| — | Ambient chairs, lights, cables, dust | various | Ambient | Life, not content |

Layout notes that make it feel worked-in:

- The whiteboard is partially wiped — real erasure smudges, one diagram half
  crossed out. Content honesty: include one dead-end idea and cross it out.
- Papers are grouped, not scattered: three small stacks near the phone, two
  on the shelf, one single sheet by the workstation keyboard.
- Cables run visibly from desk to wall and into the rack; they sag, they do
  not float.
- The wall monitor shows the real product story (02); a second, dimmer
  small screen on the desk shows the server status feed (shared with 06).
- The phone is a physical desk phone silhouette — the single most important
  prop in the room.

### 5.3 Room atmosphere brief

Warm pools of light over desk and whiteboard; the wall monitor and rack
throw soft colored-but-restrained light (monitor warm-white, rack faint
cool). The rest of the room sits in dark calm. One slow, visible dust
mote field in the main light cone. A ceiling fixture hums (sound only, and
only when sound is on).

---

## 6. Entry experience

### 6.1 The screen

- Near-black void (`#050505`), centered composition, generous negative
  space. Nothing else on screen except the three utility states in the
  corners (sound, exit-to-site, accessibility; section 12/18).
- Content, stacked with space, in order:
  1. Wordmark: `RECEPCE.TECH` (10 px, `+0.28em`, dim).
  2. One line naming the place: `A QUIET LABORATORY FOR AI + AUTOMATION`
     — single line, muted, small. This is the only "positioning" copy in
     the entire Lab. It is a room name, not a tagline.
  3. The invitation, set as a hairline-outline control: `ENTER`.
  4. One line beneath, smaller and dimmer, that is optional but honest:
     `HEADPHONES SUGGESTED` (only when sound is on and unmuted).
- No "LOADING". No percentage. No progress bar. The entry screen is the
  loading state: the room is streamed behind it (section 19) and the fade to
  the room only happens when it is ready. Because the room is cheap (kit
  geometry, small textures), on a normal desktop this delay is under a
  second.

### 6.2 The transition

- On `ENTER`, the screen does not cut. The wordmark and invitation dim and
  drift apart by ~20 px over 700 ms while a slow light grows from the center
  — the first "warm" light of the room leaking in.
- The camera begins 0.6 m behind the spawn point at eye height, then pulls
  forward through the door as the room resolves (fog clearing). Total
  entry-to-look-around ≤ 1.4 s.
- Character creation happens *before* the room on first visit (section 7),
  and the entry moment then begins from the identity screen instead.

### 6.3 Reaching the Lab

- `/lab` is the canonical route (direct link, bookmarkable, linkable).
- The homepage carries one quiet link to the Lab in its footer/system
  navigation area (wordmark-level, not a banner): `THE LAB`. This is not a
  popup and not a takeover.
- When a returning visitor has persisted an identity (section 7.6), the Lab
  opens directly into the room with a 400 ms flash of their name tag —
  "WELCOME BACK, [NAME]" — as a printed label, not an animation.

---

## 7. Character creation

Inspired by character systems in games but deliberately, aggressively
minimal. Its purpose is identity, not play: the visitor should feel they are
entering the space themselves. The interaction is limited to a handful of
quiet choices, each of which is a real visible difference in the world.

### 7.1 Flow

`CREATE YOURSELF` — a single panel, one screen, no wizard steps, no
"advanced". Four choice groups + optional name + `ENTER THE LAB`.

### 7.2 The options (deliberately limited)

| Group | Options | What changes in the world | Notes |
|---|---|---|---|
| BODY | SLIM · MEDIUM · BROAD | silhouette width & height (±10 %) | not "gender", not "physique score" |
| CLOTHING | SHIRT · JACKET · COAT | one garment layer | subtle geometry + collar/fabric tone |
| COLOR | 5 swatches | garment accent | the 5 swatches are warm neutrals + brand accent; see below |
| DETAIL | NONE · PIN · PATCH | one small mark at the chest | a badge that says something about taste, nothing else |
| NAME | free text ≤ 18 chars, default "VISITOR" | name tag above the avatar in-world; used in demo | optional; never required |

Color swatches: `#c2410c` (brand accent), `#b8a081` (sand), `#6d6a63`
(stone), `#3f4a4e` (slate), `#4a3226` (umber). One of them is always
"your color" for the accent lighting and the UI accent for the rest of the
session.

The UI for each group is one label + three (or five) thin outline chips,
keyboard-arrow navigable. No sliders, no dropdowns, no giant gaming panels,
no live-rotating 3D mannequin turntable. Selection feedback is a 1 px accent
border and a 120 ms micro-pulse.

### 7.3 The live preview

To the side of the panel (right on desktop, above on mobile) stands a still
figure on a low plinth — the same avatar rig used in the room, untextured
clay, lit by the room's warm light. It does not spin automatically; the
visitor may drag to rotate it slowly (±180°, no full loop). The figure's
pose is neutral and human — weight on one leg, hands at rest — never a
videogame idle animation.

### 7.4 Copy, in the project voice

The panel never says "Customize your avatar". The eyebrow reads
`CREATE YOURSELF`. The confirm button is `ENTER THE LAB`. The name input's
placeholder is `VISITOR`. Below the name: nothing. No "why am I doing
this?" paragraph. The visitor already knows why: they are entering a place.

### 7.5 Skip

One quiet control in the panel corner: `JUST LOOK AROUND` — enters the Lab
with the default visitor, no identity. This is for people who do not want
identity theatre. It must be as easy to find as the primary action, because
it protects the experience from feeling forced.

### 7.6 Persistence

The identity is saved (localStorage, key `lab.identity`, plus `lab.visited`
timestamp). On return: the room loads with the same figure. Changing it is
possible via a small `EDIT SELF` control in the in-world settings (utility
corner) that returns to the creation panel mid-visit without losing the
room state.

### 7.7 Mobile

On mobile the figure preview is hidden; choices are chips in a single
column. The avatar appears immediately in-world so the visitor still sees
their choices matter.

---

## 8. Movement system

Movement is guided exploration, not locomotion. The visitor never controls
the character's feet directly; they express intent and the world responds.

### 8.1 Input model

- **Desktop:** primary = click/tap on the floor or on an object. Secondary =
  arrow keys / WASD nudge ±1.5 m when an object is not targeted (for
  accessibility, not for FPS-style walking). Scroll = nothing (the camera
  does not dolly on scroll).
- **Touch:** tap to move. See section 17 for mobile specifics.

### 8.2 The walk

- The destination is the clicked point, or the anchor of the clicked object
  (object anchor = its interaction point, snapped to the nearest free floor
  position at 1.15 m from the object's face).
- Motion: exponential approach in `useFrame`. Formalize the existing
  prototype's behavior: speed factor `v = min(vMax · Δt + d · 0.03, d)` with
  `vMax = 2.1 m/s`; position updated per frame; yaw of the avatar eases to
  face the travel direction at `k = 8`.
- The avatar never slides backward. If a new target is clicked mid-walk, the
  path re-plans from the current position (no teleport, no snap).
- Arrival: the avatar decelerates and comes to a full stop within 0.25 m of
  the target, then a 300 ms "settle" — weight shift — before the object can
  be opened. This settle prevents the "run up and instantly interact" feel.
- Cancel: moving (clicking elsewhere) cancels an in-progress open; the
  object closes calmly.
- Obstacles: MVP room is one open space; simple rectangular obstacle
  avoidance (avatar slides along desk/rack AABBs, straight-line steering).
  Navmesh only when rooms get complex (section 23).

### 8.3 What movement communicates

- Walking has sound (footsteps) when sound is on, and a near-subliminal bob
  (2 cm amplitude, 1.4 Hz, only while moving).
- The avatar turns its head/body toward an object within its trigger radius
  even before interaction — an unconscious "I see that" that guides the
  visitor's eyes. This is the only ambient character animation in MVP.

### 8.4 Bounds

Each room declares walkable bounds. Room 01: `x ∈ [-4.4, 4.4]`,
`z ∈ [-3.4, 3.4]` with doorways excluded. The prototype already clamps;
keep it but define it per-room via the manifest.

---

## 9. Camera behavior

The camera is a quiet observer that follows the visitor's attention. Its
two jobs: keep the visitor oriented, and make the object they are about to
read the most important thing in frame.

### 9.1 Follow rig (walking state)

- Desired position: behind the avatar, offset `(x + 2.45, y + 1.75,
  z + 2.75)` — formalize the prototype's offset.
- Damping: position `1 − exp(−3.2 · Δt)`; look-at `1 − exp(−4.2 · Δt)`.
  These constants stay; they already feel calm.
- Look-at height: 0.9 m (chest of the avatar) in neutral state.
- The camera never clips walls: if the desired position is inside geometry,
  it slides forward along the surface normal. Simple sphere-cast against
  room AABBs.

### 9.2 Focus state (approaching an object)

When an object enters its trigger radius (1.15 m) and the visitor is still,
the camera *eases* into a focus:

- Desired camera position moves to a per-object `cameraSeat` — defined in
  the object manifest (e.g., phone: `(2.1, 1.15, 0.35)`; wall monitor:
  `(1.4, 1.5, −1.6)`).
- Look-at blends 62 % toward the object's focus point (matches prototype
  behavior), damping slowed to `k = 2.2` for a gentler settle.
- Background softness: when focus is active and the object is a readable
  surface, a depth-of-field blur of ≤ 6 px is applied to anything farther
  than 1.8 m behind the focus plane. Never stronger. Desktop only; disabled
  on mobile and under `prefers-reduced-motion` (also when `devicePixelRatio
  > 1.5` on weak GPUs).
- Focus releases when the visitor walks away or the object closes.

### 9.3 Cinema state (scripted moments)

Used sparingly — the entry, the first time the phone rings, the exit door
reveal. A pre-authored camera path over a fixed duration (0.6–1.4 s), always
starting and ending in a valid follow pose. Rules: no camera inside walls,
no rotation > 90° total, no vertical travel > 1 m, always settle ≥ 300 ms
before any interaction becomes available.

### 9.4 Camera rules of thumb

- Never cut. Every change is a move.
- Never zoom for drama. Zoom only to make content readable.
- If the visitor is doing nothing, the camera drifts at most 2 % of frame
  over 10 s (breathing room), then stops. It never orbits.

---

## 10. Interaction system

### 10.1 The object contract

Every interactive object in the world implements one contract. This is the
architecture that makes rooms and experiments additive later:

```ts
// src/types/lab.ts
type InteractionKind =
  | 'none'      // ambient prop, never interactive
  | 'open'      // becomes readable / opens a surface
  | 'operate'   // running machine, terminal, phone
  | 'door';     // changes room

interface LabObjectManifest {
  id: string;                 // slug, per naming grammar
  name: string;               // the noun shown as its tag ("PHONE")
  cycle: 'question' | 'observation' | 'experiment' | 'system';
  anchor: [number, number];   // x, z
  radius: number;             // trigger radius (default 1.15)
  kind: InteractionKind;
  seat: [number, number, number];     // camera focus position
  focus: [number, number, number];    // point the camera reads
  openable: boolean;
  hidden?: boolean;           // easter egg; not tagged, smaller radius
  unlock?: { after: string[] };  // e.g. exit door unlocks after 3 opens
  content: LabContent;        // section 10.4
}
```

Interaction lifecycle (one state machine, shared by every object):

```
idle ──(enter radius)──▶ present ──(open)──▶ open
                        (tag fades in)     (surface engaged)
  ▲                         │                    │
  └────(leave radius)───────┘   (close / walk)───┘
```

States, and what each looks like:

| State | World behavior | UI behavior |
|---|---|---|
| `idle` | nothing | nothing; cursor is default |
| `present` | object's key light bumps +4 %; subtle 1 px accent edge if it is a screen | tag appears at ~20 px above object: its noun; cursor ring fills to 40 % |
| `open` | camera in seat; other objects dim 20 %; world "narrows" | the surface takes over the frame; content per kind (10.4) |

While one object is `open`, all others drop to `idle`-visual but keep
`present` state only for the open object. This gives the room a single
point of attention — the opposite of a dashboard with six panels.

### 10.2 Discovery, not explanation

The environment communicates without captions:

- The phone rings once, softly, ~8 s after the visitor enters and has
  settled (only once per visit in MVP; its red light pulses slowly
  afterward — an unanswered queue).
- The wall monitor (02) cycles its content at a readable pace — it is never
  frozen, which invites a closer look.
- The whiteboard (03) is half-erased and half-drawn — it reads as "work in
  progress", and the drawn half is a diagram worth decoding.
- The server rack (06) has a row of tiny LEDs, one of which blinks
  irregularly (a real pattern, not random flicker — it traces the word
  "READY" in a slow loop, subliminal).
- The exit door (07) is unlit and unremarkable until the visitor has opened
  three objects; then a warm edge light appears along its frame. It is the
  only "progression unlock" in MVP.
- The hidden note is under the desk's loose drawer; nothing points to it.

No object is ever labeled "CLICK ME". If the visitor does not notice an
object, the experience still works — there is no required path, only a
recommended one.

### 10.3 Interaction inputs

- Primary: click object (raycast to its interaction collider — a thin,
  invisible capsule, not the visual mesh) or arrive at its radius + press
  `SPACE`/`ENTER` (the prototype already does this; keep both).
- Focused UI inside an open surface: keyboard arrows + `ENTER`/`ESC`,
  or click. `ESC` always closes the surface and returns the camera to
  follow.
- Keyboard hints are rendered as tiny keys inside the surface header when
  a keyboard is detected; hidden on touch devices.

### 10.4 Information surfaces (content lives in the world)

When an object opens, the world does not shrink to a modal card. The
surface itself becomes the frame:

| Object | Surface | Reading model |
|---|---|---|
| Phone (01) | the phone's screen + a transcript panel beside it | operate (demo, section 11) |
| Wall monitor (02) | the monitor fills the focus; content pans on the "screen" | read — story chapters advance automatically at a calm pace, with manual pause |
| Whiteboard (03) | markers drawn on the board; camera reads it as a flat document | read — one diagram, few words |
| Workstation (04) | the workstation monitor + a side "notebook" | read + toggle between "STACK", "LOG", "NOTES" |
| Notes shelf (05) | documents read in place, stacked; flip by clicking | read — a short dossier |
| Server (06) | a small status terminal | operate — live-feeling status feed |
| Exit door (07) | the door opens; camera walks through | transition (section 13) |

Implementation principle: an open surface is rendered *in the world* as a
textured plane or `Html` billboard attached to the object's transform, and
the camera moves to read it. DOM overlays (React) are used for the phone
transcript and keyboard controls only. This keeps the world present during
reading — the visitor can always see the room breathing around the
content.

Surface content is defined as data, not JSX (see `LabContent`), so content
can be edited, translated, or swapped without touching 3D code.

---

## 11. Interactive objects — full content spec

Every object's copy is written to the project voice (VOICE.md) and placed on
the grammar cycle (GRAMMAR.md). Draft content below is direction; copy
polish happens at implementation with the voice checklist.

### 11.1 (01) PHONE — the live product demonstration

This is the most important object in the MVP and the only "operate" demo.

**The premise:** the visitor has walked into a reception area and the phone
is ringing. They pick it up — and the AI Receptionist answers, handles a
real call, and books an appointment, live, in front of them. The visitor is
not watching a simulation panel; they are holding the phone.

**Interaction — "answer the call":**

1. After ~8 s of settling in the room, the phone rings twice (soft, real
   ring; sound on or subtly with sound off via vibration-scale on-screen
   pulse). The label near the handset reads `INCOMING`.
2. When the visitor is within radius and presses SPACE / clicks the phone,
   the handset lifts (in-world), the camera settles to the phone's seat.
   A small transcript panel appears beside the phone:
   `LINE OPEN` — and the call begins.
3. The AI Receptionist speaks or the visitor reads it — both. If sound is
   on, the AI voice is played from a pre-recorded/pipeline TTS clip (no
   live model in MVP). If sound is off, the transcript alone tells the
   story, which is why the transcript must be complete and human.

**The call (copy direction; ~45 s total):**

```
RING. RING.

[ANSWER]
RECEPCE:  Recepce.tech reception. How can I help?

CALLER:   Hi — I'd like to book an appointment for Tuesday,
          sometime in the afternoon.

RECEPCE:  Of course. Let me check the calendar.
          Tuesday is available at 2 PM or 4 PM.

CALLER:   2 PM works.

RECEPCE:   Booking confirmed for Tuesday at 2 PM.
          Should I send a reminder to your phone?

CALLER:   Yes, please.

RECEPCE:   Done. Is there anything else?

CALLER:   That's all. Thanks.

RECEPCE:   You're welcome. The office will see you Tuesday.
[END]
```

Status line, mirroring the existing prototype's stages:
`INCOMING → CONNECTED → LISTENING → BOOKED → REMINDED → RESOLVED`.

**The reveal (the point of the demo):** after the call, the transcript is
annotated in a quiet line:
`THE CALLER NEVER KNEW IT WASN'T A PERSON.` — then a second line, calmer:
`Nobody had to pick up. The appointment is in the calendar.` (This is the
only moment the Lab says anything this direct, and it earns it by having
just demonstrated it.)

The result panel offers one action: `TRY IT WITH YOUR NUMBER` — which opens
the site's contact path (section 13) in a new state. This is the Lab's
primary conversion.

Content cycle position: **System** (a question that became useful).

### 11.2 (02) WALL MONITOR — what is being built

A slow, self-playing storyboard on the north wall; chapters advance every
~9 s; the visitor can pause and step back with arrows. Chapters (each is one
screen, one idea):

1. `A QUESTION` — "Can a voice feel natural?"
2. `AN OBSERVATION` — "Businesses miss calls every day."
3. `AN EXPERIMENT` — "A system that listens before it speaks."
4. `A SYSTEM` — "The AI Receptionist. It answers. It books. It remembers."
5. `WHAT ELSE LIVES HERE` — names only: "CORTEX — an engine that finds
   signal in the noise." (maps to the future server/experiments content)

No logos, no screenshots of dashboards, no "features". Words and one small
diagram (the cycle, drawn in the site's own visual language). Cycle
position: **Observation** (what was noticed) leading to system.

### 11.3 (03) WHITEBOARD — the questions

Hand-drawn feel (slight wobble, uneven spacing), partially erased. Content:

- Center diagram: the cycle `QUESTION → OBSERVATION → EXPERIMENT → SYSTEM`
  drawn as a loop with a small note: "every answer produces a new
  question."
- Side notes, marker-scrawled:
  - "what does a business actually lose when the phone rings 3x?"
  - "the best conversations happen when the technology disappears."
  - "next: what happens when every interaction becomes knowledge?"
- One crossed-out idea (dead end): "auto-reply email robots for everyone"
  crossed through in a different color — honesty that this is real thinking.

Cycle position: **Question** (the room's source).

### 11.4 (04) WORKSTATION — how it is built

A desk with a monitor showing three toggled panes, plus the honest notebook
sheet beside the keyboard (a real sheet of paper, not a screen):

- `STACK` — the actual stack Recepce.tech runs on, stated plainly:
  Next.js, React, TypeScript; voice models + language models; structured
  memory; telephony. One line each, no logos.
- `LOG` — a short, believable work log (dates relative, per voice rules):
  "Three days ago — shipped multi-line booking."
  "This week — the system started asking clarifying questions."
- `NOTES` — notebook paper, handwriting font; the honest constraints of the
  work: "still bad at: loud restaurants, heavy accents, people who talk
  over the AI." This is the most trusted content in the Lab, because it is
  the most honest.

Cycle position: **Experiment** (what is being tried).

### 11.5 (05) NOTES SHELF — the story

A small shelf of stacked documents the visitor flips through in place:

1. A first sheet: `THE QUESTION THAT STARTED THIS` — the missed-call
   observation, in three short sentences.
2. A second: `WHY RECEPTION` — a receptionist's job is to make the first
   contact feel handled. Machines can do the handling. Only a person can do
   the feeling — so the machine should get out of the way.
3. A third: `WHERE THIS IS GOING` — the Future room teaser; the door in
   this room is one of several being built.

Cycle position: **Question + New question**.

### 11.6 (06) SERVER RACK — automation & infrastructure

A small rack (2 U visible) with LEDs and a status terminal showing a
quiet, live-feeling feed — a syslog that is calm, not dramatic:

```
recepce.core       ok — 41 calls handled today
receptionist.voice ready
calendar.sync      ok
memory.index       1,208 conversations
cortex.research    idle — waiting for signal
```

The feed updates every few seconds with small believable deltas
(`memory.index 1,208 → 1,209`). One line occasionally reads:
`reception.001 — booking confirmed — tue 14:00`. This object is what makes
the room feel like a real operation. Cycle position: **System** +
**Experiment** (Cortex teaser).

### 11.7 (07) EXIT DOOR — the closing room

Unlocks after 3 objects opened (or after the phone demo, whichever first).
Warm edge light, one small label: `THE LOUNGE` — no, the label is
`NEXT ROOM`; naming rule: it is a door to what comes next, and what comes
next is the closing room (section 13). The door click opens it; the camera
walks through a 1.4 s cinematic into the closing room.

### 11.8 (HIDDEN) — the easter egg

A loose drawer under the main desk (a visible-but-unremarkable detail).
Clicking it slides open to reveal one sheet: `THE FIRST PROTOTYPE RAN ON A
LAPTOP AT A CAFÉ. THE RECEPTIONIST WAS A SCRIPT. THE SCRIPT WORKED.` — and a
small printed terminal `SHELL > try again?`. This single sheet plants the
origin story and rewards people who touch things. It also quietly unlocks
nothing — discovery is its own reward in MVP.

### 11.9 Ambient props (never interactive)

Desk, chair, ceiling fixtures, cables, second dim desk screen showing the
server feed, a coat on the chair back (seasonal/owner detail), one plant
(dead or alive depending on the week — a live data joke the team can
maintain). Each exists for a reason: they make the room inhabited, they do
not decorate it.

---

## 12. Ambient life

The room must feel alive when nothing is happening. All effects below are
subtle to the point of being noticed only subconsciously. Rules: never
louder than the content, never faster than a breath, always looping with
real variation.

| Layer | What moves | Implementation |
|---|---|---|
| Screens | wall monitor chapter cycles; desk screen mirrors server feed; all screens refresh ~1 Hz with believable noise | shader/`Html` timer driven by one ambient clock |
| Server | LEDs breathe/blink on the real pattern; fan cone rotates slowly (mechanical reason) | slow sine + scripted pattern |
| Dust | ~40 motes in the main light cone, drifting at ≤ 0.05 m/s, fading near edges | cheap instanced points, CPU-updated |
| Light | ceiling light flickers 0.5 % at 120 Hz (imperceptible — adds life in aggregate, never a strobe) | noise on intensity |
| Objects | one sheet of paper on the desk lifts 1 mm on the HVAC draft every ~20 s | occasional transform |
| Avatar | idle head turn toward objects in radius (8.2) | rig lookAt eased |
| Air | room tone handled by sound (section 14) | — |

A single `useFrame` ambient clock drives all of it; nothing schedules
itself independently. If a frame drops below 30 fps, ambient layers shed in
reverse priority (dust first, LED patterns second, screens keep their 1 Hz).

---

## 13. Storytelling & the user journey

### 13.1 The narrative spine

The Lab tells the company story through space. The visitor's path maps onto
the grammar cycle exactly:

```
ENTER ──▶ RECEPTION room ──▶ discovery ──▶ demo ──▶ closing ──▶ the ask
 (question)  (observation)   (experiment) (system)   (new question)
```

The copy is seeded so that wherever the visitor goes first, they can
reconstruct the whole story — but the *recommended* order (phone → monitor →
server → exit) is the smoothest telling. That order is encouraged by light
and sound only, never by instruction.

### 13.2 Full journey, entry to exit

1. **Land** (`/lab`, direct or from homepage). Black screen. Wordmark.
   `ENTER`. (~4 s to act.)
2. **Become** (first visit only). `CREATE YOURSELF`, four quiet choices,
   `ENTER THE LAB`. Returning visitors skip to 3.
3. **Arrive.** Warm light, the room resolves, fog clears. The phone rings
   once at ~8 s. The visitor is unguided. The room is small enough to read
   in one glance: a working desk, a glowing wall monitor, a whiteboard with
   real writing, a breathing rack.
4. **Wander.** Click-to-walk, slow, calm. Objects present themselves with
   noun tags. (Average session to first open: ~20–40 s.)
5. **Discover.** Each open object adds a chapter. The server feed makes the
   place feel operational; the notes make it feel personal; the whiteboard
   makes it feel like real thinking; the workstation makes it feel
   technically real.
6. **Try.** The phone: the demo call. This is the peak. ~45 s of watching a
   real task be handled.
7. **Resolve.** After the demo (or 3 opens), the exit door lights. The
   visitor chooses to leave the room.
8. **Close.** A 1.4 s walk through the door into the closing room (13.3).
9. **Leave.** The closing room offers the ask. If they decline, a quiet
   exit returns them to where they came from. The Lab is always exited
   deliberately; there is no "you have seen everything" popup.

### 13.3 The closing room (post-door)

A small room, mostly empty, one warm lamp. On a table: a single open
notebook page that reads:

```
READY TO BUILD SOMETHING?
```

Below, two quiet actions, presented as nouns, not sales:

- `TALK TO US` → opens a composed message (mailto / the site's contact
  path) with subject `The Lab` — so the team knows what sent them.
- `TRY RECEPCE` → leads to the site's working AI reception demo/booking
  flow.

And one smaller line beneath, for people who are not ready:
`THE LAB IS STILL BEING BUILT. THIS ROOM WILL CHANGE.` — this is not
pressure; it is an invitation to return. The exit from the Lab goes back to
the entry (or the homepage), never to a 404.

The closing room exists to make the conversion feel like the natural end of
a visit — a decision, not a banner.

### 13.4 Storytelling rules

- The Lab never says "click here to learn about our AI".
- The Lab never lists features.
- The Lab never uses the word "innovative", "revolutionary",
  "next-generation", "transform", or "solution" (VOICE.md list).
- Honesty is a feature: the crossed-out whiteboard idea and the
  workstation's "still bad at" notes build more trust than any superlative.

---

## 14. Lighting & atmosphere

### 14.1 The lighting story

Low light, soft shadows, warm pools of intention. Light is how the Lab
directs attention — it is the only navigation system besides space itself.

### 14.2 Rig (Room 01)

| Light | Position | Color | Intensity | Role |
|---|---|---|---|---|
| Key — ceiling spot (warm) | over main desk `(0.8, 2.9, −0.3)` | `#ffd9a8` | 1.0, casts shadow (2048 map) | the room's "daylight" |
| Key 2 — narrow spot | over whiteboard `(−3.6, 2.7, −1.9)` | `#ffe0b3` | 0.6, no shadow | makes the board readable from afar |
| Fill — ambient | — | `#6a5f52` | 0.22 | base modeling |
| Rim / cool — window side | east, low | `#8fa3ad` | 0.18 | subtle cool counterpoint |
| Screen glow 1 | wall monitor | `#ffe4c4` | 0.35, distance 4 | soft bounce on the wall under it |
| Screen glow 2 | server rack | `#9fb6c0` | 0.18, distance 2.5 | faint cool breathing |
| Phone accent | phone, when ringing/active | accent `#c2410c` | 0.5, distance 2 | the only warm-accent light in the room |

- Shadows: one 2048 shadow-casting light (the key). Everything else
  shadowless or receives. Contact shadows under the avatar and chair via a
  small radius shadow (cheap) instead of second shadow map.
- No bloom, no HDR pipeline in MVP. Screens are bright emissive planes and
  look right against dark walls without postprocessing. Add subtle
  postprocessing only as an optimization-safe step later.
- Fog: `#050505` at 8–16 m (already in the prototype — formalize per-room).
- Exposure/tone: renderer `outputColorSpace = SRGBColorSpace`,
  `toneMapping = ACESFilmic`, `toneMappingExposure ≈ 1.0`. Keeps dark
  scenes from crushing.

### 14.3 Rules

- Max 3 "meaningful" lights per room; all others are emissive proxies.
- Screens never exceed a luminance that blooms on their own.
- The accent color is reserved for active/ringing/unlocked states — never
  resting décor.
- Ambient occlusion is baked or faked with dark material edges; no costly
  SSAO in MVP.

---

## 15. Sound design

Sound supports immersion and works perfectly when absent. Every sound has a
cause in the world; there is no music track in MVP (a restrained ambient
bed may come later, but silence is the default state and must remain a
complete experience).

### 15.1 System

- One `AudioContext`, created on the first user gesture (the `ENTER`
  click — never autoplay).
- Master gain at a quiet default (`≈ −24 dB`), a simple SOUND ON/OFF toggle
  in the utility corner, persisted.
- Layers are mixed, not stacked loud: room tone is the loudest layer and
  even it is barely audible.
- Headphones are assumed but not required. The same mix works on laptop
  speakers.

### 15.2 Layers (Room 01)

| Layer | Source | Level (relative to room tone) | Behavior |
|---|---|---|---|
| Room tone | generated (hum + filtered noise, as in the prototype) | 0 dB reference | continuous; ~52 Hz hum + 320 Hz low-passed air |
| Ventilation | looped filtered noise, slow LFO | −6 dB | continuous, nearly subliminal |
| Screens | soft electronic whine per screen cluster | −14 dB | continuous, high-passed; fades when screen closes |
| Rack | faint fan whir + irregular blip | −12 dB | continuous; blip syncs to LED pattern |
| UI | clicks, tags, confirm | −10 dB | causal, 120 ms, dry |
| Footsteps | soft cloth-on-concrete, every step while walking | −8 dB | only while moving; pitch varies ±5 % |
| Phone ring | two-note physical ringer | −4 dB (momentary) | rings twice at ~8 s; never again per visit |
| Call audio | AI voice clip + caller (processed, "over the line") | −2 dB (during demo) | ducked room tone −8 dB while active |
| Door | soft latch + low whoosh | −8 dB | on exit-door open |
| Keyboard | occasional single keystrokes at the workstation when it is on screen | −14 dB | sparse, irregular |

### 15.3 Voice

The AI Receptionist's voice in the demo is warm, unhurried, native-quality
TTS or a pre-recorded human read. It is the only voice in the Lab. When
sound is off, the transcript alone carries the demo (see 11.1).

### 15.4 Rules

- Mute is always one click away and always visible.
- Nothing loops louder than the room tone. If a visitor must turn sound off
  to think, the design has failed.
- All generated layers stop instantly on mute (context suspend), not by
  ramping down slowly.
- No sound is triggered by an invisible cause — no random dings.

---

## 16. Technical architecture

### 16.1 Stack

Next.js (App Router, this repo's version) · React 19 · TypeScript ·
Three.js + React Three Fiber · zustand (already in the project) ·
framer-motion for the thin UI layer. No new rendering dependencies for MVP.
GLB assets are allowed later but the MVP is kit geometry (no asset pipeline
required).

### 16.2 Route & layout structure

Target structure (fixes the nested-`<html>` defect):

```
src/app/
  layout.tsx              # <html>/<body> only; fonts, metadata, globals
  (site)/
    layout.tsx            # Navigation + main + Footer (all classic pages)
    page.tsx              # homepage
    ...                   # existing pages move here
  (immersive)/
    layout.tsx            # dark background, viewport lock, no chrome
    lab/page.tsx          # /lab — client entry, dynamic import, ssr:false
```

`(immersive)/lab/page.tsx` stays a thin shell that
`dynamic(() => import(...), { ssr: false })`-loads the Lab client bundle so
the main bundle never carries Three.js.

### 16.3 Module layout

```
src/
  types/lab.ts            # LabObjectManifest, LabContent, identity, stages
  data/lab/
    room-01.ts            # RoomManifest + object content (data, not JSX)
    copy.ts               # all Lab copy, voice-checked in one place
    identity.ts           # clothing/color/detail catalog (drives UI + 3D)
  store/labStore.ts       # phase, identity, sound, visited objects,
                          #   unlock state; zustand; identity persisted
  systems/lab/
    movement.ts           # click-to-walk, arrival, bounds
    camera.ts             # follow / focus / cinema rig
    attention.ts          # present/open state machine + dimming
    ambient.ts            # one ambient clock driving all life layers
    audio.ts              # AudioContext, layers, call playback
  components/lab/
    LabExperience.tsx     # phase shell: entry / identity / world / close
    world/RoomScene.tsx   # Canvas, lights, fog, room module
    world/Room01.tsx      # kit-geometry room build + manifest binding
    world/Player.tsx      # avatar from identity
    world/InteractiveObject.tsx   # generic: tag, radius, open, seat
    world/surfaces/...    # per-kind reading surfaces (monitor, phone, ...)
    ui/EntryScreen.tsx  ui/IdentityPanel.tsx  ui/CloseRoom.tsx
    ui/utility.tsx        # sound / exit / edit-self / accessibility
```

Rules: object manifests live in `data/`; rendering consumes manifests; no
JSX inside `data/`; no copy scattered in components; the only global side
effects live in `systems/`.

### 16.4 Data model

```ts
// src/types/lab.ts (extends the sketch in 10.1)
interface RoomManifest {
  id: 'room-01';
  name: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  spawn: { x: number; z: number };
  objects: LabObjectManifest[];
  lights: LightManifest[];
  fog: { color: string; near: number; far: number };
  ambience: 'reception';
  unlocks?: { doorId: string; after: number };  // after N opens
}

interface LabContent {
  kind: 'storyboard' | 'transcript' | 'paper' | 'feed' | 'board' | 'stack';
  chapters?: Chapter[];    // storyboard
  lines?: TranscriptLine[];// phone call
  sheets?: Sheet[];        // paper docs
  entries?: string[];      // feed / log lines
  diagram?: DiagramNode[]; // whiteboard
}
```

Identity (typed, persisted):

```ts
interface LabIdentity {
  silhouette: 0 | 1 | 2;
  clothing: 0 | 1 | 2;
  accent: string;          // one of the 5 swatches
  detail: 0 | 1 | 2;
  name: string;            // '' → "VISITOR"
  createdAt: number;
}
```

### 16.5 Rendering architecture

- One `<Canvas>` for the world; DOM (framer-motion) sits above it for
  entry/identity/utility surfaces. Reading surfaces are in-world `Html` or
  textured planes attached to objects (10.4), so the camera does the work.
- `CameraRig` and `Player` already exist in the prototype; refactor them
  into `systems/camera.ts` + `world/Player.tsx` with the manifest-driven
  focus seats.
- Interaction colliders are invisible capsules; raycasting only tests them,
  never the visual scene graph.
- `RoomScene` mounts the room module that matches the route; each room is a
  component with the manifest typed to it. Future rooms = new folder +
  manifest + door link; nothing in the core changes.

### 16.6 State & persistence

`labStore` slice in zustand:
`phase | identity | soundOn | visitedObjects[] | unlocked | callStage |
reducedMotion`. Persisted keys: `lab.identity`, `lab.visited` (localStorage).
Everything else is session state. The classic pages' store stays untouched.

### 16.7 Next.js specifics to respect

- Canvas and all world code are client components; the page shell is the
  only module the route imports statically.
- Metadata for `/lab` should set a dark `theme-color`, appropriate title
  (`Lab — Recepce.tech`), and description that does not spoil the mystery.
- `dynamic import + ssr:false` for the whole experience prevents SSR from
  touching WebGL.
- Route groups: immersive routes must not inherit the site chrome
  (16.2). Follow this repo's Next.js version docs for group-layout
  conventions before restructuring.

---

## 17. Mobile & fallback

### 17.1 Mobile principle

Desktop-first, but mobile is a designed *simplification*, never a shrunken
desktop. On phones the 3D room remains (it is cheap enough), with these
changes:

- **Touch movement:** tap the floor / an object. A `TAP TO MOVE` hint shows
  once. Pinch is unused; the camera is fully automatic (no orbit).
- **Camera:** focus seats are closer; DoF and cinema moves are disabled.
  FOV widens 4° so the room fits the narrow frame.
- **Scene:** geometry is the same but a `low` preset applies — shadow map
  1024, no dust, LEDs simplified, DPR capped at 1.75, screens rendered at
  0.75× resolution via `Html` scaled down.
- **Identity panel:** single-column chips, no 3D preview (avatar appears
  in-world).
- **Surface reading:** surfaces open as in-world but with larger type
  (≥ 15 px) and touch swipes to advance chapters.
- **Layout check:** no element smaller than 44 px touch target; utility
  corners are thumb-reachable.

### 17.2 WebGL fallback / skip

- On entry screen and identity screen, a persistent small link:
  `SKIP THE LAB →` which goes to the classic site (homepage / a plain
  `/about`-style surface). It is always visible but never primary.
- If WebGL is unavailable or the Canvas fails, render automatically to a
  calm static "waiting room" page: the same visual identity, the Lab's
  story as a readable document (reusing `data/lab/copy.ts`), and the same
  exit/conversion. The visitor must never hit a black screen with a broken
  canvas.
- `prefers-reduced-motion`: camera damping time ×3, no cinema moves, no
  DoF, dust and blinking LEDs off, phone "ring" conveyed by the red light
  only. Interaction stays fully functional.

### 17.3 Detection

A tiny capability probe (`WebGLRenderingContext` presence + a 10 ms
render sanity check) runs at entry; it never blocks the entry screen, only
chooses the destination after `ENTER`.

---

## 18. Accessibility & UI chrome

### 18.1 The only persistent UI (utility corners)

There is no navbar. Four tiny controls live in the corners, styled as
labels:

| Control | Where | Behavior |
|---|---|---|
| `SOUND ON / OFF` | top-right | toggles the audio system; persists |
| `EXIT` | bottom-left | leaves the Lab (to homepage); always available |
| `EDIT SELF` | bottom-right | returns to identity panel (mid-visit), or absent if anonymous |
| `ACCESSIBILITY` | top-left (small glyph) | cycles motion reduction on/off + toggles a high-contrast label mode |

These are the only persistent chrome. Everything else is in-world.

### 18.2 Semantics

- The Canvas has an aria-label (`Recepce.tech Lab — a 3D space you can
  explore`). Below it, a visually-hidden live region announces state
  changes (`The phone is ringing.`, `The whiteboard is now readable.`) for
  screen readers — the Lab's ambient events must be audible to
  non-visual users.
- Keyboard: the whole experience is navigable without a pointer.
  Tab order: utility controls → objects in the room in a sensible order
  (phone, monitor, whiteboard, workstation, notes, server, door) via an
  invisible "object focus ring" rendered in-world when an object has DOM
  focus. SPACE/ENTER opens; ESC closes.
- Focus never traps: from any surface, ESC returns to the world, and Tab
  reaches EXIT.
- Contrast: body copy `#e8e2d6` on `#0d0d0e` ≈ 12:1 — exceeds AA. Muted
  text is reserved for non-essential labels.
- Flashing: the phone's ring pulse is ≤ 3 flashes and ≤ 1 Hz — below
  photosensitivity thresholds. Nothing else blinks faster than a breath.

---

## 19. Performance strategy

Performance is part of the design. Budgets below are contracts, not goals.

### 19.1 Budgets (desktop mid-range, mobile low-end)

| Metric | Target |
|---|---|
| First interactive (click ENTER → can walk) | ≤ 1.2 s from click on desktop, ≤ 2.0 s mobile |
| First content openable | ≤ 3 s after room appears |
| Frame rate | ≥ 55 fps desktop, ≥ 30 fps mobile-low preset |
| Draw calls | ≤ 60 room draw calls, ≤ 15 object extra |
| Triangles | ≤ 120 k scene, avatar ≤ 6 k |
| Textures | ≤ 8 (each ≤ 2048), most 1024, all non-mipmapped where flat |
| Shader complexity | Lambert/Standard only; no custom heavy shaders in MVP |
| JS bundle for Lab chunk | ≤ 450 kB gzip (three + r3f + app code) |

### 19.2 Strategy

- **Progressive reveal.** The entry screen IS the loading state. Room 01's
  geometry (kit boxes) is visible within one frame of Canvas mount; light
  maps/costly bits resolve behind the fog as the camera enters.
- **No asset waterfall.** MVP has no GLB and no network textures: kit
  geometry + procedural materials mean the room is instant. This is why
  MVP correctness matters more than asset prettiness.
- **One shadow map.** Single 2048 key light; everything else is
  shadowless. Contact shadows under moving things instead of a second map.
- **DPR cap:** `min(devicePixelRatio, 2)` desktop, `1.75` mobile-high,
  `1.5` mobile-low. Adjust once at start; never during.
- **Instancing:** papers, LED rows, dust as instanced meshes.
- **Object culling:** objects beyond 6 m skip updates (not just render).
  Open object forces its own updates.
- **Budget governor:** one lightweight frame monitor; if the 99th
  percentile frame exceeds 24 ms for 3 s, shed: dust → LED pattern → DoF →
  then lock DPR one step lower. Never shed the walking camera or audio.
- **Code splitting:** Lab is behind `dynamic(..., { ssr: false })`; surfaces
  and audio loaded as part of the Lab chunk, content as data (tree-shaken
  copy) — no separate network fetches in MVP.
- **Future GLB rooms** (section 23) add: Draco compression, LOD via drei,
  `useGLTF` + suspense with per-room preload, streaming via `RoomManifest`
  priority. None of this ships in MVP, but the manifest contract is shaped
  so it can.

---

## 20. MVP scope & definition of done

### 20.1 The MVP is one exceptional room

MVP = entry + identity + Room 01 RECEPTION complete + closing room + the
exit/conversion, exactly as sectioned above, at the quality bar of "a real
place" — not "a tech demo".

### 20.2 Must-do list (in build order)

1. Restructure layouts (16.2); `/lab` reachable, no nav/footer over it,
   no nested `<html>`.
2. Refactor existing prototype into the module layout (16.3) with typed
   manifest + store.
3. Kit-geometry Room 01: floor, walls, ceiling plane, desk, chair, shelf,
   rack, boards, door; lighting rig (14.2); fog.
4. Character system: identity UI + 3D avatar from identity + persistence +
   `EDIT SELF`.
5. Movement + camera refactor to manifest-driven focus (8, 9).
6. Object framework: tag / radius / present / open lifecycle (10).
7. Objects 01 phone demo (transcript + optional voice), 02 wall monitor,
   03 whiteboard, 04 workstation, 05 notes shelf, 06 server feed.
8. Ambient life clock (12) + dust.
9. Audio layers + mute + phone ring + call audio (15).
10. Exit door unlock + closing room + conversion actions.
11. Hidden easter egg (11.8).
12. Utility chrome + accessibility pass (18).
13. Mobile preset + WebGL fallback + `SKIP THE LAB` (17).
14. Performance budget pass + governor (19).
15. Voice check of every line of copy (VOICE.md checklist).

### 20.3 Definition of done

The MVP ships when a new visitor on a mid-range laptop can:

- land, enter, create a self, and be walking in the room in < 5 s total;
- discover the ringing phone without being told;
- run the call demo and understand what Recepce.tech does;
- open ≥ 3 other objects and never meet a dead end or a broken surface;
- reach the lit door, pass through it, and reach a real conversion path;
- mute/unmute sound, exit, and return without losing identity;
- do all of the above on a phone (simplified) and without WebGL (fallback);
- never see: a loading spinner, a popup modal, a dashboard panel, or a
  frame drop below 30 fps on the reference device.

Acceptance is a full pass of the journey in section 13.2 on desktop +
mobile + reduced-motion, plus the voice checklist, plus the budget
governor reporting clean frames.

---

## 21. Expansion roadmap

The architecture is designed so the Lab can grow without rework. Each item
below is one future iteration; each maps to the manifest contract.

| Iteration | Adds | Effort |
|---|---|---|
| 01 MVP (this spec) | Room 01, all of section 20 | — |
| 02 Polish | GLB furniture, better materials, DOF, bloom (restrained), 2nd light | medium |
| 03 Room 02 · AI | through the east door; deeper receptionist content, real voice demo | medium |
| 04 Room 03 · Automation | workflows visualized; live "today's calls" data | medium |
| 05 Room 04 · Build | the workshop; stack, iterations, versions | medium |
| 06 Room 05 · Experiments | prototypes area; first experimental interaction | medium |
| 07 Live data | server feed reads real operation metrics (opt-in) | low-medium |
| 08 Seasons/events | light rig + décor change; limited-time objects | low |
| 09 Real calls | "TRY IT WITH YOUR NUMBER" calls a real telephony demo | depends on provider |
| 10 Community | shared names/guestbook in the closing room | low |

Rule for all future work: a room is not added until it is as good as Room
01. The Lab grows one exceptional room at a time.

---

## 22. Gaps & ideas beyond the brief

Things the brief does not ask for that would make the experience
significantly better:

1. **Return-visit recognition.** Persisted identity + a quiet
   "WELCOME BACK" (6.3) makes the Lab a place you revisit, not a page you
   reload. Cheap, high value.
2. **The Lab is itself part of the story.** "This room is being built" is
   already in the closing-room copy; extend it: a chalk line on the floor
   marking where Room 02's door will go, a `DOOR 02 — FRAMED` label. The
   building-in-progress IS the brand.
3. **The graph as décor.** The site already models entities as a graph
   (`src/data/entities.ts`). A framed print of the current knowledge graph
   on the wall (regenerated per build) turns internal infrastructure into
   authentic set dressing. The whiteboard's crossed-out idea and the
   workstation's honest "still bad at" notes are the same principle in
   copy.
4. **The demo that uses the visitor.** After the phone call, the visitor
   can leave a voicemail ("LEAVE A MESSAGE FOR THE LAB") that arrives as a
   real message to the team. Turns a spectator into a participant with one
   button.
5. **A shareable moment.** After the demo, a small `YOUR VISIT` card —
   "You walked in, answered a call, and left before anyone picked up." —
   shareable to a social post. Word of mouth for an experience people
   cannot screenshot.
6. **The dead-end question.** The crossed-out whiteboard idea teaches more
   than any feature. Reserve one honest failure per room on purpose.
7. **Accessibility as content.** The lab's "still bad at: loud
   restaurants" note is the company admitting the frontier — keep that
   honesty in the product copy, not just the Lab.
8. **Timing that respects the visitor.** Session length target: 3–6
   minutes to the conversion path, no grinding. If analytics show most
   visitors never reach the door, the room is too big or the ring comes too
   late — both are tuning knobs, not bugs.

---

## 23. Priorities

### MUST HAVE (MVP, nothing ships without these)

1. Entry screen → identity → room → closing-room journey, all connected
   and calm.
2. Room 01 at "real place" quality: lighting rig, fog, kit furniture,
   working feel.
3. Click-to-walk movement with arrival settle; bounds respected.
4. Camera follow + focus seats; no cuts, no clipping.
5. Object framework (tag / present / open / close).
6. The phone call demo (01) — the product proof.
7. Four more openable objects minimum (02, 03, 04, 05, or 06).
8. Exit door unlock + closing room + `TALK TO US` / `TRY RECEPCE`.
9. Sound: layers, mute, phone ring, demo voice; silent mode complete.
10. Utility chrome (sound / exit / edit-self) — no navbar, no modals.
11. Mobile simplification preset + WebGL fallback + `SKIP THE LAB`.
12. Layout restructure so the Lab owns its frame.
13. Performance budgets + governor (19).
14. Voice-checked copy throughout.

### SHOULD HAVE (iteration 02)

1. Depth of field during focus states (desktop only).
2. GLB/kit upgrade for furniture fidelity.
3. Ambient life full set incl. dust + LED patterns (MVP can ship with a
   reduced set).
4. Server rack live-feel feed with believable deltas (06).
5. `LEAVE A MESSAGE FOR THE LAB` (voicemail idea).
6. Homepage `THE LAB` link + share card after demo.
7. Returning-visitor identity greeting.
8. Full keyboard + screen-reader journey pass.
9. Analytics on the 7-stage journey (entry → each open → door → exit).

### NICE TO HAVE (later rooms)

1. Real telephony "try it with your number".
2. Live operation data on the server feed.
3. Room 02+ as defined in section 21.
4. Seasonal lighting/décor; community guestbook.
5. Easter eggs per room (one per room is the standing rule).
6. WebGPU path when the ecosystem matures.

---

## 24. Copy appendix

### 24.1 Approved labels (nouns, not verbs — GRAMMAR naming rules)

| Concept | In the Lab |
|---|---|
| Product demo | `PHONE` |
| Product story | `WHAT IS BUILT` (monitor title) |
| Thinking | `QUESTIONS` (whiteboard) |
| How it works | `STACK` / `LOG` / `NOTES` (workstation panes) |
| Origin | `THE STORY` (notes shelf) |
| Infrastructure | `SYSTEMS` (rack title) |
| Exit to conversion | `NEXT ROOM` (door) |
| Leave | `EXIT` |
| Identity | `CREATE YOURSELF` |
| Entry | `ENTER` |
| Fallback | `SKIP THE LAB` |

### 24.2 Forbidden words (from VOICE.md) — never in the Lab

Innovative · cutting-edge · revolutionary · game-changing · seamless ·
effortless · unlock · leverage · empower · transform · disrupt · scale ·
solution · synergy · next-generation · "AI-powered" as decoration ·
"revolutionize your business".

### 24.3 The single conversion line

`READY TO BUILD SOMETHING?` — and its quieter alternative for the footer of
the closing room: `The Lab is still being built. This room will change.`

---

## 25. One-page summary

The Lab is a building. Room 01 is its reception area, where the product —
an AI receptionist — is genuinely at work. Visitors make a minimal self,
walk in by clicking, read real surfaces, and answer a real phone call that
books an appointment while they watch. A door lights when they are done,
and the closing room asks one calm question: whether they want to build
something too. The whole thing is quiet, warm, honest, and fast — built
from kit geometry and data, extendable room by room, and unmistakably
unlike a website. Less, but better.
