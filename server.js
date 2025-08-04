// app.js (or server.js)

// 1. Import the Express module
const express = require("express");
const productApiRoutes = require("./routes/products");
const serverless = require("serverless-http");
const cors = require("cors");

// 2. Create an Express application instance
const app = express();
app.use(cors());
// 3. Define the port the server will listen on
const port = process.env.PORT || 8080; // You can choose any available port, common ones are 3000, 5000, 8080
// Serve static files from the 'public' directory
app.use(express.static("public"));
// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/products", productApiRoutes);
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
