import {
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasValidLength
} from '../../shared/utils/validators/auth/password.validator.js';

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

export {
    isValidUserType,
    isPasswordValidByPolicy
};
