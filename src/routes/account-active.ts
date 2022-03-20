import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, NotAuthorizedError } from '@cygnetops/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
    '/api/users/account-active',
    async (req: Request, res: Response) => {

        const {id, status} = req.body;
        if (!req.session!.jwt){
                throw new NotAuthorizedError();
        }
        let decoded:any = jwt.verify(req.session!.jwt, process.env.JWT_KEY!);
        const reqUser = await User.findById(decoded.id);

        if (reqUser!.role!=='admin') {
                throw new NotAuthorizedError();
        }


        const existingUser = await User.findById( id);
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        console.log(req.session!.jwt);
        console.log(existingUser);

        existingUser.is_active = status;
        await existingUser.save()


        res.status(200).send(existingUser);
    }
);

export { router as AccountActiveRouter };
