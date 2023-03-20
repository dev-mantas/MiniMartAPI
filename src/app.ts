process.env.TZ = 'UTC'
import express, { Request, Response } from "express"
import cors from "cors"
import bodyParser from 'body-parser'
import { user_routes } from './routes/user.routes'
import {connectDB} from './connections/mongo.connection'

connectDB()

const app = express()


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use('/api', user_routes)

export default app