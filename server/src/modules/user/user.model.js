const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
    },
    number: {
        type: String,
    },
    cep: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
}, {
    _id: false
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    cpf: {
        type: String,
        trim: true
    },

    cnpj: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 64,
        select: false
    },

    birthDate: {
        type: Date,
        required: true
    },

    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },

    phoneNumber: {
        type: new mongoose.Schema({
            number: {
                type: String,
                default: null,
                trim: true
            },
            verified: {
                type: Boolean,
                default: false
            }
        }, { _id: false }),
        default: () => ({})
    },
    
    addresses: {
        type: [addressSchema],
        default: []
    },

    isActive: {
        type: Boolean,
        default: true
    },

    role: {
        type: String,
        enum: ["user", "admin", "staff"],
        default: "user"
    },

}, {
    timestamps: true
});

userSchema.index({ cpf: 1 }, { unique: true, partialFilterExpression: { cpf: { $type: "string" } } });
userSchema.index({ cnpj: 1 }, { unique: true, partialFilterExpression: { cnpj: { $type: "string" } } });

module.exports = mongoose.model('User', userSchema);
