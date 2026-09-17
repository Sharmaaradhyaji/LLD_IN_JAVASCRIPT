/**
 * OBSERVER — PUSH MODEL (Weather Station)
 * ========================================
 *
 * Definition:
 *   Observable PUSHES state into update(data).
 *   Observers do not need to call getters on the subject.
 */

// ---------------------------------------------------------------------------
// 1. Payload + contracts
// ---------------------------------------------------------------------------

export interface WeatherData {
  temperature: number;
  humidity: number;
}

export interface IObserver {
  /** Push: data arrives with the notification. */
  update(data: WeatherData): void;
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
    const data: WeatherData = {
      temperature: this.temperature,
      humidity: this.humidity,
    };
    for (const observer of this.observers) {
      observer.update(data); // push the payload
    }
  }

  setWeather(temperature: number, humidity: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.notify();
  }
}

// ---------------------------------------------------------------------------
// 3. Concrete Observers — no back-reference required for data
// ---------------------------------------------------------------------------

export class PhoneDisplay implements IObserver {
  update(data: WeatherData): void {
    console.log(`[PhoneDisplay] temperature: ${data.temperature}°C`);
  }
}

export class TvDisplay implements IObserver {
  update(data: WeatherData): void {
    console.log(
      `[TvDisplay] ${data.temperature}°C, humidity ${data.humidity}%`,
    );
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:observer-push
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Observer Push: Weather Station ===\n");

  const station = new WeatherStation();
  const phone = new PhoneDisplay();
  const tv = new TvDisplay();

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
