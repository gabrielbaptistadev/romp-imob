const {
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasValidLength
} = require('../../shared/utils/validators/auth/password.validator');

const { calculateAge } = require('../../shared/utils/validators/auth/birthdate.validator');

const MIN_AGE = 13;
const ALLOWED_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

function isAllowedToRegister(birthDate) {
    const age = calculateAge(birthDate);
    return age >= MIN_AGE;
}

function isAllowedGender(gender) {
    return ALLOWED_GENDERS.includes(gender);
}

function isPasswordValidByPolicy(password) {
    return (
        hasValidLength(password) &&
        hasUppercase(password) &&
        hasLowercase(password) &&
        hasNumber(password) &&
        hasSpecialChar(password)
    );
}

module.exports = {
    isAllowedToRegister,
    isAllowedGender,
    isPasswordValidByPolicy
};
