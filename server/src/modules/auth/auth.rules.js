const {
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasValidLength
} = require('../../shared/utils/validators/auth/password.validator');

const allowedUserTypes = ["buyer", "seller", "tenant", "landlord"]

function isValidUserType(userType) {
    return allowedUserTypes.includes(userType)
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
    isValidUserType,
    isPasswordValidByPolicy
};
