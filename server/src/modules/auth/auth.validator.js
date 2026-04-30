const errors = require('./auth.errors');

const { isValidName } = require('../../shared/utils/validators/auth/name.validator');
const { isEmail } = require('../../shared/utils/validators/auth/email.validator');
const { isCPF, isCNPJ } = require('../../shared/utils/validators/auth/document.validator');

const {
    isAllowedToRegister,
    isAllowedGender,
    isPasswordValidByPolicy
} = require('./auth.rules');

function registerMiddleware(req, res, next) {
    const {
        name,
        cpfOrCnpj,
        email,
        password,
        confirmPassword,
        birthDate,
        gender,
        terms
    } = req.body;

    /* ---------------- NAME ---------------- */

    if (!name) {
        return res.status(422).json(errors.register.name.required);
    }

    if (name.length < 3) {
        return res.status(422).json(errors.register.name.minLength);
    }

    if (name.length > 90) {
        return res.status(422).json(errors.register.name.maxLength);
    }

    if (!isValidName(name)) {
        return res.status(422).json(errors.register.name.invalid);
    }

    /* ---------------- CPF / CNPJ ---------------- */

    if (!cpfOrCnpj) {
        return res.status(422).json(errors.register.cpf.required);
    }

    const cleanDocument = cpfOrCnpj.replace(/\D/g, '');

    if (cleanDocument.length === 11) {
        if (!isCPF(cleanDocument)) {
            return res.status(422).json(errors.register.cpf.invalid);
        }

        req.body.cpf = cleanDocument;
        delete req.body.cnpj;

    } else if (cleanDocument.length === 14) {
        if (!isCNPJ(cleanDocument)) {
            return res.status(422).json(errors.register.cnpj.invalid);
        }

        req.body.cnpj = cleanDocument;
        delete req.body.cpf;

    } else {
        return res.status(422).json(errors.register.cpf.invalid);
    }

    /* ---------------- EMAIL ---------------- */

    if (!email) {
        return res.status(422).json(errors.register.email.required);
    }

    if (!isEmail(email)) {
        return res.status(422).json(errors.register.email.invalid);
    }

    /* ---------------- PASSWORD ---------------- */

    if (!password) {
        return res.status(422).json(errors.register.password.required);
    }

    if (password.length < 8) {
        return res.status(422).json(errors.register.password.minLength);
    }

    if (password.length > 64) {
        return res.status(422).json(errors.register.password.maxLength);
    }

    if (!isPasswordValidByPolicy(password)) {
        return res.status(422).json(errors.register.password.strength);
    }

    if (password !== confirmPassword) {
        return res.status(422).json(errors.register.confirmPassword.mismatch);
    }

    /* ---------------- BIRTHDATE ---------------- */

    const { calculateAge } = require('../../shared/utils/validators/auth/birthdate.validator');
    const birthCheck = calculateAge(birthDate);

    if (!birthDate) {
        return res.status(422).json(errors.register.birthDate.required);
    }

    if (birthCheck === null) {
        return res.status(422).json(errors.register.birthDate.invalid);
    }

    if (!isAllowedToRegister(birthDate)) {
        return res.status(422).json(errors.register.birthDate.tooYoung);
    }

    /* ---------------- GENDER ---------------- */

    if (!gender) {
        return res.status(422).json(errors.register.gender.required);
    }

    if (!isAllowedGender(gender)) {
        return res.status(422).json(errors.register.gender.invalid);
    }

    /* ---------------- TERMS ---------------- */

    if (!terms) {
        return res.status(422).json(errors.register.terms.required);
    }

    const accepted = terms === true || terms === 'true';

    if (!accepted) {
        return res.status(422).json(errors.register.terms.required);
    }   

    next();
}

function loginMiddleware(req, res, next) {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(422).json(errors.login.missingFields);
    }

    const normalizedUser = user.trim();
    const cleanDocument = normalizedUser.replace(/\D/g, '');

    if (normalizedUser.includes('@')) {
        if (!isEmail(normalizedUser)) {
            return res.status(422).json(errors.login.invalidIdentifierFormat);
        }

        req.auth = {
            type: 'email',
            value: normalizedUser.toLowerCase()
        };

    } else if (cleanDocument.length === 11) {
        if (!isCPF(cleanDocument)) {
            return res.status(422).json(errors.login.invalidIdentifierFormat);
        }

        req.auth = {
            type: 'cpf',
            value: cleanDocument
        };

    } else if (cleanDocument.length === 14) {
        if (!isCNPJ(cleanDocument)) {
            return res.status(422).json(errors.login.invalidIdentifierFormat);
        }

        req.auth = {
            type: 'cnpj',
            value: cleanDocument
        };

    } else {
        return res.status(422).json(errors.login.invalidIdentifierFormat);
    }

    next();
}

module.exports = {
    registerMiddleware,
    loginMiddleware
};
