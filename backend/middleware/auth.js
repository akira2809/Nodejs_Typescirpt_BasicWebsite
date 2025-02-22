
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


const createToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.user = user;
        next();
    });
}

module.exports = 
{   
    authenticateToken,
    createToken,
    verifyToken,

};
