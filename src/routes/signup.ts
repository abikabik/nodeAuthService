import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@cygnetops/common';
import {sendVerificationEmail} from "../utils/email";

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, first_name, last_name, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password, first_name, last_name, phone });

    const verificationToken = jwt.sign(
        {
          email:user.email
        },
        process.env.EMAIL_SECRET!
    )
    await sendVerificationEmail(user, verificationToken);
    await user.save();

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

    res.status(201).send(user);
  }
);

export { router as signupRouter };
