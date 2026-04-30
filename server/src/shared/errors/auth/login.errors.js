module.exports = {
    missingFields: {
        field: "auth",
        message: "E-mail, CPF ou CNPJ e senha são obrigatórios.",
        status: 422
    },

    invalidIdentifierFormat: {
        field: "auth",
        message: "Formato de identificação inválido.",
        status: 422
    },

    invalidCredentials: {
        field: "auth",
        message: "O e-mail, CPF ou CNPJ não foi encontrado ou a senha está incorreta.",
        status: 401
    },

    accountInactive: {
        field: "auth",
        message: "Conta inativa ou bloqueada.",
        status: 403
    },

    tooManyAttempts: {
        field: "auth",
        message: "Muitas tentativas de login. Tente novamente mais tarde.",
        status: 429
    },

    internalError: {
        field: "auth",
        message: "Não foi possível realizar o login no momento.",
        status: 500
    }
};
