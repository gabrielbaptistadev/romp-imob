const errors = require('./auth.errors');
const { isValidUserType, isPasswordValidByPolicy } = require('./auth.rules');
const { isValidName } = require('../../shared/utils/validators/auth/name.validator');
const { isEmail } = require('../../shared/utils/validators/auth/email.validator');
const { isCPF, isCNPJ } = require('../../shared/utils/validators/auth/document.validator');
const { normalizePhone } = require('../../shared/utils/validators/auth/phone.validator');

function registerValidator(req, res, next) {

    const {
        name,
        email,
        cpfOrCnpj,
        password,
        confirmPassword,
        phone,
        userType,
        termsConsent
    } = req.body;

    // VALIDATORS

    // Name
    if (!name) return res.status(errors.register.name.required.status).json(errors.register.name.required);
    if (!isValidName(name)) return res.status(errors.register.name.invalid.status).json(errors.register.name.invalid);
    if (name.length < 3) return res.status(errors.register.name.minLength.status).json(errors.register.name.minLength);
    if (name.length > 90) return res.status(errors.register.name.maxLength.status).json(errors.register.name.maxLength);

    // Email
    if (!email) return res.status(errors.register.email.required.status).json(errors.register.email.required);
    if (!isEmail(email)) return res.status(errors.register.email.invalid.status).json(errors.register.email.invalid);

    // Document (CPF or CNPJ)
    if (!cpfOrCnpj) return res.status(errors.register.cpfOrCnpj.required.status).json(errors.register.cpfOrCnpj.required);

    const cleanDocument = cpfOrCnpj.replace(/\D/g, '');

    if (cleanDocument.length === 11) {
        // CPF
        if (!isCPF(cleanDocument)) return res.status(errors.register.cpf.invalid.status).json(errors.register.cpf.invalid);

        req.body.cpf = cleanDocument;
        delete req.body.cnpj;
    } else if (cleanDocument.length === 14) {
        // CNPJ
        if (!isCNPJ(cleanDocument)) return res.status(errors.register.cnpj.invalid.status).json(errors.register.cnpj.invalid);

        req.body.cnpj = cleanDocument;
        delete req.body.cpf;
    } else {
        return res.status(errors.register.cpfOrCnpj.invalid.status).json(errors.register.cpfOrCnpj.invalid);
    }

    // Password
    if (!password) return res.status(errors.register.password.required.status).json(errors.register.password.required);
    if (password.length < 8) return res.status(errors.register.password.minLength.status).json(errors.register.password.minLength);
    if (password.length > 64) return res.status(errors.register.password.maxLength.status).json(errors.register.password.maxLength);
    if (!isPasswordValidByPolicy(password)) return res.status(errors.register.password.strength.status).json(errors.register.password.strength);
    if (!confirmPassword) return res.status(errors.register.confirmPassword.required.status).json(errors.register.confirmPassword.required);
    if (password !== confirmPassword) return res.status(errors.register.confirmPassword.mismatch.status).json(errors.register.confirmPassword.mismatch);

    // Phone
    if (!phone) return res.status(errors.register.phone.required.status).json(errors.register.phone.required);
    if (!normalizePhone(phone)) return res.status(errors.register.phone.invalid.status).json(errors.register.phone.invalid);

    // User Type
    if (!userType) return res.status(errors.register.userType.required.status).json(errors.register.userType.required);
    if (!isValidUserType(userType)) return res.status(errors.register.userType.invalid.status).json(errors.register.userType.invalid);

    // Termos
    if (!termsConsent) return res.status(errors.register.termsConsent.required.status).json(errors.register.termsConsent.required);

    next();
}

function loginValidator(req, res, next) {

    const { email, password } = req.body;

    if (!email || !password) return res.status(errors.login.missingFields.status).json(errors.login.missingFields);

    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmail(normalizedEmail)) return res.status(errors.login.invalidIdentifierFormat.status).json(errors.login.invalidIdentifierFormat);
    if (normalizedEmail.length > 80) return res.status(errors.login.invalidIdentifierFormat.status).json(errors.login.invalidIdentifierFormat);

    req.body.email = normalizedEmail;

    next();
}

module.exports = { registerValidator, loginValidator };
