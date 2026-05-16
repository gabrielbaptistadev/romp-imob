import { isValidCEP } from '../../../shared/utils/validators/cep.validator.js';
import errors from './address.errors.js';

function addressValidator(req, res, next) {

    const { zipCode, number } = req.body;

    if (zipCode !== undefined) {
        if (!isValidCEP(zipCode)) {
            return res.status(errors.user.address.zipCode.invalid.status).json(errors.user.address.zipCode.invalid);
        }

        if (number === undefined || number.trim() === '') {
            return res.status(errors.user.address.number.required.status).json(errors.user.address.number.required);
        }

        const sanitized = number.trim().toUpperCase();
        const isSemNumero = sanitized === 'S/N' || sanitized === 'SN';
        const numberRegex = /^(?=.*\d)[a-zA-Z0-9\s\-\/\.]+$/;

        if (!isSemNumero && !numberRegex.test(sanitized)) {
            return res.status(errors.user.address.number.invalid.status).json(errors.user.address.number.invalid);
        }

        req.body.number = sanitized;
    }

    next();
    
}

function deleteAddressValidator(req, res, next) {

    const { confirm } = req.body;

    if (!confirm) return res.status(errors.user.address.delete.confirmRequired.status).json(errors.user.address.delete.confirmRequired);

    next();

}

export { addressValidator, deleteAddressValidator }
