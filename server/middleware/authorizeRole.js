const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.userRole;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = authorizeRole;