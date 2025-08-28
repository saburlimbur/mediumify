import { request, response } from "express"
import {registerSchema} from "../utils/schema/user";

import * as userServices from "../services/userServices";

export const registerController = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            })
        }

        const parse = registerSchema.safeParse(req.body);

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);
            if(req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                detail: errorMessage,
            });
        }

        const newUser = await userServices.register({
            ...parse.data,
            file: req.file,
        });

        return res.json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        });
    } catch(err) {
        next(err);
    }
}
