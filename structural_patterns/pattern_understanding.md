# Structural Patterns

Structural patterns are about **how classes and objects are composed** — wrapping, adapting, and combining pieces so they work together without a messy inheritance tree.

## Lessons

### Decorator

Add behaviour to an object **dynamically** by wrapping it — without changing its class.

| Resource                                                                                   | What you'll learn                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| [decorator_pattern/pattern_understanding.md](./decorator_pattern/pattern_understanding.md) | Definition, UML, when to use                |
| [decorator.md](./decorator_pattern/decorator.md)                                           | Coffee shop toppings walkthrough            |
| [decorator.ts](./decorator_pattern/decorator.ts)                                           | Runnable SimpleCoffee + Milk / Sugar / Whip |

```bash
npm run demo:decorator
```

### Adapter

Make an incompatible class fit the interface your code expects — without changing either side. Payment gateway integration is the real-life demo.

| Resource | What you'll learn |
|----------|-------------------|
| [adapter_pattern/pattern_understanding.md](./adapter_pattern/pattern_understanding.md) | Definition, UML, Adapter vs Decorator vs Facade |
| [adapter.md](./adapter_pattern/adapter.md) | Stripe-style + Razorpay-style SDKs behind one `PaymentProcessor` |
| [adapter.ts](./adapter_pattern/adapter.ts) | Bad vendor branching vs one adapter per gateway |

```bash
npm run demo:adapter
```

### Composite

Treat a single item and a group of items the same way — only for tree-shaped data. A file explorer that sizes files and folders is the demo.

| Resource | What you'll learn |
|----------|-------------------|
| [composite_pattern/pattern_understanding.md](./composite_pattern/pattern_understanding.md) | Problem, issues without it, UML, real use cases, when not to use |
| [composite.md](./composite_pattern/composite.md) | File / Folder / Shortcut walkthrough |
| [composite.ts](./composite_pattern/composite.ts) | Bad type-checking traversal vs Composite |

```bash
npm run demo:composite
```

### Proxy

Put a stand-in in front of an object to control when, whether, or how a call gets through. The four types — virtual, protection, caching, remote — are the demo.

| Resource | What you'll learn |
|----------|-------------------|
| [proxy_pattern/pattern_understanding.md](./proxy_pattern/pattern_understanding.md) | Problem, issues without it, the four types, UML, Proxy vs Decorator vs Adapter |
| [proxy.md](./proxy_pattern/proxy.md) | Document portal: one section per proxy type |
| [proxy.ts](./proxy_pattern/proxy.ts) | Eager loading and copy-pasted checks vs the four proxies |

```bash
npm run demo:proxy
```

### Bridge

Split a type that varies in two independent directions so each side can grow without a class per combination. Payroll reports × PDF / HTML / CSV is the demo.

| Resource | What you'll learn |
|----------|-------------------|
| [bridge_pattern/pattern_understanding.md](./bridge_pattern/pattern_understanding.md) | Problem, issues without it, UML, where the shape shows up, Bridge vs Strategy vs Adapter |
| [bridge.md](./bridge_pattern/bridge.md) | Salary slip and tax summary, each drawn by a swappable renderer |
| [bridge.ts](./bridge_pattern/bridge.ts) | A 2×2 switch vs reports composed with renderers |

```bash
npm run demo:bridge
```
