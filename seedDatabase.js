const mongoose = require('mongoose');
const Order = require('./models/order'); // Import the Order model

async function seedDatabase() {
  try {
    // Connect to MongoDB using the provided connection string
    await mongoose.connect('mongodb+srv://group1:fDYU7nexsT359jDg@restaurantcluster.ey2ka.mongodb.net/?retryWrites=true&w=majority&appName=RestaurantCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define sample orders to populate the database
    const orders = [
      {
        customerName: "John Doe",
        deliveryAddress: "123 Main St, Toronto, ON",
        items: [
          { itemName: "Pizza", price: 15, quantity: 1 },
          { itemName: "Coke", price: 2, quantity: 1 },
        ],
        totalPrice: 17, // Total price calculated as 15 + 2
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        status: "READY", // Default status for new orders
      },
      {
        customerName: "Jane Smith",
        deliveryAddress: "456 Elm St, Vancouver, BC",
        items: [
          { itemName: "Burger", price: 10, quantity: 1 },
          { itemName: "Fries", price: 3, quantity: 1 },
        ],
        totalPrice: 13, // Total price calculated as 10 + 3
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
        totalPrice: 9, // Total price calculated as 8 + 1
        date: new Date().toISOString().split('T')[0],
        status: "DELIVERED", // Delivered status
        assignedDriver: "67afaec4e48dddf8c6316072", // Replace with a valid driver ID
      },
      {
        customerName: "Michael Brown",
        deliveryAddress: "321 Pine St, Calgary, AB",
        items: [
          { itemName: "Pasta", price: 12, quantity: 1 },
          { itemName: "Juice", price: 3, quantity: 1 },
        ],
        totalPrice: 15, // Total price calculated as 12 + 3
        date: new Date().toISOString().split('T')[0],
        status: "IN TRANSIT", // Assigned to a driver
        assignedDriver: "67afaf3de48dddf8c6316073", // Replace with a valid driver ID
      },
      {
        customerName: "Emily Davis",
        deliveryAddress: "654 Birch St, Ottawa, ON",
        items: [
          { itemName: "Steak", price: 20, quantity: 1 },
          { itemName: "Wine", price: 10, quantity: 1 },
        ],
        totalPrice: 30, // Total price calculated as 20 + 10
        date: new Date().toISOString().split('T')[0],
        status: "READY", // Default status for new orders
      },
    ];

    // Insert the sample orders into the database
    const result = await Order.insertMany(orders);
    console.log(`${result.length} orders inserted successfully!`);
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function to populate the database
seedDatabase();