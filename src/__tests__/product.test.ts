import request from "supertest"
import app from '../app'
import { v1 as uuidv1 } from 'uuid';

describe("POST /api/createProduct", () => {
    describe('Missing field should return 400 status code', () => {
        test("Should respond with 400.", async () => {
            const response = await request(app).post('/api/register').send({
                name: "Test Product",
                active: false,
                description: 'This is a test product!',
                images: ['https://google.com'],
                shippable: true,
                url: 'https://youtube.com'
            })
            expect(response.statusCode).toBe(400)
        })
    })
    describe('Sucessfully created product', () => {
        test("Should respond with 200.", async () => {
            const response = await request(app).post('/api/register').send({
                name: "Test Product",
                active: false,
                description: 'This is a test product!',
                metadata: {
                    uuid: 'TESTPRODUCT'
                },
                images: ['https://google.com'],
                shippable: true,
                url: 'https://youtube.com'
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.message).toEqual('PRODUCT_CREATED')
        })
    })
})