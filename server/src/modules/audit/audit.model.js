import mongoose from 'mongoose';

const changeSchema = new mongoose.Schema({
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
}, { _id: false });

const auditSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'REGISTER',
            'LOGIN_SUCCESS',
            'LOGIN_FAILED',
            'LOGOUT',

            'VERIFY_EMAIL_SUCCESS',
            'VERIFY_EMAIL_FAILED',
            'VERIFY_PHONE_SUCCESS',
            'VERIFY_PHONE_FAILED',

            'PASSWORD_CHANGE',
            'PASSWORD_RESET_REQUEST',
            'PASSWORD_RESET_SUCCESS',
            'PASSWORD_RESET_FAILED',

            'USER_UPDATE',
            'ACCOUNT_DELETED',
            'ADDRESS_UPDATE'
        ]
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    ip: String,
    userAgent: String,

    metadata: {
        changes: {
            type: [changeSchema],
            default: undefined
        },

        reason: String,
        attemptedEmail: String,
        target: String,
    }

}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditSchema);

export default AuditLog;
