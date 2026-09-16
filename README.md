# LLD in JavaScript & TypeScript

**Low Level Design for the language you actually ship with.**

Most LLD courses live in Java or C++. This repo is different — we learn the same interview patterns in **JavaScript and TypeScript**, the stack that powers the web, Node backends, and a huge chunk of modern startups.

> Preview every markdown lesson with **Cmd / Ctrl + Shift + V** — diagrams and tables look way better in preview.

---

## Why this exists

Interviewers ask:

> *"Design a parking lot / Google Docs / notification system…"*

They expect classes, SOLID, design patterns — and then you open your editor… and you're writing **JavaScript**.

This repo bridges that gap:

| What you get | How |
|--------------|-----|
| Beginner-friendly docs | Plain English first, jargon second |
| Side-by-side learning | Broken design → SOLID refactor |
| Runnable TypeScript | `npm run demo` — see it work |
| Interview focus | The designs people actually ask |

---

## What is JavaScript (and why should you care)?

**JavaScript** started as a tiny language for making web pages interactive. Today it runs:

- **Browsers** — every major site
- **Servers** — Node.js, Deno, Bun
- **Apps** — React Native, Electron
- **Tooling** — build systems, CLIs, AI agents

If you write software in 2026, odds are high you'll touch JS or its typed cousin **TypeScript**.

### The awkward truth: JS is not "OOP-first"

JavaScript is **multi-paradigm**:

- Functions and closures feel natural
- Objects are flexible bags of properties
- Classes (since ES6) are mostly **syntactic sugar** over prototypes
- No true private members for years; no interfaces without TypeScript

So why learn OOP / LLD / SOLID in JS at all?

### Because design is about *thinking*, not syntax

| Reality | What that means for you |
|---------|-------------------------|
| Teams still use classes & modules | You need to read and write them |
| Interviews expect LLD vocabulary | SOLID, Strategy, Factory — language-agnostic |
| Bad structure scales badly | A 200-line "god file" hurts in JS *more* than in Java |
| TypeScript adds interfaces & types | Suddenly DIP and ISP feel natural |
| React / Nest / Angular lean on patterns | Composition, DI, SRP show up every day |

**Bottom line:** JS won't force OOP on you. *You* choose structure. LLD teaches you to choose well — so your codebase doesn't become spaghetti as features pile on.

---

## How to learn here

1. **Read the design doc** (Cmd/Ctrl + Shift + V)
2. **Open the matching `.ts` file** — comments explain the "why"
3. **Run the demo** — watch console output
4. **Compare basic vs improved** — same feature, better design

That arc — *problem → smell → principle → code* — is what interviews reward.

---

## Getting started

```bash
npm install
npm run demo            # all demos
npm run demo:basic      # Google Docs — naive version
npm run demo:improved   # Google Docs — SOLID version
```

---

## Lessons

### 1. Design Google Docs

A classic interview warm-up: document model, rendering, persistence.

| Resource | What you'll learn |
|----------|-------------------|
| [basic-design_docs.md](./Design_GoogleDocs/basic-design_docs.md) | Naive "god class" + where SOLID breaks |
| [improved-design_docs.md](./Design_GoogleDocs/improved-design_docs.md) | Full SOLID walkthrough + pluggable storage |
| [basic.ts](./Design_GoogleDocs/basic.ts) | Runnable anti-pattern |
| [improved.ts](./Design_GoogleDocs/improved.ts) | Runnable refactor (File / DB / In-memory) |

**Idea in one line:** start with one class that does everything, then split into Document → Elements → Renderer → Persistence.

---

## Roadmap (coming next)

This repo will grow into a full interview-style LLD track in TS/JS, including:

- [ ] SOLID principles (deep dive, standalone)
- [ ] Design patterns — Strategy, Factory, Observer, Singleton, Decorator…
- [ ] Classic designs — Parking Lot, Elevator, BookMyShow, LRU Cache
- [ ] Concurrency-ish thinking in JS — event loop, async, rate limiters
- [ ] Clean module boundaries — when *not* to use classes

Each topic: **docs + basic code + improved code + runnable demo**.

---

## Who this is for

- Students preparing for **SDE interviews**
- Backend folks who "know JS" but never practiced LLD in it
- Frontend engineers who want cleaner architecture beyond components
- Anyone who's been told *"JS isn't real OOP"* and still wants strong design skills

No gatekeeping. If you can read TypeScript at a basic level, you're in.

---

## Tip for presenters & study groups

1. Show the **basic** diagram → run `demo:basic`
2. Ask: *"What breaks when we add Video? Or save to a DB?"*
3. Open the **improved** doc → walk SOLID one letter at a time
4. Run `demo:improved` and point at File vs DB vs InMemory storage

Same story every lesson. Muscle memory for interviews.

---

## License / contribution

Learning material — feel free to fork, teach, and extend. PRs that add a new LLD topic with the **basic + improved** format are very welcome.

Happy designing. May your classes stay small and your interfaces stay honest.
