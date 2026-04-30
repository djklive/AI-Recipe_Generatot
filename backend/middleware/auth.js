import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided, access denied', 
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token', 
            });
        }

        // Add user info to the request object    
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Failed to authenticate token', 
        });
    }
}

export default authMiddleware;