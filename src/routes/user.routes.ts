import express from 'express'
import { awaitHandler } from '../middlewares/awaitHandler.middleware'
import { registerUser } from '../services/user/user.services'
export const user_routes = express.Router()
import {auth} from '../middlewares/auth.middleware'

user_routes.post('/register', awaitHandler(registerUser))