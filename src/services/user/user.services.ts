import { Request, Response } from 'express'
import userSchema from '../../schemas/user.schema'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()



export async function registerUser (req: Request, res: Response) {
    const { email, first_name, last_name } = req.body
    if(!email || !first_name || !last_name || !req.body.password) return res.status(400).send('MISSING_FIELDS')
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
            console.log('1')
            return res.status(201).send({message: 'ACCOUNT_CREATED'})
        })
    } catch(error: any) {
        if(error.code === 11000) {
            console.log('2')

            throw res.status(400).send({message: 'DUPLICATE_ACCOUNT'})
        }
        console.log('3')

        console.log(error)
        throw res.status(400).send(error)
    }
}

export async function loginUser (req: Request, res: Response) {
    const { email, password} = req.body
    if(!email || !password) return res.status(400).send({message:'MISSING_FIELDS'})
    try {
        const user = await userSchema.findOne({
            email: email,
        })
        .select("-__v")
        .lean()
        .then(async (data)=> {
            const comparePass = await bcrypt.compare(password, data.password)
            if(!comparePass) {
                return res.status(403).send({message: 'LOGIN_FAILED'})
            }
            if(!data.account_confirmed) {
                const key = process.env.SECRET_KEY || ""
                const token = jwt.sign({ email: data.email }, key, { expiresIn: '15m'})
                const emailData = {
                    email: data.email,
                    first_name: data.first_name,
                    token: token
                }
                // const sendToken = 
                return res.status(200).send('ACCOUNT_VERIFICATION_INCOMPLETE')
            }
            const key = process.env.SECRET_KEY || ""
            const token = jwt.sign({ userId: data._id }, key, {expiresIn: '24h'})
            return res.status(200).send({ token: token, role: data.role})
        })
    } catch(error) {
        throw res.status(400).send('LOGIN_FAILED')
    }
}