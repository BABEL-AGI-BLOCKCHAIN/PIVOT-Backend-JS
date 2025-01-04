import jwt from "jsonwebtoken";



const SECRET_KEY = process.env.JWT_SECRET;

export function authenticate(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" || err.message });
    }
  };
}
