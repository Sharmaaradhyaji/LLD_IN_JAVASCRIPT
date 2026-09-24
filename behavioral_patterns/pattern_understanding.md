# Behavioral Patterns

Behavioral patterns are about **how objects talk to each other** — communication, responsibility, and reaction — not about how objects are created (creational) or structured (structural).

## Lessons

### Observer

When one object’s state changes, notify everyone who subscribed.

| Resource | What you'll learn |
|----------|-------------------|
| [observer_pattern/pattern_understanding.md](./observer_pattern/pattern_understanding.md) | Definition, standard UML, Pull vs Push |
| [pull/pullObserver.md](./observer_pattern/pull/pullObserver.md) | Classic pull model + Weather Station |
| [push/pushObserver.md](./observer_pattern/push/pushObserver.md) | Push model + Weather Station |

```bash
npm run demo:observer
```

### Strategy

Swap algorithms (Card / UPI / Wallet) without rewriting checkout — kills giant if/else and keeps DRY.

| Resource | What you'll learn |
|----------|-------------------|
| [strategy_pattern/pattern_understanding.md](./strategy_pattern/pattern_understanding.md) | Problem, DRY, UML |
| [strategy.md](./strategy_pattern/strategy.md) | Payment checkout walkthrough |
| [strategy.ts](./strategy_pattern/strategy.ts) | Bad if/else vs Strategy |

```bash
npm run demo:strategy
```

### Command

Turn a request into an object — queue it, undo it, or bundle it into a macro. Smart Home Remote is the classic demo.

| Resource | What you'll learn |
|----------|-------------------|
| [command_pattern/pattern_understanding.md](./command_pattern/pattern_understanding.md) | Definition, UML, Command vs Strategy |
| [command.md](./command_pattern/command.md) | Remote + Light / Fan + undo + macro |
| [command.ts](./command_pattern/command.ts) | Bad if/else remote vs Command |

```bash
npm run demo:command
```
