import Audit from '../audit/audit.model.js';
import bcrypt from 'bcrypt';
import errors from './user.errors.js';
import { findUserById, findUserByEmail, findUserByCpf, findUserByCnpj, findUserByPhone, findUserAddress, markUserAsDeleted } from './user.repository.js';
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

async function changePassword(userId, currentPassword, newPassword, req) {

    const errorsList = [];
    const user = await findUserById(userId, true);

    if (!user) {
        errorsList.push(errors.commonErrors.notFound);
    }

    if (user) {
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            errorsList.push(errors.user.password.invalidPassword);
        }

        const samePassword = await bcrypt.compare(newPassword, user.password);
        if (samePassword) {
            errorsList.push(errors.user.password.sameAsOld);
        }

    }

    if (errorsList.length > 0) {
        throw {
            status: 422,
            errors: errorsList
        };
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await Audit.create({
        action: 'PASSWORD_CHANGED',
        userId: user._id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

}

async function registerAddress(userId, addressData, req) {

    const user = await findUserById(userId);

    const { zipCode, number, complement } = addressData;

    const errorsList = [];

    const viacepResponse = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
    const viacepData = await viacepResponse.json();

    if (user.addresses.length >= 3) {
        errorsList.push(errors.user.address.limitReached);

        await Audit.create({
            action: 'REGISTER_ADDRESS_FAILED',
            userId: user?._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { reason: errors.user.address.limitReached.message }
        });

    }

    if (viacepData.erro) {
        errorsList.push(errors.user.address.zipCode.invalid);

        await Audit.create({
            action: 'REGISTER_ADDRESS_FAILED',
            userId: user?._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { reason: errors.user.address.zipCode.invalid.message }
        });
    }

    const existingAddress = await findUserAddress(userId, zipCode, number, complement);
    if (existingAddress) {
        errorsList.push(errors.user.address.alreadyExists)

        await Audit.create({
            action: 'REGISTER_ADDRESS_FAILED',
            userId: user?._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { reason: errors.user.address.alreadyExists.message }
        });

    }

    if (errorsList.length > 0) {
        throw {
            status: 422,
            errors: errorsList
        };
    }

    const newAddress = {
        zipCode: viacepData.cep,
        street: viacepData.logradouro,
        neighborhood: viacepData.bairro,
        city: viacepData.localidade,
        state: viacepData.estado,
        number,
        complement
    };

    user.addresses.push(newAddress);
    await user.save();

    await Audit.create({
        action: 'REGISTER_ADDRESS_SUCCESS',
        userId: user._id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    return newAddress;

}

async function deleteAccount(userId, password, req) {

    const errorsList = [];
    const user = await findUserById(userId, true);
    if (!user) {
        errorsList.push(errors.commonErrors.notFound);
    }

    if (user) {
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            errorsList.push(errors.user.delete.incorrectPassword);
        }

    }

    if (errorsList.length > 0) {
        throw {
            status: 422,
            errors: errorsList
        };
    }

    await markUserAsDeleted(userId, {

        deletedAt: new Date(),
        deletedBy: userId,
        isActive: false,

        name: 'Deleted User',

        email: {
            email: `deleted_${userId}@deleted.local`,
            verified: false,
            verificationToken: null
        },

        phone: {
            phone: `deleted_${userId}`,
            verified: false,
            verificationToken: null
        },

        password: await bcrypt.hash(crypto.randomUUID(), 10),

        $unset: {
            cpf: 1,
            cnpj: 1,
            birthDate: 1,
            addresses: 1
        }


    });

    await Audit.create({
        action: 'ACCOUNT_DELETED',
        userId: user._id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    }); 

}

export default {
    getProfile,
    updateProfile,
    changePassword,
    registerAddress,
    deleteAccount
}
