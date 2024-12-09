const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { sendWelcomeEmail } = require("./sendMail"); // Import the email service
const authenticateUser = require("./authMiddleware");
const placeOrderRoutes = require("./orderRoutes"); // Path to your orderRoutes.js file
const Order = require("./orderModel"); // Adjust the path according to your file structure
const fetchAndLogOrders = require("./fetchOrders"); // Import the fetchOrders module
const PastOrder = require("./pastOrderModel");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
  }),
);

app.use("/api/orders", placeOrderRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// MongoDB Connection URI and JWT secret
const MONGODB_URI = "Include Your URI";
const JWT_SECRET = "134124124121112"; // Replace with your actual JWT secret

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  })
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define Schema and Model for User
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shippingDetails: {
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
});

const User = mongoose.model("PotBiriyaniUsers", userSchema);

// Define Schema and Model for Menu Items
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true }, // Price as string to match provided data
  image: { type: String, required: false }, // Make image optional
});

const MenuItem = mongoose.model("potbiriyanimenus", menuItemSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File Upload Route
app.post(
  "/admin/upload-image",
  authenticateToken,
  upload.single("file"),
  (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    const imageUrl = `/uploads/${file.filename}`;
    res.json({ imageUrl });
  },
);

// Register Route
app.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      // Send welcome email
      await sendWelcomeEmail(email, "New User");

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Login Route
app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        console.error("User not found:", email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error("Password mismatch for user:", email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res
        .status(200)
        .json({ token, user: { email: user.email, id: user._id } });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Failed to login" });
    }
  },
);

// User Profile Route
app.get("/userprofile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ email: user.email });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update User Email Route
app.put(
  "/userprofile",
  authenticateToken,
  [body("email").isEmail().withMessage("Invalid email format")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const currentUser = await User.findOne({ email: req.user.email });

      if (!currentUser)
        return res.status(404).json({ error: "User not found" });

      // Check if the new email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ error: "Email already in use" });

      // Update email
      currentUser.email = email;
      await currentUser.save();

      // Generate a new token with the updated email
      const newToken = jwt.sign({ email: currentUser.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ email: currentUser.email, token: newToken });
    } catch (err) {
      console.error("Update email error:", err);
      res.status(500).json({ error: "Failed to update email" });
    }
  },
);

// Update Shipping Details Route
app.put(
  "/shipping-details",
  authenticateToken,
  [
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("postalCode").notEmpty().withMessage("Postal code is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { address, city, state, postalCode, country } = req.body;
      const user = await User.findOne({ email: req.user.email });

      if (!user) return res.status(404).json({ error: "User not found" });

      // Update shipping details
      user.shippingDetails = { address, city, state, postalCode, country };
      await user.save();

      res
        .status(200)
        .json({ message: "Shipping details updated successfully" });
    } catch (err) {
      console.error("Update shipping details error:", err);
      res.status(500).json({ error: "Failed to update shipping details" });
    }
  },
);

// Get Shipping Details Route
app.get("/shipping-details", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.shippingDetails);
  } catch (err) {
    console.error("Shipping details fetch error:", err);
    res.status(500).json({ error: "Failed to fetch shipping details" });
  }
});

