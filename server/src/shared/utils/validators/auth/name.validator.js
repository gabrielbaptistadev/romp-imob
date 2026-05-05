function isValidName(name) {
    return /^[A-Za-zÀ-ú\s]+$/.test(name);
}

export { isValidName };