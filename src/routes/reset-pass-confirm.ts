import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@cygnetops/common';
import {sendVerificationEmail} from "../utils/email";

import { User } from '../models/user';

const router = express.Router();

router.post(
    '/api/users/reset-pass-confirm/',
    [
        body('password1')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
        body('password2')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, password1, password2 } = req.body;

        let decoded:any = jwt.verify(token, process.env.EMAIL_SECRET!);


        const existingUser = await User.findOne({ email: decoded.email });

        if (!existingUser) {
            throw new BadRequestError('User not found');
        }

        if (password1!==password2) {
            throw new BadRequestError('Passwords not match');
        }

        existingUser.password = password1;
        await existingUser.save();

        // // Generate JWT
        // const userJwt = jwt.sign(
        //   {
        //     id: user.id,
        //     email: user.email,
        //   },
        //   process.env.JWT_KEY!
        // );
        //
        // // Store it on session object
        // req.session = {
        //   jwt: userJwt,
        // };

        res.status(200).send();
    }
);

export { router as resetPassConfirmRouter };
