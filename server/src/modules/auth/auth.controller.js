import authService from './auth.service.js';

function handleError(res, err) {

    if (err.errors && err.status) {
        return res.status(err.status).json({ errors: err.errors });
    }

    if (err.status) {
        return res.status(err.status).json(err);
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'JSON inválido na requisição'
        });
    }

    console.error('[UNEXPECTED ERROR]', err);

    return res.status(500).json({
        message: 'Erro interno do servidor'
    });
}

async function registerController(req, res) {
    try {

        const user = await authService.register({
            name: req.body.name,
            email: req.body.email,
            cpf: req.body.cpf,
            cnpj: req.body.cnpj,
            password: req.body.password,
            phone: req.body.phone,
            userType: req.body.userType,
            termsConsent: req.body.termsConsent
        });

        res.status(201).json(user);

    } catch (err) {
        return handleError(res, err);
    }
}

async function loginController(req, res) {
    try {

        const user = await authService.login(req.body.email, req.body.password);

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