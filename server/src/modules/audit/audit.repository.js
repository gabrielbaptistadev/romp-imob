const AuditLog = require('./audit.model');

async function create(data) {
    return AuditLog.create(data);
}

async function findByUserId(userId) {
    return AuditLog.find({ userId }).sort({ createdAt: -1 });
}

module.exports = {
    create,
    findByUserId
};