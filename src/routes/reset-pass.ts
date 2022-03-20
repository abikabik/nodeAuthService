import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@cygnetops/common';
import {sendResetEmail} from "../utils/email";

import { User } from '../models/user';

const router = express.Router();

router.post(
    '/api/users/reset-pass/',
    [
        body('email')
            .isEmail()
            .withMessage('Must be valid email'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email } = req.body;


        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError('User not found');
        }

        const verificationToken = jwt.sign(
            {
                email:existingUser.email
            },
            process.env.EMAIL_SECRET!,
            {
                expiresIn: "1h"
            }
        )

        sendResetEmail(existingUser, verificationToken);


        res.status(200).send();
    }
);

export { router as resetPassRouter };
