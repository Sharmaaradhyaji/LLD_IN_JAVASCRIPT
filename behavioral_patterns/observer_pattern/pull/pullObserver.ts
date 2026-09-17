/**
 * OBSERVER — PULL MODEL (Weather Station)
 * ========================================
 *
 * Definition:
 *   Observable notifies with update() — no data in the call.
 *   Each Observer PULLS what it needs via getters on the subject.
 *
 * Matches standard UML: Observer "has a" reference to Observable. Mostly asked in interviews.
 */

// ---------------------------------------------------------------------------
// 1. Contracts
// ---------------------------------------------------------------------------

export interface IObserver {
  /** No payload — observer will pull state from the subject. */
  update(): void;
}

export interface IObservable {
  add(observer: IObserver): void;
  remove(observer: IObserver): void;
  notify(): void;
}

// ---------------------------------------------------------------------------
// 2. Concrete Observable — WeatherStation
// ---------------------------------------------------------------------------

export class WeatherStation implements IObservable {
  private observers: IObserver[] = [];
  private temperature = 0;
  private humidity = 0;

  add(observer: IObserver): void {
    this.observers.push(observer);
  }

  remove(observer: IObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(); // pull: "something changed" — go ask for details from the subject
    }
  }

  /** State change → notify subscribers. */
  setWeather(temperature: number, humidity: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.notify();
  }

  getTemperature(): number {
    return this.temperature;
  }

  getHumidity(): number {
    return this.humidity;
  }
}

// ---------------------------------------------------------------------------
// 3. Concrete Observers — each holds the station and pulls on update()
// ---------------------------------------------------------------------------

export class PhoneDisplay implements IObserver {
  constructor(private readonly station: WeatherStation) {}

  update(): void {
    // Pull only what this display needs
    const temp = this.station.getTemperature();
    console.log(`[PhoneDisplay] temperature: ${temp}°C`);
  }
}

export class TvDisplay implements IObserver {
  constructor(private readonly station: WeatherStation) {}

  update(): void {
    // Pull a different slice of state
    const temp = this.station.getTemperature();
    const humidity = this.station.getHumidity();
    console.log(`[TvDisplay] ${temp}°C, humidity ${humidity}%`);
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:observer-pull
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Observer Pull: Weather Station ===\n");

  const station = new WeatherStation();
  const phone = new PhoneDisplay(station);
  const tv = new TvDisplay(station);

  station.add(phone);
  station.add(tv);

  console.log("Weather update #1");
  station.setWeather(32, 70);

  console.log("\nWeather update #2");
  station.setWeather(28, 55);

  console.log("\nUnsubscribe phone, update #3");
  station.remove(phone);
  station.setWeather(30, 60);
}
