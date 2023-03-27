import express from 'express'
import { awaitHandler } from '../middlewares/awaitHandler.middleware'
import { loginUser, registerUser, getCurrentUser} from '../services/user/user.services'
import { createProduct, listPublicProducts } from '../services/product/product.services'
export const user_routes = express.Router()
import {auth} from '../middlewares/auth.middleware'


// Create new account
user_routes.post('/register', awaitHandler(registerUser))
// Login to account
user_routes.post('/login', awaitHandler(loginUser))
// Auth currentuser
user_routes.get('/authCheck', auth('Admin'), awaitHandler(getCurrentUser))
// Create new product
user_routes.post('/createProduct', auth('Admin'), awaitHandler(createProduct))
// Get products for reel
user_routes.get('/getProductReel', auth('Admin'), awaitHandler(listPublicProducts))