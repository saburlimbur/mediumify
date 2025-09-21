import { request, response } from 'express';
import fs from 'fs';
import { loginSchema, paramIdSchema, registerSchema, resetPasswordSchema, singleUserSchema, updateUserSchema } from '../utils/schema/user';

import * as userServices from '../services/userServices';

export const registerController = async (req = request, res = response, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const parse = registerSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errorMessage,
      });
    }

    const newUser = await userServices.registerUser({
      ...parse.data,
      file: req.file,
    });

    return res.json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req = request, res = response, next) => {
  try {
    const parse = loginSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errorMessage,
      });
    }

    const data = await userServices.loginUser(parse.data);

    return res.json({
      success: true,
      message: 'Login successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const singleUserController = async (req = request, res = response, next) => {
  try {
    const paramValidation = paramIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      const errorMessage = paramValidation.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: 'Invalid parameter',
        detail: errorMessage,
      });
    }

    const userData = await userServices.singleUser({ id: paramValidation.data.id });

    return res.json({
      success: true,
      message: 'Get single user successfully',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req = request, res = response, next) => {
  try {
    const paramValidation = paramIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      const errorMessage = paramValidation.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: 'Invalid parameter',
        detail: errorMessage,
      });
    }

    const parse = updateUserSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      if (req.file) fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errorMessage,
      });
    }

    const updatedUser = await userServices.updateUser(paramValidation.data.id, {
      ...parse.data,
      file: req.file,
    });

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    next(error);
  }
};

export const listUsersController = async (req = request, res = response, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const users = await userServices.listUsers({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    return res.status(200).json({
      success: true,
      message: 'List of users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const requestEmailReset = async (req = request, res = response, next) => {
  try {
    const parse = loginSchema
      .pick({
        email: true,
      })
      .safeParse(req.body); // hanya email

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    await userServices.getEmailReset(parse.data.email);

    return res.json({
      success: true,
      message: 'Reset link send to email',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req = request, res = response, next) => {
  try {
    const parse = resetPasswordSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        detail: errorMessage,
      });
    }

    const { tokenId } = req.params;

    await userServices.updatePassword(parse.data, tokenId);

    return res.json({
      success: true,
      message: 'Reset password succesfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req = request, res = response, next) => {
  try {
    const paramValidation = paramIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      const errorMessage = paramValidation.error.issues.map((err) => `${err.path} - ${err.message}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid parameter',
        detail: errorMessage,
      });
    }

    await userServices.deleteUser(paramValidation.data.id);

    return res.json({
      success: true,
      message: 'User and all related data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
