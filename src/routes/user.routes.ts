import express from 'express'
import { awaitHandler } from '../middlewares/awaitHandler.middleware'
import { loginUser, registerUser } from '../services/user/user.services'
import { createProduct } from '../services/product/product.services'
export const user_routes = express.Router()
import {auth} from '../middlewares/auth.middleware'


// Create new account
user_routes.post('/register', awaitHandler(registerUser))
// Login to account
user_routes.post('/login', awaitHandler(loginUser))
// Create new product
user_routes.post('/createProduct', auth('Admin'), awaitHandler(createProduct))