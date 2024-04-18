import jwt from "jsonwebtoken";

// Middleware function to verify JWT token
export const authenticateToken = (req, res, next) => {
  // Extract the JWT token from the request headers
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  // If token is not provided, send 401 Unauthorized response
  if (token === null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(token);

  // Verify the token
  jwt.verify(token, "secret12345", (err, user) => {
    if (err) {
      // If token is invalid or expired, send 403 Forbidden response
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log(user);
    // If token is valid, attach the user object to the request for use in route handlers
    req.user = user;
    next();
  });
};

export default authenticateToken;
