// app.js (or server.js)

// 1. Import the Express module
const express = require("express");
const productApiRoutes = require("./routes/products");
const serverless = require("serverless-http");
const cors = require("cors");

// 2. Create an Express application instance
const app = express();
// app.use(cors());
const allowedOrigins = ["https://www.mamark.shop", "https://mamark.shop"];
app.use(
  cors({
    // origin: "*",
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
    maxAge: 600, // cache OPTIONS for 10 minutes
  })
);

// 3. Define the port the server will listen on
// const port = process.env.PORT || 8080; // You can choose any available port, common ones are 3000, 5000, 8080
// Serve static files from the 'public' directory
app.use(express.static("public"));
// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/products", productApiRoutes);
app.use("/api/cart", require("./routes/cart"));
app.use("/api/user", require("./routes/user"));
app.use("/api/razorpay", require("./routes/payment/razorpay"));
app.use("/api/cod", require("./routes/payment/cod"));
app.use("/api/order", require("./routes/order"));
// app.use("/api/email", require("./routes/email"));
app.use("/api/shiprocket", require("./routes/shiprocket"));

// 4. Define a basic route
// This route will handle GET requests to the root URL ('/')
app.get("/", (req, res) => {
  res.send("Hello from your Express Server!"); // Send a simple text response
});

// 5. Start the server and listen for incoming requests
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

module.exports = app;
module.exports.handler = serverless(app);

if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`🚀 Local server running on http://localhost:${port}`);
  });
}
