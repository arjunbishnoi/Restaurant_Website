const mongoose = require('mongoose');
const Order = require('./models/order'); // Import your Order model

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://group1:fDYU7nexsT359jDg@restaurantcluster.ey2ka.mongodb.net/?retryWrites=true&w=majority&appName=RestaurantCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Define sample orders
    const orders = [
      {
        customerName: "John Doe",
        deliveryAddress: "123 Main St, Toronto, ON",
        items: [
          { itemName: "Pizza", price: 15, quantity: 1 },
          { itemName: "Coke", price: 2, quantity: 1 },
        ],
        totalPrice: 17, // Calculated total price
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        status: "READY", // Default status
      },
      {
        customerName: "Jane Smith",
        deliveryAddress: "456 Elm St, Vancouver, BC",
        items: [
          { itemName: "Burger", price: 10, quantity: 1 },
          { itemName: "Fries", price: 3, quantity: 1 },
        ],
        totalPrice: 13,
        date: new Date().toISOString().split('T')[0],
        status: "IN TRANSIT", // Assigned to a driver
        assignedDriver: "67afaec4e48dddf8c6316072", // Replace with a valid driver ID
      },
      {
        customerName: "Alice Johnson",
        deliveryAddress: "789 Oak St, Montreal, QC",
        items: [
          { itemName: "Salad", price: 8, quantity: 1 },
          { itemName: "Water", price: 1, quantity: 1 },
        ],
        totalPrice: 9,
        date: new Date().toISOString().split('T')[0],
        status: "IN TRANSIT", // Delivered
        assignedDriver: "67afaec4e48dddf8c6316072", // Replace with a valid driver ID
      },
      {
        customerName: "Michael Brown",
        deliveryAddress: "321 Pine St, Calgary, AB",
        items: [
          { itemName: "Pasta", price: 12, quantity: 1 },
          { itemName: "Juice", price: 3, quantity: 1 },
        ],
        totalPrice: 15,
        date: new Date().toISOString().split('T')[0],
        status: "IN TRANSIT",
        assignedDriver: "67afaf3de48dddf8c6316073",
      },
      {
        customerName: "Emily Davis",
        deliveryAddress: "654 Birch St, Ottawa, ON",
        items: [
          { itemName: "Steak", price: 20, quantity: 1 },
          { itemName: "Wine", price: 10, quantity: 1 },
        ],
        totalPrice: 30,
        date: new Date().toISOString().split('T')[0],
        status: "READY",
      },
    ];

    // Insert orders into the database
    const result = await Order.insertMany(orders);
    console.log(`${result.length} orders inserted successfully!`);
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();