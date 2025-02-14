const mongoose = require('mongoose');
const Order = require('./models/order'); // Import your Order model

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://group1:fDYU7nexsT359jDg@restaurantcluster.ey2ka.mongodb.net/?retryWrites=true&w=majority&appName=RestaurantCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Insert test orders
    const orders = [
      {
        customerName: "John Doe",
        deliveryAddress: "123 Main St",
        itemsOrdered: [
          { itemName: "Pizza", price: 15 },
          { itemName: "Coke", price: 2 }
        ],
        date: new Date(),
        status: "READY" // Order is ready for pickup
      },
      {
        customerName: "Jane Smith",
        deliveryAddress: "456 Elm St",
        itemsOrdered: [
          { itemName: "Burger", price: 10 },
          { itemName: "Fries", price: 3 }
        ],
        date: new Date(),
        status: "READY", 
      },
      {
        customerName: "Alice Johnson",
        deliveryAddress: "789 Oak St",
        itemsOrdered: [
          { itemName: "Salad", price: 8 },
          { itemName: "Water", price: 1 }
        ],
        date: new Date(),
        status: "READY", // Order has been delivered
      }
    ];

    // Save orders to the database
    await Order.insertMany(orders);
    console.log("Test orders inserted successfully!");
  } catch (err) {
    console.error("Error seeding database:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();