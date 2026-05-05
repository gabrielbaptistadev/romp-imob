export default {
    missingFields: {
        field: "auth",
        message: "E-mail e senha são obrigatórios.",
        status: 422
    },

    invalidIdentifierFormat: {
        field: "auth",
        message: "Formato de identificação inválido.",
        status: 422
    },

    invalidCredentials: {
        field: "auth",
        message: "O e-mail não foi encontrado ou a senha está incorreta.",
        status: 401
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
