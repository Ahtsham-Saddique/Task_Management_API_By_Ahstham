module.exports = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({

            success: false,
            message: "Please Login"

        });

    }

    if (req.user.role !== "admin") {

        return res.status(403).json({

            success: false,
            message: "Access Denied"

        });

    }

    next();

};