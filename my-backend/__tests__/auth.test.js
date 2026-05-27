// __tests__/auth.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
// ↑ we need to export app from server.js

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@devconnect.com',
    password: 'password123',
    role: 'user',
};

let authToken = '';
// Store token between tests

// ─── Connect to test DB before tests ───
beforeAll(async () => {
    await mongoose.connect(
        process.env.MONGO_URI_TEST ??
        'mongodb://localhost:27017/devconnect_test'
    );

    // Clean up left-over data from previous failed runs
    await mongoose.connection.db
        .collection('users')
        .deleteMany({ email: testUser.email });
});

// ─── Clean up after each test ───
afterEach(async () => {
    // Delete test users to keep DB clean
    await mongoose.connection.db
        .collection('users')
        .deleteMany({ email: testUser.email });
});

afterAll(async () => {
    // Close connection to allow Jest to exit
    await mongoose.connection.close();
});


// ════════════════════════════════════════
// REGISTER TESTS
// ════════════════════════════════════════
describe('POST /api/auth/register', () => {

    test('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe(testUser.email);
        expect(res.body.user.password).toBeUndefined();
        // ↑ password must NEVER be in response
    });

    test('should fail with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test' });
        // missing email and password

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBeDefined();
    });

    test('should fail with duplicate email', async () => {
        // Register first time
        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        // Register second time with same email
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('already');
    });

    test('should fail with invalid email format', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...testUser, email: 'notanemail' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});


// ════════════════════════════════════════
// LOGIN TESTS
// ════════════════════════════════════════
describe('POST /api/auth/login', () => {

    // Register user before login tests
    beforeEach(async () => {
        await request(app)
            .post('/api/auth/register')
            .send(testUser);
    });

    test('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        // Save token for use in other tests
        authToken = res.body.token;
    });

    test('should fail with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword',
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('should fail with wrong email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrong@email.com',
                password: testUser.password,
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('should fail with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email });
        // missing password

        expect(res.status).toBe(400);
    });
});


// ════════════════════════════════════════
// PROTECTED ROUTE TESTS
// ════════════════════════════════════════
describe('GET /api/auth/me', () => {

    beforeEach(async () => {
        // Register and login to get token
        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        authToken = res.body.token;
    });

    test('should return current user with valid token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${authToken}`);
        // ↑ set auth header

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(testUser.email);
        expect(res.body.data.password).toBeUndefined();
    });

    test('should fail with no token', async () => {
        const res = await request(app)
            .get('/api/auth/me');
        // no Authorization header

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('should fail with invalid token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer faketoken123');

        expect(res.status).toBe(401);
    });
});