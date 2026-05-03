const User = require('../user/user.model');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const errors = require('./auth.errors');
const { findUserById, findUserByEmail, findUserByCpf, findUserByCnpj, findUserByPhone } = require('../user/user.repository');

async function register(userData) {

    const { name, email, cpf, cnpj, password, phone, userType, termsConsent } = userData;
    const errorsList = [];

    // Checagem de e-mail

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
        errorsList.push(errors.register.email.alreadyExists);
    }

    // Checagem de CPF

    if (cpf) {
        const existingCpf = await findUserByCpf(cpf);
        if (existingCpf) {
            errorsList.push(errors.register.cpf.alreadyExists);
        }
    }

    // Checagem de CNPJ
    if (cnpj) {
        const existingCnpj = await findUserByCnpj(cnpj);
        if (existingCnpj) {
            errorsList.push(errors.register.cnpj.alreadyExists);
        }
    }

    // Checagem de telefone
    const existingPhone = await findUserByPhone(phone);
    if (existingPhone) {
        errorsList.push(errors.register.phone.alreadyExists);
    }

    // Checagem de erros

    if (errorsList.length > 0) {
        throw {
            status: 409,
            errors: errorsList
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({

        name,
        email: { email },
        cpf,
        cnpj,
        password: hashedPassword,
        phone: { phone },
        userType,
        termsConsentAt: termsConsent ? new Date() : null,

    });

    return newUser;

}

module.exports = { register };