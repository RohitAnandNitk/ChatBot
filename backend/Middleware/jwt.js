import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const jwtAuthMiddleware = (req, res, next) => {
    let token = req.cookies.authToken; // Extract token from cookies

    console.log("Auth Token from Cookie:", token);

    // If token is not in cookies, check the Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]; // Extract from header
    }

    // If no token is found, return an error
    if (!token) {
        return res.status(401).json({ error: "Authorization token missing" });
    }

    try {
        // Verify token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user info to request
        req.user = decoded;
        next(); // Continue to the next middleware/route
    } catch (err) {
        console.error("Error verifying token:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
};
;

// Function to generate JWT token
export const generateToken = (userData) => {
    return jwt.sign(
        userData, 
        process.env.SECRET_KEY,  // ✅ Use the correct secret key
        { expiresIn: '24h' }     // Token expires in 24 hours
    );
};
