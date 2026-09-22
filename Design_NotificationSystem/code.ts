/**
 * NOTIFICATION SYSTEM — Case Study
 * ==================================
 *
 * Combines four patterns you already practiced:
 *   Singleton  → NotificationService (one entry point)
 *   Decorator  → wrap SimpleNotification with Timestamp / Signature
 *   Observer   → pull model: Logger + NotificationEngine react to new notifs
 *   Strategy   → Email / SMS / PopUp delivery channels
 *
 * Please visit docs and Mermaid diagrams for more understanding via UML.
 */

// ===========================================================================
// 1. Decorator — build notification content dynamically
// ===========================================================================

/** Base contract: every notification can produce its content string. */
export interface INotification {
  getContent(): string;
}

/** Concrete component — plain text payload. */
export class SimpleNotification implements INotification {
  constructor(private readonly text: string) {}

  getContent(): string {
    return this.text;
  }
}

/**
 * Base decorator — holds an INotification and forwards getContent().
 * Same idea as BeverageDecorator wrapping a Beverage.
 */
export abstract class INotificationDecorator implements INotification {
  constructor(protected readonly notification: INotification) {}

  getContent(): string {
    return this.notification.getContent();
  }
}

/** Adds a timestamp prefix around the inner content. */
export class TimeStampDecorator extends INotificationDecorator {
  getContent(): string {
    const stamp = new Date().toISOString();
    return `[${stamp}] ${this.notification.getContent()}`;
  }
}

/** Appends a signature after the inner content. */
export class SignatureDecorator extends INotificationDecorator {
  constructor(
    notification: INotification,
    private readonly signature: string,
  ) {
    super(notification);
  }

  getContent(): string {
    return `${this.notification.getContent()}\n— ${this.signature}`;
  }
}

// ===========================================================================
// 2. Observer (pull) — subject holds current notification; observers pull it
// ===========================================================================

export interface IObserver {
  /** No payload — observer will pull state from the observable. */
  update(): void;
}

export interface IObservable {
  add(observer: IObserver): void;
  remove(observer: IObserver): void;
  notify(): void;
}

/**
 * Concrete subject — stores the latest INotification and fans out updates.
 * Observers call getNotification() on update() (classic pull UML).
 */
export class NotificationObservable implements IObservable {
  private observers: IObserver[] = [];
  private notification: INotification | null = null;

  add(observer: IObserver): void {
    this.observers.push(observer);
  }

  remove(observer: IObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }

  setNotification(notification: INotification): void {
    this.notification = notification;
    this.notify();
  }

  getNotification(): INotification | null {
    return this.notification;
  }
}

/** Observer that only logs — pulls content from the observable. */
export class Logger implements IObserver {
  constructor(private readonly observable: NotificationObservable) {}

  update(): void {
    const notif = this.observable.getNotification();
    if (!notif) return;
    console.log(`[Logger] ${notif.getContent()}`);
  }
}

// ===========================================================================
// 3. Strategy — interchangeable delivery channels
// ===========================================================================

/** Strategy interface — every channel looks the same to NotificationEngine. */
export interface INotificationStrategy {
  sendNotification(content: string): void;
}

export class EmailStrategy implements INotificationStrategy {
  constructor(private readonly email: string) {}

  sendNotification(content: string): void {
    console.log(`[Email → ${this.email}]\n${content}\n`);
  }
}

export class SMSStrategy implements INotificationStrategy {
  constructor(private readonly phone: string) {}

  sendNotification(content: string): void {
    console.log(`[SMS → ${this.phone}] ${content.replace(/\n/g, " | ")}\n`);
  }
}

export class PopUpStrategy implements INotificationStrategy {
  sendNotification(content: string): void {
    console.log(`[PopUp]\n${content}\n`);
  }
}

/**
 * Observer + Strategy context.
 * On update(), pulls content once, then delegates to every registered strategy.
 */
export class NotificationEngine implements IObserver {
  private readonly strategies: INotificationStrategy[] = [];

  constructor(private readonly observable: NotificationObservable) {}

  addStrategy(strategy: INotificationStrategy): void {
    this.strategies.push(strategy);
  }

  update(): void {
    const notif = this.observable.getNotification();
    if (!notif) return;

    const content = notif.getContent();
    for (const strategy of this.strategies) {
      strategy.sendNotification(content);
    }
  }
}

// ===========================================================================
// 4. Singleton — single entry point that owns the observable + history
// ===========================================================================

/**
 * NotificationService — Singleton orchestrator.
 *
 * Why Singleton here?
 *   Apps usually want ONE place to fire notifications so observers/strategies
 *   are wired once (same reasoning as a shared Logger).
 */
export class NotificationService {
  private static instance: NotificationService | null = null;

  private readonly notifications: INotification[] = [];
  private readonly observable: NotificationObservable;

  private constructor(observable: NotificationObservable) {
    this.observable = observable;
  }

  static getInstance(
    observable?: NotificationObservable,
  ): NotificationService {
    if (!NotificationService.instance) {
      if (!observable) {
        throw new Error(
          "First getInstance() must receive a NotificationObservable",
        );
      }
      NotificationService.instance = new NotificationService(observable);
    }
    return NotificationService.instance;
  }

  /** Test / demo helper — do not use in production code paths. */
  static resetInstance(): void {
    NotificationService.instance = null;
  }

  /**
   * Store the notification, then push it onto the observable.
   * Observers (Logger, NotificationEngine) react via update().
   */
  sendNotification(notification: INotification): void {
    this.notifications.push(notification);
    this.observable.setNotification(notification);
  }

  getNotifications(): readonly INotification[] {
    return this.notifications;
  }
}

// ===========================================================================
// Demo — run with: npm run demo:notification
// ===========================================================================

if (require.main === module) {
  console.log("=== Notification System (Singleton + Decorator + Observer + Strategy) ===\n");

  // Fresh singleton for this demo run
  NotificationService.resetInstance();

  const observable = new NotificationObservable();

  // Observers (pull) — hold a reference to the observable
  const logger = new Logger(observable);
  const engine = new NotificationEngine(observable);

  // Strategies — Email / SMS / PopUp (can mix freely)
  engine.addStrategy(new EmailStrategy("user@example.com"));
  engine.addStrategy(new SMSStrategy("+91-98765-43210"));
  engine.addStrategy(new PopUpStrategy());

  observable.add(logger);
  observable.add(engine);

  const service = NotificationService.getInstance(observable);

  // Decorator stack: Simple → Timestamp → Signature
  const decorated: INotification = new SignatureDecorator(
    new TimeStampDecorator(
      new SimpleNotification("Your order #42 has shipped!"),
    ),
    "Team Acme",
  );

  console.log("--- Sending decorated notification ---\n");
  service.sendNotification(decorated);

  console.log("--- Sending a plain notification ---\n");
  service.sendNotification(
    new SimpleNotification("Flash sale: 20% off for the next hour."),
  );

  console.log(`History size: ${service.getNotifications().length}`);
  console.log(
    "Same service instance?",
    service === NotificationService.getInstance(),
  );
}
