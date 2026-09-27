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
