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

    unauthorized: {
        field: "auth",
        message: "Acesso não autorizado.",
        status: 401
    },

    locked: {
        field: "auth",
        message: "Conta bloqueada devido a muitas tentativas de login. Tente novamente mais tarde.",
        status: 423
    },

    invalidOrExpiredToken: {
        field: "auth",
        message: "Token inválido ou expirado.",
        status: 401
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
