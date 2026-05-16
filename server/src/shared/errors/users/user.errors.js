export default {

    name: {
        minLength: { field: "name", message: "O nome deve ter pelo menos 3 caracteres.", status: 422 },
        maxLength: { field: "name", message: "O nome deve ter no máximo 90 caracteres.", status: 422 },
        invalid: { field: "name", message: "O nome contém caracteres inválidos.", status: 400 },
        sameAsOld: { field: "name", message: "O novo nome deve ser diferente do nome atual.", status: 422 }
    },

    cpf: {
        changeNotAllowed: { field: "cpf", message: "Não é possível alterar o CPF.", status: 403 },
    },

    cnpj: {
        changeNotAllowed: { field: "cnpj", message: "Não é possível alterar o CNPJ.", status: 403 },
    },

    email: {
        invalid: { field: "email", message: "O e-mail informado é inválido.", status: 422 },
        sameAsOld: { field: "email", message: "O novo e-mail deve ser diferente do e-mail atual.", status: 422 },
        alreadyExists: { field: "email", message: "Este e-mail já está cadastrado.", status: 409 },
        changeCooldown: { field: "email", message: "Você só poderá alterar o e-mail novamente em 14 dias.", status: 422 },
        verificationCodeRequired: { field: "email", message: "É necessário fornecer o código de verificação para alterar o e-mail.", status: 422 },
        invalidVerificationCode: { field: "email", message: "O código de verificação fornecido é inválido ou expirou.", status: 422 }
    },

    password: {
        required: { field: "password", message: "A senha atual é obrigatória.", status: 422 },
        newPasswordRequired: { field: "password", message: "A nova senha é obrigatória.", status: 422 },
        invalidPassword : { field: "password", message: "A senha atual está incorreta.", status: 422 },
        minLength: { field: "password", message: "A senha deve ter no mínimo 8 caracteres.", status: 422 },
        maxLength: { field: "password", message: "A senha deve ter no máximo 64 caracteres.", status: 422 },
        strength: { field: "password", message: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.", status: 422 },
        sameAsOld: { field: "password", message: "A nova senha deve ser diferente da senha atual.", status: 422 },
    },

    confirmPassword: {
        required: { field: "confirmPassword", message: "A confirmação da nova senha é obrigatória.", status: 422 },
        mismatch: { field: "confirmPassword", message: "As senhas não coincidem.", status: 422 }
    },

    phone: {
        invalid: { field: "phone", message: "O novo número de telefone informado é inválido.", status: 422 },
        sameAsOld: { field: "phone", message: "O novo número de telefone deve ser diferente do número atual.", status: 422 },
        alreadyExists: { field: "phone", message: "Este número de telefone já está cadastrado.", status: 409 },
        changeCooldown: { field: "phone", message: "Você só poderá alterar o número de telefone novamente em 14 dias.", status: 422 },
        verificationCodeRequired: { field: "phone", message: "É necessário fornecer o código de verificação para alterar o número de telefone.", status: 422 },
        invalidVerificationCode: { field: "phone", message: "O código de verificação fornecido é inválido ou expirou.", status: 422 }
    },

    birthDate: {
        changeNotAllowed: { field: "birthDate", message: "Não é possível alterar a data de nascimento.", status: 403 }
    },

    gender: {
        invalid: { field: "gender", message: "O gênero informado é inválido.", status: 422 },
        sameAsOld: { field: "gender", message: "O novo gênero deve ser diferente do gênero atual.", status: 422 },
        changeCooldown: { field: "gender", message: "Você só poderá alterar o gênero novamente em 90 dias.", status: 422 }
    },

    userType: {
        invalid: { field: "userType", message: "O tipo de usuário informado é inválido.", status: 422 },
        changeCooldown: { field: "userType", message: "Você só poderá alterar o tipo de usuário novamente em 14 dias.", status: 422 }
    },

    address: {
        number: {
            required: { field: "address", message: "O número é obrigatório.", status: 422 }
        },
        zipCode: {
            required: { field: "address", message: "O CEP é obrigatório.", status: 422 },
            invalid: { field: "address", message: "O CEP informado é inválido.", status: 422 },
        },
        alreadyExists: { field: "address", message: "O endereço informado já está cadastrado.", status: 422 },
        limitReached: { field: "address", message: "O limite de endereços foi atingido.", status: 422 },
        delete: {
            confirmRequired: { field: "address", message: "É necessário confirmar a exclusão do endereço.", status: 422 }
        }
    },

    delete: {
        requiredPassword: { field: "password", message: "A senha é obrigatória para excluir a conta.", status: 422 },
        incorrectPassword: { field: "password", message: "A senha fornecida está incorreta.", status: 422 },
        confirmationRequired: { field: "confirmation", message: "É necessário confirmar a exclusão da conta.", status: 422 },
        alreadyDeleted: { field: "account", message: "A conta já foi excluída.", status: 422 }
    }

};
