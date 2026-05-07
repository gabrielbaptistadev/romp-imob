import errors from './user.errors.js';
import { isValidUserType, isPasswordValidByPolicy } from '../auth/auth.rules.js';
import { isValidName } from '../../shared/utils/validators/auth/name.validator.js';
import { isEmail } from '../../shared/utils/validators/auth/email.validator.js';
import { normalizePhone } from '../../shared/utils/validators/auth/phone.validator.js';

function userUpdateValidator(req, res, next) {

    const { name, email, cpf, cnpj, phone, gender, userType } = req.body;
    const allowedFields = ['name', 'email', 'phone', 'gender', 'userType'];
    const hasAnyField = allowedFields.some(field => req.body[field] !== undefined);
    if (!hasAnyField) return res.status(400).json({ message: "Nenhum campo para atualizar." });

    // Nome
    if (name !== undefined) {
        if (name.length < 3) return res.status(errors.user.name.minLength.status).json(errors.user.name.minLength);
        if (name.length > 90) return res.status(errors.user.name.maxLength.status).json(errors.user.name.maxLength);
        if (!isValidName(name)) return res.status(errors.user.name.invalid.status).json(errors.user.name.invalid); 
    }

    // Email
    if (email !== undefined) {
        if (!isEmail(email)) return res.status(errors.user.email.invalid.status).json(errors.user.email.invalid);
    }

    // CPF e CNPJ
    if (cpf !== undefined || cnpj !== undefined) {
        return res.status(errors.user.cpf.changeNotAllowed.status).json(errors.user.cpf.changeNotAllowed);
    }

    // Telefone
    if (phone !== undefined) {
        const normalizedPhone = normalizePhone(phone);
        if (!normalizedPhone) return res.status(errors.user.phone.invalid.status).json(errors.user.phone.invalid);
    }

    // Gênero
    if (gender !== undefined) {
        const allowedGenders = ['male', 'female', 'prefer_not_to_say'];
        if (!allowedGenders.includes(gender)) return res.status(errors.user.gender.invalid.status).json(errors.user.gender.invalid);
    }

    // Tipo de usuário
    if (userType !== undefined) {
        if (!isValidUserType(userType)) return res.status(errors.user.userType.invalid.status).json(errors.user.userType.invalid);
    }

    next();
}

function changePasswordValidator(req, res, next) {

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword) return res.status(errors.user.password.required.status).json(errors.user.password.required);
    if (!newPassword) return res.status(errors.user.password.newPasswordRequired.status).json(errors.user.password.newPasswordRequired);
    if (newPassword.length < 8) return res.status(errors.user.password.minLength.status).json(errors.user.password.minLength);
    if (newPassword.length > 64) return res.status(errors.user.password.maxLength.status).json(errors.user.password.maxLength);
    if (!isPasswordValidByPolicy(newPassword)) return res.status(errors.user.password.strength.status).json(errors.user.password.strength);
    if (!confirmNewPassword) return res.status(errors.user.confirmPassword.required.status).json(errors.user.confirmPassword.required);
    if (newPassword !== confirmNewPassword) return res.status(errors.user.confirmPassword.mismatch.status).json(errors.user.confirmPassword.mismatch);

    next();

}

function deleteAccountValidator(req, res, next) {

    const { password, confirm } = req.body;

    if (!password) return res.status(errors.user.delete.requiredPassword.status).json(errors.user.delete.requiredPassword);
    if (confirm !== true) return res.status(errors.user.delete.confirmationRequired.status).json(errors.user.delete.confirmationRequired);

    next();

}

export { userUpdateValidator, changePasswordValidator, deleteAccountValidator };