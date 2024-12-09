const mongoose = require("mongoose");

// MongoDB Connection URI (Replace with your Atlas connection string)
const MONGODB_URI =
  "mongodb+srv://acerspider5:KtmUfKuLbEnfKMjf@demo-potbiriyani.gljny.mongodb.net/PotBiriyani?retryWrites=true&w=majority";

// Define Schema and Model for Order
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "PotBiriyaniUsers",
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentDetails: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "potbiriyanimenus",
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB!");

    // Define mock data
    const mockOrder = {
      userId: new mongoose.Types.ObjectId(), // Use a valid ObjectId from your User collection
      shippingAddress: {
        address: "123 Default St",
        city: "Default City",
        state: "DC",
        postalCode: "12345",
        country: "USA",
      },
      paymentDetails: "dummyPaymentDetails",
      cartItems: [
        {
          itemId: new mongoose.Types.ObjectId(), // Use a valid ObjectId from your MenuItem collection
          quantity: 1,
        },
      ],
      totalPrice: 50,
    };

    // Insert mock data
    try {
      const newOrder = new Order(mockOrder);
      await newOrder.save();
      console.log("Mock order inserted successfully!");
    } catch (error) {
      console.error("Error inserting mock order:", error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
