const authorize = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated - run protect middleware first"
            });
        }

        const userRole = req.user.role;

        const isAllowed = allowedRoles.includes(userRole);

        if (!isAllowed) {
            return res.status(403).json({
                success: false,
                message: `Access forbidden - your role '${userRole}' is not allowed`,
                required: allowedRoles,
                yourRole: userRole
            });
        }

        console.log(`Authorized: ${req.user.name} has role '${userRole}'`);
        next();
    };
};

export default authorize;