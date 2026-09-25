/**
 * Zomato demo — walk the full flow while calling out patterns.
 *
 * Run: npm run demo:zomato
 *
 * Talk track while this runs:
 *   1. Seed restaurants into the Singleton RestaurantManager
 *   2. Search by location
 *   3. Fill cart
 *   4. Checkout with Factory (order type) + Strategy (payment)
 *   5. See notification + order list from Singleton OrderManager
 */
import { NowOrderFactory } from "./factories/NowOrderFactory";
import { ScheduleOrderFactory } from "./factories/ScheduleOrderFactory";
import { OrderManager } from "./managers/OrderManager";
import { RestaurantManager } from "./managers/RestaurantManager";
import { MenuItem } from "./models/MenuItem";
import { Restaurant } from "./models/Restaurant";
import { User } from "./models/User";
import { CreditCardPayment } from "./strategies/CreditCardPayment";
import { UpiPayment } from "./strategies/UpiPayment";
import { Zomato } from "./Zomato";

function seedRestaurants(): void {
  const manager = RestaurantManager.getInstance();

  const pizzaHut = new Restaurant(1, "Pizza Hut", "Delhi");
  pizzaHut.addMenuItem(new MenuItem("PH1", "Margherita", 299));
  pizzaHut.addMenuItem(new MenuItem("PH2", "Farmhouse", 399));

  const biryaniHouse = new Restaurant(2, "Biryani House", "Delhi");
  biryaniHouse.addMenuItem(new MenuItem("BH1", "Chicken Biryani", 249));
  biryaniHouse.addMenuItem(new MenuItem("BH2", "Mutton Biryani", 349));

  const dosaCorner = new Restaurant(3, "Dosa Corner", "Bangalore");
  dosaCorner.addMenuItem(new MenuItem("DC1", "Masala Dosa", 120));

  manager.addRestaurant(pizzaHut);
  manager.addRestaurant(biryaniHouse);
  manager.addRestaurant(dosaCorner);
}

function main(): void {
  // Clean singletons so re-running the demo is predictable.
  RestaurantManager.resetInstance();
  OrderManager.resetInstance();

  console.log("=== Zomato Food Delivery — LLD Demo ===\n");

  seedRestaurants();
  const app = new Zomato();
  const aaradhya = new User(101, "Aaradhya", "Connaught Place, Delhi");

  // --- Singleton: search uses the shared RestaurantManager ---
  console.log("--- 1) Search restaurants in Delhi (Singleton manager) ---");
  const delhiPlaces = app.searchRestaurants("Delhi");
  delhiPlaces.forEach((r) => console.log(`  • ${r.toString()}`));

  const pizzaHut = delhiPlaces[0];
  const menu = pizzaHut.getMenu();

  // --- Cart ---
  console.log("\n--- 2) Select restaurant + add to cart ---");
  app.selectRestaurant(aaradhya, pizzaHut);
  app.addToCart(aaradhya, menu[0]); // Margherita
  app.addToCart(aaradhya, menu[1]); // Farmhouse
  console.log(`  Cart total: ₹${aaradhya.getCart().totalCost()}`);

  // --- Factory (Now) + Strategy (UPI) ---
  console.log("\n--- 3) Checkout NOW as Delivery, pay with UPI (Factory + Strategy) ---");
  app.checkout(
    aaradhya,
    "delivery",
    new UpiPayment("aaradhya@upi"),
    new NowOrderFactory(),
  );

  // Second order: schedule + pickup + credit card — shows pattern flexibility
  console.log("\n--- 4) Another order: SCHEDULED Pickup + Credit Card ---");
  const biryaniHouse = delhiPlaces[1];
  const biryaniMenu = biryaniHouse.getMenu();
  app.selectRestaurant(aaradhya, biryaniHouse);
  app.addToCart(aaradhya, biryaniMenu[0]);

  app.checkout(
    aaradhya,
    "pickup",
    new CreditCardPayment("**** 4242"),
    new ScheduleOrderFactory("2026-09-20 20:00"),
  );

  // --- Singleton: OrderManager holds both orders ---
  console.log("\n--- 5) All orders (Singleton OrderManager) ---");
  app.listOrders().forEach((order) => {
    console.log(
      `  #${order.getId()} ${order.getType()} @ ${order.getRestaurant().getName()} → ₹${order.getTotal()}`,
    );
  });

  console.log("\n=== Demo complete ===");
}

main();
