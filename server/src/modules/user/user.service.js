import Audit from '../audit/audit.model.js';
import bcrypt from 'bcrypt';
import errors from './user.errors.js';
import { findUserById, findUserByEmail, findUserByCpf, findUserByCnpj, findUserByPhone } from './user.repository.js';
import { getCooldownStatus } from '../../shared/utils/cooldown/isUserUpdateCooldownActive.js';

// Cooldowns

const cooldown90d = 90 * 24 * 60 * 60 * 1000;
const cooldown14d = 14 * 24 * 60 * 60 * 1000;

async function getProfile(userId) {
    const user = await findUserById(userId);
    if (!user) {
        throw errors.notFound;
    }
    return user;
}

async function updateProfile(userId, updateData, req) {

    const user = await findUserById(userId);
    if (!user) {
        throw errors.notFound;
    }
    const { name, email, phone, birthDate, gender, userType } = updateData;
    const errorsList = [];
    const changes = [];

    if (name !== undefined && name !== null) {

        if (name === user.name) {
            errorsList.push(errors.user.name.sameAsOld);
        } else {

            changes.push({
                field: 'name',
                oldValue: user.name,
                newValue: name
            });
            
            user.name = name;

        }

    }

    if (email !== undefined && email !== null) {

        if (email === user.email.email) {
            errorsList.push(errors.user.email.sameAsOld);
        } else {

            const existingEmail = await findUserByEmail(email);
            if (existingEmail) {
                errorsList.push(errors.user.email.alreadyExists);
            }
    
            const status = getCooldownStatus(user, 'email', cooldown14d);
            if (status.inCooldown) {
                errorsList.push({
                    ...errors.user.email.changeCooldown,
                    meta: { remainingTime: status.remainingTime }
                });
            } else {
    
                changes.push({
                    field: 'email',
                    oldValue: user.email.email,
                    newValue: email
                });
        
                user.email.email = email;
                user.email.verified = false;
                user.cooldowns.email.lastChangedAt = new Date();
    
            }

        }

    }

    if (phone !== undefined && phone !== null) {

        if (phone === user.phone.phone) {
            errorsList.push(errors.user.phone.sameAsOld);
        } else {

            const existingPhone = await findUserByPhone(phone);
            if (existingPhone) {
                errorsList.push(errors.user.phone.alreadyExists);
            }
    
            const status = getCooldownStatus(user, 'phone', cooldown14d);
            if (status.inCooldown) {
                errorsList.push({
                    ...errors.user.phone.changeCooldown,
                    meta: { remainingTime: status.remainingTime }
                });
            } else {
    
                changes.push({
                    field: 'phone',
                    oldValue: user.phone.phone,
                    newValue: phone
                });
        
                user.phone.phone = phone;
                user.phone.verified = false;
                user.cooldowns.phone.lastChangedAt = new Date();
    
            }

        }

    }

    if (gender !== undefined && gender !== null) {

        if (gender === user.gender) {
            errorsList.push(errors.user.gender.sameAsOld);
        } else {

            const status = getCooldownStatus(user, 'gender', cooldown90d);
            if (status.inCooldown) {
                errorsList.push({
                    ...errors.user.gender.changeCooldown,
                    meta: { remainingTime: status.remainingTime }
                });
    
            } else {
                changes.push({
                    field: 'gender',
                    oldValue: user.gender,
                    newValue: gender
                });
                
                user.gender = gender;
                user.cooldowns.gender.lastChangedAt = new Date();
            }

        }

    }

    if (userType !== undefined && userType !== null) {

        if (userType === user.userType) {
            errorsList.push(errors.user.userType.sameAsOld);

        } else {

            const status = getCooldownStatus(user, 'userType', cooldown14d);

            if (status.inCooldown) {
                errorsList.push({
                    ...errors.user.userType.changeCooldown,
                    meta: { remainingTime: status.remainingTime }
                });

            } else {

                changes.push({
                    field: 'userType',
                    oldValue: user.userType,
                    newValue: userType
                });

                user.userType = userType;
                user.cooldowns.userType.lastChangedAt = new Date();
            }
        }
    }

    if (errorsList.length > 0) {
        throw {
            status: 422,
            errors: errorsList
        };
    }

    await user.save();

    if (changes.length > 0) {
        await Audit.create({
            action: 'USER_UPDATE',
            userId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { changes }
        });
    }
    
    return user;

}

export default {
    getProfile,
    updateProfile
}   