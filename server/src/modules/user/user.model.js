import mongoose from 'mongoose';
const { Schema } = mongoose;

const emailSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null,
        select: false
    }
}, { _id: false });

const phoneSchema = new Schema({
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null,
        select: false
    }
}, { _id: false });

const addressesSchema = new Schema({
    street: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    complement: {
        type: String,
    },
    neighborhood: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 90,
        trim: true
    },

    email: {
        type: emailSchema,
        required: true,
    },

    cpf: {
        type: String,
        trim: true,
    },

    cnpj: {
        type: String,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 64,
        select: false
    },

    phone: {
        type: phoneSchema,
        required: true,
    },

    userType: {
        type: String,
        enum: ['buyer', 'seller', 'tenant', 'landlord'],
    },

    profileType: {
        type: String,
        enum: ['default', 'agent', 'company'],
        default: 'default'
    },

    creci: {
        type: String,
        trim: true,
        default: null,
        required: function () {
            return this.profileType === 'agent' || this.profileType === 'company';
        }
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    isActive: {
        type: Boolean,
        default: true
    },

    
    birthDate: {
        type: Date,
        required: true
    },
    
    gender: {
        type: String,
        enum: ['male', 'female', 'prefer_not_to_say'],
    },
    
    addresses: {
        type: [addressesSchema],
        default: []
    },
    
    termsConsentAt: {
        type: Date,
        required: true
    },

    loginAttempts: {
        type: Number,
        default: 0
    },

    lockUntil: {
        type: Date,
        default: null
    },

    cooldowns: {
        email: { lastChangedAt: { type: Date, default: null } },
        phone: { lastChangedAt: { type: Date, default: null } },
        userType: { lastChangedAt: { type: Date, default: null } },
        gender: { lastChangedAt: { type: Date, default: null } }
    },

    deletedAt: {
        type: Date,
        default: null,
        select: false
    },

    deletedBy: {    
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

}, { timestamps: true });

userSchema.index({ 'email.email': 1 }, { unique: true });
userSchema.index({ 'phone.phone': 1 }, { unique: true });   
userSchema.pre(/^find/, function () {
    this.where({ deletedAt: null });
});

const User = mongoose.model('User', userSchema);

export default User;
