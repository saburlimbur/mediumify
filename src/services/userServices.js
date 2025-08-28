import * as userRepositories from "../repositories/userRepositores"

import fs from 'fs';
import path from 'path';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = async ({ name, email, password, file }) => {
    const emailExist = await userRepositories.isEmailExist(email);

    if (emailExist) {
        if (file && file.path) {
            fs.unlink(path.resolve(file.path), (err) => {
                if (err) console.error(err);
            });
        }
        throw new Error("Email already taken");
    }

    const user = await userRepositories.createUser({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        photo: file?.filename ?? null,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY ?? "", {
        expiresIn: "3 days",
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.photo,
        token,
    };
};
