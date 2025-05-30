import jwt from 'jsonwebtoken'

const ACCESS_SECRET = 'secret1234utd'

// Set the token in the cache memory
//We need a key that is unique for each user
//TTL Refers to the time to live of the token

export const generateAccessToken = (userId: string) => {
        return jwt.sign(
            { userId },
            ACCESS_SECRET,
            { 
                expiresIn: '15m' 
            },
        )
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_SECRET);
    } catch (error) {
        return null;
    }
}