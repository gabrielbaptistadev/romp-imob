const UserModel = require('../user/user.model');
const bcrypt = require('bcrypt');
const errors = require('./auth.errors');

async function register(userData) {
    const { cpf, cnpj, email, password } = userData;

    const errorsList = [];

    /* ---------------- CHECAGEM DE DOCUMENTO ---------------- */

    if (cpf) {
        const existingCpf = await UserModel.findOne({ cpf });

        if (existingCpf) {
            errorsList.push(errors.register.cpf.alreadyExists);
        }
    }

    if (cnpj) {
        const existingCnpj = await UserModel.findOne({ cnpj });

        if (existingCnpj) {
            errorsList.push(errors.register.cnpj.alreadyExists);
        }
    }

    /* ---------------- CHECAGEM DE EMAIL ---------------- */

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
        errorsList.push(errors.register.email.alreadyExists);
    }

    /* ---------------- SE EXISTEM ERROS ---------------- */

    if (errorsList.length > 0) {
        throw {
            status: 409,
            errors: errorsList
        };
    }

    /* ---------------- HASH DA SENHA ---------------- */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------------- CRIAÇÃO DO USUÁRIO ---------------- */

    const newUser = await UserModel.create({
        ...userData,
        password: hashedPassword,
        cpf: cpf || null,
        cnpj: cnpj || null,
        addresses: userData.addresses || []
    });

    /* ---------------- RETORNO SEGURO ---------------- */

    return {
        _id: newUser._id,
        name: newUser.name,
        cpf: newUser.cpf,
        cnpj: newUser.cnpj,
        email: newUser.email,
        birthDate: newUser.birthDate,
        gender: newUser.gender,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
    };
}

async function login({ identifierType, identifierValue, password }) {

    const filter = {
        [identifierType]: identifierValue
    };

    const user = await UserModel
        .findOne(filter)
        .select('+password');

    if (!user) {
        const error = errors.login.invalidCredentials;
        throw { status: error.status, ...error };
    }

    if (!user.isActive) {
        const error = errors.login.accountInactive;
        throw { status: error.status, ...error };
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = errors.login.invalidCredentials;
        throw { status: error.status, ...error };
    }

    const userObj = user.toObject();
    delete userObj.password;

    return {
        user: {
            id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            role: userObj.role
        }
    };
}

module.exports = { register, login };