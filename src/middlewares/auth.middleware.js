import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";



const verifyJWT = asyncHandler( async (req, _ , next) => {
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
            throw new apiError(401 ,"Unauthorized request");
        }

        req.user = user ;
        next();
        
    } catch (error) {
        throw new apiError(401 , error?.message || "Unauthorized request")
    }

});



export default verifyJWT;
