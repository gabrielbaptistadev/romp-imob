const User = require("./user.model");

async function findUserByEmail(email) {
    return User
        .findOne({ "email.email": email })
        .select('+password');
}

async function findUserByCpf(cpf) {
    return User.findOne({ cpf });
}

async function findUserByCnpj(cnpj) {
    return User.findOne({ cnpj });
}

async function findUserByPhone(phone) {
    return User.findOne({ "phone.phone": phone });
}

async function findUserById(id) {
    return User.findById(id);
}

module.exports = { findUserByEmail, findUserByCpf, findUserByCnpj, findUserByPhone, findUserById};