import AuditLog from './audit.model.js';

async function create(data) {
    return AuditLog.create(data);
}

async function findByUserId(userId) {
    return AuditLog.find({ userId }).sort({ createdAt: -1 });
}

export {
    create,
    findByUserId
};