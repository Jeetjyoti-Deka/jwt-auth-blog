// Importing required modules
import express from "express";
import { Login, Logout, Register } from "./controller/UserController.js";
import authenticateToken from "./middleware/authMiddleware.js";

// Creating an instance of Express
const app = express();

// middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Define a route handler for the root path
app.get("/", (req, res) => {
  res.send("Hello, World!"); // Sending a simple response
});

// login route
app.post("/users/login", Login);

// registration route
app.post("/users/register", Register);

// lougout route
app.get("/users/logout", Logout);

// Route to protect
app.get("/users", authenticateToken, (req, res) => {
  res.send("Protected route");
});

// Define a port to listen on
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
