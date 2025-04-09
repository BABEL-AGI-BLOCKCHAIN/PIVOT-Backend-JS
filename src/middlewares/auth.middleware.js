import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("Unauthorized request");
        }

        const isAuthorized = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await prisma.user.findUnique(isAuthorized.id).select("-password -refreshToken");

        if (!user) {
            throw new Error("Unauthorized request");
        }

        req.user = user;
        next();
    } catch (error) {
        // throw new error(401, error.message || "Unauthorized request");
        return res.status(401).json({ message: error.message || "Unauthorized request" });
    }
};

const internalAuthMiddleware = (req, res, next) => {
    const secret = req.headers["internal-secret"];

    if (!secret || secret !== process.env.INTERNAL_SECRET) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};

export { verifyJWT, internalAuthMiddleware };
