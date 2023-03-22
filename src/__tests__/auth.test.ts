import request from "supertest"
import app from '../app'
import { v1 as uuidv1 } from 'uuid';

describe("POST /api/register", () => {
    describe('Missing field should return 400 status code', () => {
        test("Should respond with 400.", async () => {
            const response = await request(app).post('/api/register').send({
                first_name: "Mantas",
                last_name: 'Klymantas',
                password: "Test123!"                
            })
            expect(response.statusCode).toBe(400)
        })
    })
    describe("All values successfully validated.", () => {
        test("Should respond with status 200.", async () => {
            const response = await request(app).post("/api/register").send({
                email: uuidv1() + '@gmail.com',
                first_name: "Mantas",
                last_name: 'Klymantas',
                password: "Test123!"
            })
            expect(response.statusCode).toBe(201)
            expect(response.body.message).toEqual('ACCOUNT_CREATED')
        })
    }
    )
    describe("Duplicate account.", () => {
        test("Should respond with status 400.", async () => {
            const response = await request(app).post("/api/register").send({
                email: 'mantanascode@gmail.com',
                first_name: "Mantas",
                last_name: 'Klymantas',
                password: "Test123!"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toEqual('DUPLICATE_ACCOUNT')
        })
    }
    )
})


describe("POST /api/login", () => {
    describe('Missing fields', () => {
        test("Should respond with 400", async() => {
            const response = await request(app).post('/api/login').send({
                email: 'mantanascode@gmail.com',
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toEqual('MISSING_FIELDS')
        })
    })
    describe('Correct details', () => {
        test("Should respond with 200", async() => {
            const response = await request(app).post('/api/login').send({
                email: 'mantanascode@gmail.com',
                password: 'Test123!'
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.token)
            expect(response.body.role)
        })
    })
    describe('Incorrect details', () => {
        test("Should respond with 400", async() => {
            const response = await request(app).post('/api/login').send({
                email: 'mantanascode@gmail.com',
                password: 'Test123'
            })
            expect(response.statusCode).toBe(403)
            expect(response.body.message).toEqual('LOGIN_FAILED')
        })
    })
})