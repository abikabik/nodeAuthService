const nodemailer = require('nodemailer');
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
});


let sendVerificationEmail = (user: any, token: String) => {
    const activationUrl = `http://localhost:3000/confirmation?token=${token}`;

    let mailOptions = {
        from: process.env.EMAIL_HOST_USER,
        to:user.email,
        subject: `Активация аккаунта`,
        html: `<td style="padding-top:60px;padding-bottom:0px">
    <table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" width="100%;" style="max-width:600px;margin:0 auto;background-color:#ffffff">
        <tbody>
        <tr>
            <td style="max-width:600px;padding:10px 30px 0;text-align:left;font-family:'Roboto', sans-serif;color:#000;font-weight:normal;font-size:15px;line-height:1.4;border-bottom:none">
                <div>
                    <br>
                    <div style="text-align:right">
                        <a href="https://univero.cc" target="_blank" data-saferedirecturl="">
                            <img src="https://univero.cc/_nuxt/img/logo.ff9cdea.png" style="border:0">
                        </a>
                    </div>
                    <br><br>
                    <div style="font-size:26px;line-height:1.3">Подтвердите свою электронную почту на Univero</div>
                    <br>
                    Нажмите на кнопку ниже для подтверждения электронной почты и активации аккаунта 
                    <br>
                    <br>
                    <a style="display:table-cell;text-decoration:none;padding:15px 30px;font-size:15px;text-align:center;font-weight:bold;font-family:'Roboto', sans-serif;width:100%;color:#ffffff;border:0px solid;background-color:#0089E9;border-radius:5px" href="${activationUrl}" target="_blank" data-saferedirecturl="">Подтвердить</a>
                    <br>
                    <br>
                    <span style="color:#777;font-size:13px">
                        Или вставьте эту ссылку в браузер: <a href="${activationUrl}" target="_blank" data-saferedirecturl="">${activationUrl}</a>
                        <br>
                        <br>
                        Если вы не регистрировались на univero, то просто проигнорируйте это письмо.
                    </span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="max-width:600px;padding:33px 0 0"></td>
        </tr>
        </tbody>
    </table>
</td>`,
    }

    transporter.sendMail(mailOptions, function (err: any, info: any){
        if (err){
            console.log(err)
        }
        else {
            console.log("Email sent")
        }
    })
}

let sendResetEmail = (user: any, token: String) => {
    const resetUrl = `http://localhost:3000/reset-pass?token=${token}`;

    let mailOptions = {
        from: process.env.EMAIL_HOST_USER,
        to:user.email,
        subject: `Активация аккаунта`,
        html: `
<td style="padding-top:60px;padding-bottom:0px">
    <table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" width="100%;" style="max-width:600px;margin:0 auto;background-color:#ffffff">
        <tbody>
        <tr>
            <td style="max-width:600px;padding:10px 30px 0;text-align:left;font-family:'Roboto', sans-serif;color:#000;font-weight:normal;font-size:15px;line-height:1.4;border-bottom:none">
                <div>
                    <br>
                    <div style="text-align:right">
                        <a href="https://univero.cc" target="_blank" data-saferedirecturl="">
                            <img src="https://univero.cc/_nuxt/img/logo.ff9cdea.png" style="border:0">
                        </a>
                    </div>
                    <br><br>
                    <div style="font-size:26px;line-height:1.3">Подтвердите смену пароля на Univero</div>
                    <br>
                    ${user.first_name}, Нажмите на кнопку ниже для cмены пароля
                    <br>
                    <br>
                    <a style="display:table-cell;text-decoration:none;padding:15px 30px;font-size:15px;text-align:center;font-weight:bold;font-family:'Roboto', sans-serif;width:100%;color:#ffffff;border:0px solid;background-color:#0089E9;border-radius:5px" href="${resetUrl}" target="_blank" data-saferedirecturl="">Подтвердить</a>
                    <br>
                    <br>
                    <span style="color:#777;font-size:13px">
                        Или вставьте эту ссылку в браузер: <a href="${resetUrl}" target="_blank" data-saferedirecturl="">${resetUrl}</a>
                        <br>
                        <br>
                        Если это были не вы, то просто проигнорируйте это письмо.
                    </span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="max-width:600px;padding:33px 0 0"></td>
        </tr>
        </tbody>
    </table>
</td>
`,
    }

    transporter.sendMail(mailOptions, function (err: any, info: any){
        if (err){
            console.log(err)
        }
        else {
            console.log("Email sent")
        }
    })
}

export {sendVerificationEmail, sendResetEmail}