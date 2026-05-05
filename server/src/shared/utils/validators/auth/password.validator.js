function hasUppercase(password) {
    return /[A-Z]/.test(password);
}

function hasLowercase(password) {
    return /[a-z]/.test(password);
}

function hasNumber(password) {
    return /\d/.test(password);
}

function hasSpecialChar(password) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function hasValidLength(password, min = 7, max = 32) {
    return password.length >= min && password.length <= max;
}

export {
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasValidLength
};
