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
        throw new error(401 , error.response.data || "Unauthorized request")
    }

};



export default verifyJWT;
