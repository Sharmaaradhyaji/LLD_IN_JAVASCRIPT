# Design a Food Delivery App → (Tomato)

## Functional Requirements

- User can search for Restaurants based on location.
- User can add items to cart.
- User can checkout by making payment.
- User should be notified once order is placed successfully.

## Non-functional Requirements

- Each part of the design should be scalable & modifiable.

## Approach

- Bottom-up design: start from core models, then managers/factories/strategies, then the orchestration class (`Tomato`).
- Payment uses the **Strategy** pattern (thin classes that call a 3rd-party gateway).
- `RestaurantManager` / `OrderManager` use **Singleton**.
- Orders are created via **Factory** (Now / Schedule → Delivery / Pickup).
- Notification stays a lean 3rd-party wrapper.

## High-level Flow

```
User → Restaurants (by location) → Menu → Cart / Order
         → Delivery | Pickup → Payment (Strategy) → Notification → User
```

## Docs & Code

- Design walkthrough + UML: [`improved-design_docs.md`](./improved-design_docs.md)
- Runnable TypeScript: [`code/`](./code/) — `npm run demo:tomato`
