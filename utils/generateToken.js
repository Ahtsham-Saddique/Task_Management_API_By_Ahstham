const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        // Return a clear error instead of crashing with a 500
        const err = new Error("Server misconfigured: JWT_SECRET is not set");
        err.status = 500;
        throw err;
    }

    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        jwtSecret,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = generateToken;

