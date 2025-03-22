import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";



const verifyJWT = async (req, _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") ;
        if (!token) {
            throw new apiError(401 , "Unauthorized request");
        }
    
        const isAuthorized = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) ;
    
        const user = await prisma.user.findUnique (isAuthorized.id).select(
            "-password -refreshToken"
        )

        if (!user) {
            throw new error(401 ,"Unauthorized request");
        }

        req.user = user ;
        next();
        
    } catch (error) {
        throw new error(401 , error.message || "Unauthorized request")
    }

};


const internalAuthMiddleware = (req, res, next) => {
    const secret = req.headers['internal-secret'];

    if (!secret || secret !== process.env.INTERNAL_SECRET) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
};

export { verifyJWT, internalAuthMiddleware };
