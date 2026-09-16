# Factory Pattern — Understanding the Idea

> Preview with **Cmd / Ctrl + Shift + V**

---

## Definition

> **Factory Pattern** — instead of writing `new ConcreteClass()` all over your app, you ask a **factory** to create the object for you. The client depends on an **abstract product**, not on Maggi / KitKat / Milo specifically.

In plain words:

> _"Don't construct products yourself. Ask a factory. It knows which class to build."_

---

## Why do we need it?

Without a factory, client code looks like this:

```typescript
if (type === "maggi") product = new Maggi();
else if (type === "kitkat") product = new KitKat();
else if (type === "milo") product = new Milo();
```

Problems:

1. **Creation logic is scattered** — every caller repeats the same `if/else`
2. **Hard to extend** — new product = edit every place that creates
3. **Tight coupling** — client knows every concrete class name

Factories fix that by **centralizing creation**.

In the UML diagrams below each lesson: `<<abstract>>` = base contract, `<|--` = inheritance, `..> creates` = factory builds that product. Read the diagram once, then focus on the Nestlé concept.

---

## Three flavors we cover (Nestlé)

| Pattern              | Idea                                      | Nestlé mental model                                      |
| -------------------- | ----------------------------------------- | -------------------------------------------------------- |
| **Simple Factory**   | One factory, one `create(type)`           | One plant — pass `"maggi"`, get Maggi                    |
| **Factory Method**   | Subclasses override `createProduct(type)` | India vs Swiss — same `"maggi"`, different Maggi         |
| **Abstract Factory** | Factory creates a **family** of products  | India vs Swiss — full combo: noodles + chocolate + drink |

```
Simple Factory     →  1 factory, many products (by type string)
Factory Method     →  family of factories, each builds one product line
Abstract Factory   →  family of factories, each builds a MATCHING SET
```

---

## When to use which?

| Situation                                       | Prefer                                     |
| ----------------------------------------------- | ------------------------------------------ |
| Few product types, one place creates them       | **Simple Factory**                         |
| Multiple regions, still one product at a time   | **Factory Method**                         |
| Need a consistent set (theme / region / UI kit) | **Abstract Factory**                       |
| Add a new line without touching old factories   | **Factory Method** or **Abstract Factory** |

---

## Lessons in this folder

1. [Simple Factory](./SimpleFactory/simpleFactory.md) → [`simpleFactory.ts`](./SimpleFactory/simpleFactory.ts)
2. [Factory Method](./FactoryMethod/factoryMethod.md) → [`factoryMethod.ts`](./FactoryMethod/factoryMethod.ts)
3. [Abstract Factory](./AbstractFactory/abstractFactory.md) → [`abstractFactory.ts`](./AbstractFactory/abstractFactory.ts)

```bash
npm run demo:simple-factory
npm run demo:factory-method
npm run demo:abstract-factory
npm run demo:factory
```

---

## Interview one-liner

> _"Factory hides `new`. Simple Factory is one creator. Factory Method lets subclasses pick one product. Abstract Factory creates a whole matching family."_
