import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization header received:", authHeader); // Debug log

  if (!authHeader) {
    console.warn("No Authorization header provided");
    return res.status(401).json({ error: "Missing token" });
  }

  // Expecting header: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.warn("Token missing after 'Bearer'");
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    console.log("JWT decoded successfully:", decoded); // Debug log
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
