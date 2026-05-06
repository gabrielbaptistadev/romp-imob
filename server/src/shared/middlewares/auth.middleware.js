import jwt from 'jsonwebtoken';
import { findUserById } from '../../modules/user/user.repository.js';
import errors from '../../modules/auth/auth.errors.js';

async function verifyToken(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(errors.login.unauthorized.status)
          .json({ message: errors.login.unauthorized.message });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findUserById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(errors.login.unauthorized.status)
              .json({ message: errors.login.unauthorized.message });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(errors.login.invalidOrExpiredToken.status)
          .json({ message: errors.login.invalidOrExpiredToken.message });
    }

}

export default verifyToken;
