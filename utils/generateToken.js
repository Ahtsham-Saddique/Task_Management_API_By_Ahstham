const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not set");
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
