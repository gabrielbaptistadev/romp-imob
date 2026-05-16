import userService from './user.service.js';
import handleError from '../../shared/utils/handleError.js';

async function getProfileController(req, res) {
    try {

        const user = await userService.getProfile(req.user.id);

        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email.email,
            document: user.cpf || user.cnpj,
            phone: user.phone.phone,
            gender: user.gender,
            userType: user.userType,
            birthDate: user.birthDate,
            addresses: user.addresses
        });

    } catch (err) {
        return handleError(res, err);
    }
}

async function userUpdateController(req, res) {
    try {

        const user = await userService.updateProfile(
            req.user.id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                userType: req.body.userType,
                birthDate: req.body.birthDate
            },
            req
        );

        return res.status(200).json(user);

    } catch (err) {
        return handleError(res, err);
    }
}

async function changePasswordController(req, res) {
    try {

        await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword, req);
        return res.status(200).json({ message: "Senha alterada com sucesso." });

    } catch (err) {
        return handleError(res, err);
    }
}

async function registerAddressController(req, res) {
    try {

        const address = await userService.registerAddress(req.user.id, req.body, req);
        return res.status(201).json(address);

    } catch (err) {
        return handleError(res, err);
    }
}

async function deleteAddressController(req, res) {
    try {

        await userService.deleteAddress(req.user.id, req.params.addressId, req);
        return res.status(204).send()

    } catch (err) {
        return handleError(res, err)
    }

}

async function deleteAccountController(req, res) {
    try {

        await userService.deleteAccount(req.user.id, req.body.password, req);
        res.clearCookie('token');
        return res.status(204).send();

    } catch (err) {
        return handleError(res, err);
    }
}


export default {
    userUpdateController,
    getProfileController,
    changePasswordController,
    registerAddressController,
    deleteAddressController,
    deleteAccountController
};