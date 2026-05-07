import {
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasValidLength
} from '../../shared/utils/validators/auth/password.validator.js';
import { calculateAge } from '../../shared/utils/validators/auth/birthdate.validator.js';

const allowedUserTypes = ["buyer", "seller", "tenant", "landlord"]

function isValidUserType(userType) {
    return allowedUserTypes.includes(userType)
}

const MIN_AGE = 13;
const ALLOWED_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

function isAllowedToRegister(birthDate) {
    const age = calculateAge(birthDate);
    return age >= MIN_AGE;
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
    isPasswordValidByPolicy,
    isAllowedToRegister
};
