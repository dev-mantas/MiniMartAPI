import request from "supertest"
import app from '../app'


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
                email: 'mantanascode@gmail.com',
                first_name: "Mantas",
                last_name: 'Klymantas',
                password: "Test123!"
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.message).toEqual('ACCOUNT_CREATED')
        })
    }
    )
})
