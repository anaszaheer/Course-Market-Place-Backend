import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log({error: error.message});
        res.status(401).json({ error: 'Invalid token' });
    }
};