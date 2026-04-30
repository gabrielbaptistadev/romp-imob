function isCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }

    let dig1 = (soma * 10) % 11;
    if (dig1 === 10) dig1 = 0;
    if (dig1 !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }

    let dig2 = (soma * 10) % 11;
    if (dig2 === 10) dig2 = 0;

    return dig2 === parseInt(cpf[10]);
}

function isCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let soma = 0;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj[i]) * pesos1[i];
    }

    let dig1 = soma % 11;
    dig1 = dig1 < 2 ? 0 : 11 - dig1;
    if (dig1 !== parseInt(cnpj[12])) return false;

    soma = 0;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj[i]) * pesos2[i];
    }

    let dig2 = soma % 11;
    dig2 = dig2 < 2 ? 0 : 11 - dig2;

    return dig2 === parseInt(cnpj[13]);
}

module.exports = { isCNPJ, isCPF };