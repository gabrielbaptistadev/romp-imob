import User from "../user.model.js";

async function findUserAddress(userId, zipCode, number, complement) {
    return User.findOne({
        _id: userId,
        addresses: {
            $elemMatch: {
                zipCode,
                number,
                complement
            }
        }
    });
}

async function findUserAddressById(userId, addressId) {
    return User.findOne({
        _id: userId,
        "addresses._id": addressId
    });
}

export { findUserAddress, findUserAddressById };
