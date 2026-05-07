export default {

    name: {
        required: { field: "name", message: "O nome é obrigatório.", status: 400 },
        minLength: { field: "name", message: "O nome deve ter pelo menos 3 caracteres.", status: 422 },
        maxLength: { field: "name", message: "O nome deve ter no máximo 90 caracteres.", status: 422 },
        invalid: { field: "name", message: "O nome contém caracteres inválidos.", status: 400 }
    },

    cpf: {
        invalid: { field: "cpf", message: "O CPF informado é inválido.", status: 422 },
        alreadyExists: { field: "cpf", message: "Este CPF já está cadastrado.", status: 409 }
    },

    cnpj: {
        invalid: { field: "cnpj", message: "O CNPJ informado é inválido.", status: 422 },
        alreadyExists: { field: "cnpj", message: "Este CNPJ já está cadastrado.", status: 409 }
    },

    cpfOrCnpj: {
        required: { field: "cpfOrCnpj", message: "CPF ou CNPJ é obrigatório.", status: 422 },
        invalid: { field: "cpfOrCnpj", message: "O documento inserido é inválido.", status: 422}
    },

    email: {
        required: { field: "email", message: "O e-mail é obrigatório.", status: 400 },
        invalid: { field: "email", message: "O e-mail informado é inválido.", status: 400 },
        alreadyExists: { field: "email", message: "Este e-mail já está cadastrado.", status: 409 }
    },

    password: {
        required: { field: "password", message: "A senha é obrigatória.", status: 400 },
        minLength: { field: "password", message: "A senha deve ter no mínimo 8 caracteres.", status: 400 },
        maxLength: { field: "password", message: "A senha deve ter no máximo 64 caracteres.", status: 400 },
        strength: { field: "password", message: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.", status: 400 }
    },

    confirmPassword: {
        required: { field: "confirmPassword", message: "A confirmação de senha é obrigatória.", status: 400 },
        mismatch: { field: "confirmPassword", message: "As senhas não coincidem.", status: 400 }
    },

    phone: {
        required: { field: "phone", message: "O número de telefone é obrigatório.", status: 400 },
        invalid: { field: "phone", message: "O número de telefone informado é inválido.", status: 400 },
        alreadyExists: { field: "phone", message: "Este número de telefone já está cadastrado.", status: 409 }
    },

    birthDate: {
        required: { field: "birthDate", message: "A data de nascimento é obrigatória.", status: 422 },
        invalid: { field: "birthDate", message: "A data de nascimento informada é inválida.", status: 422 },
        tooYoung: { field: "birthDate", message: "Você deve ter pelo menos 13 anos para se cadastrar.", status: 422 }
    },

    termsConsent: {
        required: { field: "termsConsent", message: "É necessário aceitar os Termos de Uso e Política de Privacidade.", status: 422 }
    }

};