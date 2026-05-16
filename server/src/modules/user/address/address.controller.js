import addressService from './address.service.js';
import handleError from '../../../shared/utils/handleError.js';

async function registerAddressController(req, res) {
    try {

        const address = await addressService.registerAddress(req.user.id, req.body, req);
        return res.status(201).json(address);

    } catch (err) {
        return handleError(res, err);
    }
}

async function deleteAddressController(req, res) {
    try {

        await addressService.deleteAddress(req.user.id, req.params.addressId, req);
        return res.status(204).send()

    } catch (err) {
        return handleError(res, err)
    }

}

export default {
    registerAddressController,
    deleteAddressController
};
