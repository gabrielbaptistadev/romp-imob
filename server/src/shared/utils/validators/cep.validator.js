export function isValidCEP(cep) {
    return /^\d{5}-?\d{3}$/.test(cep);
}
