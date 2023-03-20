import { Request, Response } from 'express'
import userSchema from '../../schemas/user.schema'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()



export async function registerUser (req: Request, res: Response) {
    const { email, first_name, last_name } = req.body
    let hashedPassword;
    if(req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 8)     
    }

    try {
        const result = await userSchema.create({
            email: email,           first_name: first_name,
            last_name: last_name,   password: hashedPassword,
            account_created: new Date()
        })
        .then(async (data) => {
            const key = String(process.env.SECRET_KEY)
            const token = jwt.sign({ email: data.email }, key, { expiresIn: '1h'})
            const emailData = {
                email: data.email,
                first_name: data.first_name,
                token: token
            }
            // #TODO
            // Send email here
            return res.status(200).send('ACCOUNT_CREATED')
        })
    } catch(error) {
        throw res.status(400).send(error)
    }
}