// Change Password Route
app.put("/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token found" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Get Menu Items Route
app.get("/menu-items", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error("Fetch menu items error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Delete Account Route
app.delete("/delete-account", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    // Find and delete the user by email
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optionally, you can also handle any additional cleanup here

    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// Get Single Menu Item by ID
app.get("/menu-items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });
    res.json(menuItem);
  } catch (err) {
    console.error("Fetch single menu item error:", err);
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});

// Admin Route: Get Menu Items
app.get("/admin/menu-items", authenticateToken, async (req, res) => {
  try {
    // Optionally, add admin verification logic here
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error("Fetch menu items error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Create Menu Item Route with Image Upload
// Admin Route: Create Menu Item
app.post(
  "/admin/menu-items",
  authenticateToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("image")
      .optional()
      .isString()
      .withMessage("Image URL must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, price, image } = req.body;

      const newMenuItem = new MenuItem({ name, description, price, image });
      await newMenuItem.save();
      res.status(201).json({ message: "Menu item created successfully" });
    } catch (err) {
      console.error("Create menu item error:", err);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  },
);

// Update Menu Item Route
app.put("/admin/menu-items/:id", authenticateToken, async (req, res) => {
  const { name, description, price, image } = req.body;
  const itemId = req.params.id;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { name, description, price, image },
      { new: true },
    );
    if (!updatedItem)
      return res.status(404).json({ error: "Menu item not found" });

    res.json({ message: "Menu item updated successfully", item: updatedItem });
  } catch (err) {
    console.error("Update menu item error:", err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete Menu Item Route
app.delete("/admin/menu-items/:id", authenticateToken, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin Route: Fetch all users
app.get("/admin/users", authenticateToken, async (req, res) => {
  try {
    // Optionally, add admin verification logic here
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Admin Route: Delete a user by ID
app.delete("/admin/users/:id", authenticateToken, async (req, res) => {
  try {
    // Optionally, add admin verification logic here
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.get("/admin/orders", authenticateToken, async (req, res) => {
  try {
    // Fetch orders from the database
    const orders = await Order.find(); // Adjust this if you have any specific query
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT /admin/orders/:orderId
app.put("/admin/orders/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    // Validate status and update order
    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).send({ error: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    res.send(updatedOrder);
  } catch (err) {
    res.status(500).send({ error: "Failed to update order" });
  }
});

app.get("/admin/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send(order);
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(500).send({ error: "Failed to fetch order details" });
  }
});

app.get("/orders/:userId", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders) return res.status(404).json({ error: "No orders found" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/admin/orderTracking/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Modify this line to pass an object with a property to filter by
    const order = await Order.findOne({ orderId: orderId }); // Use 'id' or '_id' based on your schema

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send(order);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send({ error: "Failed to fetch order details" });
  }
});

app.delete("/admin/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order to delete
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Move the order to PastOrder collection
    const pastOrder = new PastOrder(order.toObject());
    await pastOrder.save();

    // Delete the order from the active Order collection
    await Order.findByIdAndDelete(orderId);

    res
      .status(200)
      .json({ message: "Order deleted and moved to past orders successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Get all past orders
app.get("/admin/past-orders", authenticateToken, async (req, res) => {
  try {
    const pastOrders = await PastOrder.find();
    res.json(pastOrders);
  } catch (err) {
    console.error("Error fetching past orders:", err);
    res.status(500).json({ error: "Failed to fetch past orders" });
  }
});

app.get("/admin/past-orders/:id", authenticateToken, async (req, res) => {
  try {
    const pastOrder = await PastOrder.findById(req.params.id);
    if (!pastOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(pastOrder);
  } catch (err) {
    console.error("Error fetching past order details:", err);
    res.status(500).json({ error: "Failed to fetch past order details" });
  }
});

const staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  position: {
    type: String,
    enum: [
      "Restaurant Manager",
      "Head Chef (Biryani Specialist)",
      "Sous Chef",
      "Biryani Cook",
      "Prep Cook",
      "Server/Waiter",
      "Host/Hostess",
      "Busser",
      "Dishwasher",
      "Cashier",
      "Delivery Driver",
    ],
  },
  salary: Number,
  phone: String,
  address: String,
  status: {
    type: String,
    enum: ["active", "inactive", "on_leave", "terminated"],
    default: "active",
  },
});

const Staff = mongoose.model("Staff", staffSchema);

app.get("/admin/staff", async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// Get staff by ID
app.get("/admin/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ error: "Staff not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff details" });
  }
});

// Add new staff
app.post("/admin/staff", async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    const savedStaff = await newStaff.save();
    res.json(savedStaff);
  } catch (err) {
    res.status(500).json({ error: "Failed to add staff" });
    console.error("Failed to fetch staff:", err); // Log the error
  }
});

// Update staff
app.put("/admin/staff/:id", async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.json(updatedStaff);
  } catch (err) {
    res.status(500).json({ error: "Failed to update staff" });
  }
});

// Delete staff
app.delete("/admin/staff/:id", async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});
const Message = mongoose.model("Message", messageSchema);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Route to delete a specific message
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Message.findByIdAndDelete(id);
    if (result) {
      res.json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

app.get("/totalOrders", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); // Count total orders
    const orders = await Order.find(); // Fetch all orders to calculate the total amount
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    ); // Calculate total amount

    res.json({ totalOrders, totalAmount }); // Return total orders and total amount in JSON format
  } catch (error) {
    res.status(500).json({ message: "Error fetching total orders" });
  }
});

app.get("/ordersByDate", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders by date" });
  }
});

app.get("/totalDishesSold", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    const dishCounts = {};

    // Iterate through orders to count each dish
    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Assuming 'items' is an array of dishes in each order
        if (dishCounts[item.name]) {
          dishCounts[item.name] += item.quantity; // Increment count
        } else {
          dishCounts[item.name] = item.quantity; // Initialize count
        }
      });
    });

    // Convert dishCounts object to an array for easier chart rendering
    const dishCountsArray = Object.keys(dishCounts).map((name) => ({
      name,
      total: dishCounts[name],
    }));

    res.json(dishCountsArray); // Return as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish counts" });
  }
});

const PORT = process.env.PORT || 3000; // Changed port to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
