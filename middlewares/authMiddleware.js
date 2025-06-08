const jwt = require('jsonwebtoken');
const util = require('../exports/util'); // adjust the path as needed
const User = require("../models/Users.model");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Token should be in the format: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return util.ResFail(req, res, 'Unauthorized: Token missing.', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (util.isEmpty(decoded)) {
            return util.ResFail(req, res, 'Invaild Token.', 401);
        }

        const user = await User.findOne({ _id: util.objectId(decoded.id) }).catch(error => { throw error });
        
        if (util.isEmpty(user)) {
            return util.ResFail(req, res, 'User not found.', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return util.ResFail(req, res, 'Unauthorized: Invalid or expired token.', 401);
    }
};

module.exports = authenticate;