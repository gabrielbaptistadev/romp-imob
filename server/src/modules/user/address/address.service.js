import Audit from '../../audit/audit.model.js';
import errors from './address.errors.js';
import { findUserAddress, findUserAddressById } from './address.repository.js';
import { findUserById, findUserByEmail } from '../user.repository.js';

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

async function deleteAddress(userId, addressId, req) {

    const user = await findUserById(userId);

    const errorsList = [];

    const existingAddress = await findUserAddressById(userId, addressId);
    if (!existingAddress) {
        errorsList.push(errors.user.address.delete.invalidAddressId)

        await Audit.create({
            action: 'DELETE_ADDRESS_FAILED',
            userId: user?._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { reason: errors.user.address.delete.invalidAddressId.message }
        });

    }

    if (errorsList.length > 0) {
        throw {
            status: 422,
            errors: errorsList
        };
    }

    user.addresses.pull({ _id: addressId });
    await user.save();

    await Audit.create({
        action: 'DELETE_ADDRESS_SUCCESS',
        userId: user._id,
        ip: req.ip,
        userAgent: req.headers['user-agent']    
    });

}

export default { registerAddress, deleteAddress };