import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import type { Roles, CurrentUserObject } from '../index'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import {Types} from 'mongoose'
import userSchema from '../schemas/user.schema'
dotenv.config()

export interface decodedToken extends JwtPayload {
    _id: string
}

export const auth = (role: Roles) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            console.log(role)
            const authHeader = req.headers.authorization
            const bearer = 'Bearer '

            if(!authHeader || !authHeader.startsWith(bearer)) {
                throw res.status(400).send('MISSING_AUTH_TOKEN')
            }

            const token = authHeader.replace(bearer, '')
            const secretKey: Secret = String(process.env.SECRET_KEY)

            // decoded types might need some work
            const decoded = jwt.verify(token, secretKey)
            console.log(decoded)
            if (typeof decoded === 'string') {   

                throw new Error(decoded)
            }
            
            const decodedToken: decodedToken = {...decoded, _id: decoded.userId }
            const user = await userSchema.findOne({ _id: new Types.ObjectId(decodedToken._id) }).select('-__v').lean()
            if(!user) {
                throw res.status(400).send('UNAUTHORIZED')
            }

            if(!role?.includes(user.role)) {
                throw res.status(400).send('UNAUTHORIZED')
            }

            const {password, ...currentUserObject} = user
            req.currentUser = currentUserObject         
            next()
        } catch(error: unknown) {
            next(error)
        }
    }
}