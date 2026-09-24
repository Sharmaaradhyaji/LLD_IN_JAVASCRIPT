/**
 * COMMAND — Smart Home Remote
 * ============================
 *
 * Definition:
 *   Turn a request into an object (Command) with execute() / undo().
 *   Invoker (Remote) queues or runs commands without knowing receivers.
 *
 * Problem it solves:
 *   Buttons hard-code Light.on() / Fan.high() — no undo, no macros, tight coupling.
 *
 * Killer feature vs Strategy:
 *   Command = encapsulate a *request* (often with undo / history / queue).
 *   Strategy = swap an *algorithm* for the same job.
 */

// ---------------------------------------------------------------------------
// BAD — remote knows every device method; undo is a nightmare
// ---------------------------------------------------------------------------

export class BadRemote {
  constructor(
    private readonly light: Light,
    private readonly fan: Fan,
  ) {}

  press(button: string): void {
    if (button === "light-on") {
      this.light.on();
    } else if (button === "light-off") {
      this.light.off();
    } else if (button === "fan-high") {
      this.fan.high();
    } else if (button === "fan-off") {
      this.fan.off();
    } else {
      throw new Error(`Unknown button: ${button}`);
    }
    // Undo? Macro "all off"? Queue for later? Edit this class again…
  }
}

// ---------------------------------------------------------------------------
// GOOD — Command
// ---------------------------------------------------------------------------

// ---- Receivers: the devices that actually do work ----

export class Light {
  private isOn = false;

  on(): void {
    this.isOn = true;
    console.log("[Light] ON");
  }

  off(): void {
    this.isOn = false;
    console.log("[Light] OFF");
  }

  isLit(): boolean {
    return this.isOn;
  }
}

export class Fan {
  private speed: "off" | "high" = "off";

  high(): void {
    this.speed = "high";
    console.log("[Fan] HIGH");
  }

  off(): void {
    this.speed = "off";
    console.log("[Fan] OFF");
  }

  getSpeed(): "off" | "high" {
    return this.speed;
  }
}

// ---- Command contract ----

/** Every request looks the same to the remote: execute / undo. */
export interface Command {
  execute(): void;
  undo(): void;
}

/** Null object — empty slot on the remote (safe no-op). */
export class NoCommand implements Command {
  execute(): void {}
  undo(): void {}
}

// ---- Concrete commands — each knows its receiver ----

export class LightOnCommand implements Command {
  constructor(private readonly light: Light) {}

  execute(): void {
    this.light.on();
  }

  undo(): void {
    this.light.off();
  }
}

export class LightOffCommand implements Command {
  constructor(private readonly light: Light) {}

  execute(): void {
    this.light.off();
  }

  undo(): void {
    this.light.on();
  }
}

export class FanHighCommand implements Command {
  private prev: "off" | "high" = "off";

  constructor(private readonly fan: Fan) {}

  execute(): void {
    this.prev = this.fan.getSpeed();
    this.fan.high();
  }

  undo(): void {
    if (this.prev === "off") {
      this.fan.off();
    } else {
      this.fan.high();
    }
  }
}

export class FanOffCommand implements Command {
  private prev: "off" | "high" = "off";

  constructor(private readonly fan: Fan) {}

  execute(): void {
    this.prev = this.fan.getSpeed();
    this.fan.off();
  }

  undo(): void {
    if (this.prev === "high") {
      this.fan.high();
    } else {
      this.fan.off();
    }
  }
}

/**
 * Macro — one command that runs many.
 * Undo runs the children in reverse order.
 */
export class MacroCommand implements Command {
  constructor(private readonly commands: Command[]) {}

  execute(): void {
    for (const cmd of this.commands) {
      cmd.execute();
    }
  }

  undo(): void {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}

// ---- Invoker — remote holds slots; never calls Light/Fan directly ----

/**
 * Invoker — owns button slots + undo history.
 * Written ONCE; works with any Command (OCP + undo for free).
 */
export class RemoteControl {
  private readonly onCommands: Command[] = [];
  private readonly offCommands: Command[] = [];
  private lastCommand: Command = new NoCommand();

  constructor(slotCount = 2) {
    for (let i = 0; i < slotCount; i++) {
      this.onCommands.push(new NoCommand());
      this.offCommands.push(new NoCommand());
    }
  }

  setCommand(slot: number, onCommand: Command, offCommand: Command): void {
    this.onCommands[slot] = onCommand;
    this.offCommands[slot] = offCommand;
  }

  onButtonPressed(slot: number): void {
    const cmd = this.onCommands[slot];
    cmd.execute();
    this.lastCommand = cmd;
  }

  offButtonPressed(slot: number): void {
    const cmd = this.offCommands[slot];
    cmd.execute();
    this.lastCommand = cmd;
  }

  undoButtonPressed(): void {
    console.log("[Remote] undo");
    this.lastCommand.undo();
    this.lastCommand = new NoCommand();
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:command
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Command: BAD (remote hard-codes devices) ===\n");

  const badLight = new Light();
  const badFan = new Fan();
  const badRemote = new BadRemote(badLight, badFan);
  badRemote.press("light-on");
  badRemote.press("fan-high");
  // No undo. Add "all off"? Edit BadRemote again.

  console.log("\n=== Command: GOOD (requests as objects + undo) ===\n");

  const light = new Light();
  const fan = new Fan();

  const remote = new RemoteControl(3);
  remote.setCommand(0, new LightOnCommand(light), new LightOffCommand(light));
  remote.setCommand(1, new FanHighCommand(fan), new FanOffCommand(fan));

  // Slot 2 = party mode macro (light on + fan high)
  const partyOn = new MacroCommand([
    new LightOnCommand(light),
    new FanHighCommand(fan),
  ]);
  const partyOff = new MacroCommand([
    new LightOffCommand(light),
    new FanOffCommand(fan),
  ]);
  remote.setCommand(2, partyOn, partyOff);

  console.log("--- Slot 0: Light ---");
  remote.onButtonPressed(0);
  remote.offButtonPressed(0);
  remote.undoButtonPressed(); // light back ON

  console.log("\n--- Slot 1: Fan ---");
  remote.onButtonPressed(1);
  remote.undoButtonPressed(); // fan back OFF

  console.log("\n--- Slot 2: Party macro ---");
  remote.onButtonPressed(2);
  remote.undoButtonPressed(); // reverse: fan off, then light off

  console.log("\nRemote never imported Light.on / Fan.high — only Command.execute().");
}
