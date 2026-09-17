# SOLID Principles — Understanding the Idea

> Preview with **Cmd / Ctrl + Shift + V**

---

## What is SOLID?

**SOLID** is a set of five design principles for writing object-oriented code that is easier to **change, extend, and test**. The name is an acronym coined around Robert C. Martin’s teachings:

| Letter | Principle | One-line meaning |
|--------|-----------|------------------|
| **S** | [Single Responsibility](./SRP/srp.md) | One class → one reason to change |
| **O** | [Open/Closed](./OCP/ocp.md) | Open for extension, closed for modification |
| **L** | [Liskov Substitution](./LSP/lsp.md) | Subtypes must be safely replaceable for their base type |
| **I** | [Interface Segregation](./ISP/isp.md) | Don’t force clients to depend on methods they don’t use |
| **D** | [Dependency Inversion](./DIP/dip.md) | Depend on abstractions, not concretions |

---

## Why does SOLID matter?

In interviews and real codebases, “working code” is not enough. Code must survive the next feature.

Without SOLID you often get:

1. **God classes** — one file that does validation, DB, email, PDF…
2. **Fear of change** — touching one method breaks three unrelated flows
3. **Hard tests** — can’t mock a database because it’s `new`’d inside the class
4. **Copy-paste growth** — every new case adds another `if/else` branch

SOLID does not mean “create 50 tiny classes for everything.” It means **put boundaries in the right places** so change is local.

Especially in **JavaScript/TypeScript**: the language won’t force good design. *You* choose structure. SOLID is the checklist interviewers and senior reviews use.

---

## How to study this folder

Each principle has:

1. A short **definition + why it matters**
2. A **violation** (what not to do)
3. A **fixed** version
4. Runnable TypeScript — `npm run demo:solid-*`

Read the overview here, then go letter by letter:

```bash
npm run demo:srp
npm run demo:ocp
npm run demo:lsp
npm run demo:isp
npm run demo:dip
npm run demo:solid   # all five
```

---

## How SOLID connects to patterns you already learned

| You already saw… | SOLID letter it demonstrates |
|------------------|------------------------------|
| Google Docs refactor (Document / Renderer / Persistence) | **S**, **D** |
| Nestlé Factory Method / Abstract Factory | **O**, **D** |
| Observer (add new display without editing station) | **O**, **D** |

Patterns are *tools*. SOLID is the *reason* those tools exist.

---

## Interview one-liner

> *"SOLID keeps change cheap: one responsibility, extend without edit, subtypes behave, small interfaces, depend on abstractions."*
