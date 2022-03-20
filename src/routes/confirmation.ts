import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@cygnetops/common';

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.get(
    '/confirmation',
    async (req: Request, res: Response) => {
        const token:string = req.query.token as string;

        let decoded:any = jwt.verify(token, process.env.EMAIL_SECRET!);


        const existingUser = await User.findOne({ email:decoded.email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        existingUser.email_verified = true;
        if(existingUser.role!=='university') existingUser.is_active = true;
        await existingUser.save()

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY!
        );

        // Store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingUser);
    }
);

export { router as confirmationRouter };
