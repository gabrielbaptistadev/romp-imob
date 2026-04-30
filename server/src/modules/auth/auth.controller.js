const authService = require('./auth.service');

async function register(req, res) {
    try {

        const user = await authService.register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpf: req.body.cpf,
            cnpj: req.body.cnpj,
            birthDate: req.body.birthDate,
            gender: req.body.gender
        });

        return res.status(201).json(user);

    } catch (err) {

        if (err.errors) {
            return res.status(err.status).json({
                errors: err.errors
            });
        }

        if (err.status) {
            return res.status(err.status).json(err);
        }

        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });

    }
}

async function login(req, res) {

    try {

        const user = await authService.login({
            identifierType: req.auth.type,
            identifierValue: req.auth.value,
            password: req.body.password
        });

        return res.status(200).json(user);

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json(err);
        }

        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });

    }

}

module.exports = { register, login };