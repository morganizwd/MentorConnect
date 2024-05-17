const authorizeOwnerOrAdmin = (Model) => {
    return async (req, res, next) => {
        try {
            const instance = await Model.findByPk(req.params.id);
            if (!instance) {
                return res.status(404).json({ message: `${Model.name} not found` });
            }

            if (instance.userId === req.userId || req.userRole === 'admin') {
                return next();
            } else {
                return res.status(403).json({ message: 'Forbidden: You are not allowed to perform this action' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };
};

module.exports = authorizeOwnerOrAdmin;
