const { parsePhoneNumberFromString } = require('libphonenumber-js');

function normalizePhone(phone) {
    if (!phone) return null;

    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
        return null;
    }

    return phoneNumber.number; // formato E.164 (+5511999999999)
}

module.exports = {
    normalizePhone,
};