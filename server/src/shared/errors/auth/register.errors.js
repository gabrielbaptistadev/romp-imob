module.exports = {
    name: {
        required: { field: "name", message: "O nome é obrigatório.", status: 422 },
        minLength: { field: "name", message: "O nome deve ter pelo menos 3 caracteres.", status: 422 },
        maxLength: { field: "name", message: "O nome deve ter no máximo 90 caracteres.", status: 422 },
        invalid: { field: "name", message: "O nome contém caracteres inválidos.", status: 422 }
    },

    cpf: {
        required: { field: "cpfOrCnpj", message: "O CPF é obrigatório.", status: 422 },
        invalid: { field: "cpfOrCnpj", message: "O CPF informado é inválido.", status: 422 },
        alreadyExists: { field: "cpfOrCnpj", message: "Este CPF já está cadastrado.", status: 409 }
    },

    cnpj: {
        required: { field: "cpfOrCnpj", message: "O CNPJ é obrigatório.", status: 422 },
        invalid: { field: "cpfOrCnpj", message: "O CNPJ informado é inválido.", status: 422 },
        alreadyExists: { field: "cpfOrCnpj", message: "Este CNPJ já está cadastrado.", status: 409 }
    },

    email: {
        required: { field: "email", message: "O e-mail é obrigatório.", status: 422 },
        invalid: { field: "email", message: "O e-mail informado é inválido.", status: 422 },
        alreadyExists: { field: "email", message: "Este e-mail já está cadastrado.", status: 409 }
    },

    password: {
        required: { field: "password", message: "A senha é obrigatória.", status: 422 },
        minLength: { field: "password", message: "A senha deve ter no mínimo 8 caracteres.", status: 422 },
        maxLength: { field: "password", message: "A senha deve ter no máximo 64 caracteres.", status: 422 },
        strength: { field: "password", message: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.", status: 422 }
    },

    confirmPassword: {
        required: { field: "confirmPassword", message: "A confirmação de senha é obrigatória.", status: 422 },
        mismatch: { field: "confirmPassword", message: "As senhas não coincidem.", status: 422 }
    },

    birthDate: {
        required: { field: "birthDate", message: "A data de nascimento é obrigatória.", status: 422 },
        invalid: { field: "birthDate", message: "A data de nascimento informada é inválida.", status: 422 },
        tooYoung: { field: "birthDate", message: "Você deve ter pelo menos 13 anos para se cadastrar.", status: 422 }
    },

    gender: {
        required: { field: "gender", message: "O gênero é obrigatório.", status: 422 },
        invalid: { field: "gender", message: "O gênero informado é inválido.", status: 422 }
    },

    terms: {
        required: { field: "terms", message: "É necessário aceitar os Termos de Uso e a Política de Privacidade.", status: 422 }
    }
};
