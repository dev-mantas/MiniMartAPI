import mongoose, { Types } from 'mongoose'
import type { User } from '../index'

const userSchema = new mongoose.Schema<User>({
    email: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true},
    account_created: {type: Date, required: true},
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    account_confirmed: {type: Boolean, default: false}
})

export default mongoose.model('users', userSchema)