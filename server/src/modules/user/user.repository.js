import User from "./user.model.js";

async function findUserByEmail(email, includePassword = false) {

    let query = User.findOne({ "email.email": email });

    if (includePassword) {
        query = query.select('+password');
    }

    return await query;
}

async function findUserByCpf(cpf) {
    return User.findOne({ cpf });
}

async function findUserByCnpj(cnpj) {
    return User.findOne({ cnpj });
}

async function findUserByPhone(phone) {
    return User.findOne({ "phone.phone": phone });
}

async function findUserById(id, includePassword = false) {

    let query = User.findById(id);

    if (includePassword) {
        query = query.select('+password');
    }

    return await query;
}

async function markUserAsDeleted(userId, updateData) {
    return await User.findByIdAndUpdate(
        userId,
        updateData,
        { returnDocument: 'after' }
    );

}

export { findUserByEmail, findUserByCpf, findUserByCnpj, findUserByPhone, findUserById, markUserAsDeleted };
