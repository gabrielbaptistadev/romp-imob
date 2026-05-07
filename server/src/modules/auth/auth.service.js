import User from '../user/user.model.js';
import Audit from '../audit/audit.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errors from './auth.errors.js';
import { findUserById, findUserByEmail, findUserByCpf, findUserByCnpj, findUserByPhone } from '../user/user.repository.js';

async function register(userData, req) {

    const { name, email, cpf, cnpj, password, phone, birthDate, termsConsent } = userData;
    const errorsList = [];

    // Checagem de e-mail

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
        errorsList.push(errors.register.email.alreadyExists);
    }

    // Checagem de CPF

    if (cpf) {
        const existingCpf = await findUserByCpf(cpf);
        if (existingCpf) {
            errorsList.push(errors.register.cpf.alreadyExists);
        }
    }

    // Checagem de CNPJ
    if (cnpj) {
        const existingCnpj = await findUserByCnpj(cnpj);
        if (existingCnpj) {
            errorsList.push(errors.register.cnpj.alreadyExists);
        }
    }

    // Checagem de telefone
    const existingPhone = await findUserByPhone(phone);
    if (existingPhone) {
        errorsList.push(errors.register.phone.alreadyExists);
    }

    // Checagem de erros

    if (errorsList.length > 0) {
        throw {
            status: 409,
            errors: errorsList
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({

        name,
        email: { email },
        cpf,
        cnpj,
        password: hashedPassword,
        phone: { phone },
        birthDate,
        termsConsentAt: termsConsent ? new Date() : null,

    });

    await Audit.create({
        action: 'REGISTER',
        userId: newUser._id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    }); 

    return newUser;

}

async function login(email, password, req) {
    const user = await findUserByEmail(email, true);

    if (!user || !user.isActive) {

        await Audit.create({
            action: 'LOGIN_FAILED',
            userId: user?._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { reason: 'Usuário não encontrado ou inativo' }
        });  

        throw errors.login.invalidCredentials;

    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

        await Audit.create({
            action: 'LOGIN_FAILED',
            userId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { reason: 'Senha inválida' }
        });  

        throw errors.login.invalidCredentials;

    } else {

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        await Audit.create({
            action: 'LOGIN_SUCCESS',
            userId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        }); 
        
        return {
            id: user.id,
            email: user.email,
            token
        };

    }

}

export default { register, login };
