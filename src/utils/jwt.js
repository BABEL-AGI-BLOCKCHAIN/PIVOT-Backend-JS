import jwt from "jsonwebtoken";
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            walletAddress: user.walletAddress,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            walletAddress: user.walletAddress,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export { generateAccessToken, generateRefreshToken };
