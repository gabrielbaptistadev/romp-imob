const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    ip: String,
    userAgent: String,

    metadata: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('AuditLog', auditSchema);