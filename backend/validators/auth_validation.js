import { body } from "express-validator";

export const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];