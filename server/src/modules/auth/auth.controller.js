import authService from './auth.service.js';
import handleError from '../../shared/utils/handleError.js';

async function registerController(req, res) {
    try {

        const user = await authService.register({
            name: req.body.name,
            email: req.body.email,
            cpf: req.body.cpf,
            cnpj: req.body.cnpj,
            password: req.body.password,
            phone: req.body.phone,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            termsConsent: req.body.termsConsent,
        }, req);

        res.status(201).json(user);

    } catch (err) {
        return handleError(res, err);
    }
}

async function loginController(req, res) {
    try {

        const user = await authService.login(req.body.email, req.body.password, req);

        res.cookie('token', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: process.env.JWT_COOKIE_MAX_AGE
        });

        res.status(200).json(user);

        // const { token, ...userWithoutToken } = user;
        // res.status(200).json(userWithoutToken);

    } catch (err) {
        return handleError(res, err);
    }
}

export default {
    registerController,
    loginController
};