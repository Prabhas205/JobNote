// __tests__/jobs.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';

let userToken = '';
let employerToken = '';
let companyId = '';
let jobId = '';

beforeAll(async () => {
    await mongoose.connect(
        process.env.MONGO_URI_TEST ??
        'mongodb://localhost:27017/devconnect_test'
    );

    // Clean up any left-over data from previous failed runs
    await mongoose.connection.db.collection('users').deleteMany({
        email: { $in: ['employer@test.com', 'user@test.com'] },
    });
    await mongoose.connection.db.collection('companies').deleteMany({
        name: 'Test Company',
    });
    await mongoose.connection.db.collection('jobposts').deleteMany({
        title: 'Test React Developer',
    });

    // Register employer
    const empRes = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test Employer',
            email: 'employer@test.com',
            password: 'pass123',
            role: 'employer',
        });
    employerToken = empRes.body.token;

    // Register user
    const userRes = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test User',
            email: 'user@test.com',
            password: 'pass123',
            role: 'user',
        });
    userToken = userRes.body.token;

    // Create company
    const compRes = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
            name: 'Test Company',
            description: 'A test company for testing',
            location: { city: 'Hyderabad' },
        });
    companyId = compRes.body.data?._id;
});

afterAll(async () => {
    // Clean up test data
    await mongoose.connection.db.collection('users').deleteMany({
        email: { $in: ['employer@test.com', 'user@test.com'] },
    });
    await mongoose.connection.db.collection('companies').deleteMany({
        name: 'Test Company',
    });
    await mongoose.connection.db.collection('jobposts').deleteMany({
        title: 'Test React Developer',
    });
    
    // Close connection to allow Jest to exit
    await mongoose.connection.close();
});


// ════════════════════════════════════════
// JOB CRUD TESTS
// ════════════════════════════════════════
describe('Job Routes', () => {

    // ─── GET all jobs — public ───
    test('GET /api/jobs — should return jobs array', async () => {
        const res = await request(app).get('/api/jobs');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('pages');
    });

    // ─── POST create job ───
    test('POST /api/jobs — employer can create job', async () => {
        const res = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${employerToken}`)
            .send({
                title: 'Test React Developer',
                description: 'We need a skilled React developer with experience',
                skills: ['React', 'JavaScript'],
                jobType: 'full-time',
                workMode: 'hybrid',
                experience: '2-5 years',
                location: 'Hyderabad',
                company: companyId,
                salary: { min: 600000, max: 1200000 },
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Test React Developer');

        jobId = res.body.data._id;
        // save for next tests
    });

    test('POST /api/jobs — user cannot create job', async () => {
        const res = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: 'Unauthorized Job',
                description: 'This should fail',
                company: companyId,
            });

        expect(res.status).toBe(403);
        // user role not allowed
    });

    test('POST /api/jobs — fails without auth', async () => {
        const res = await request(app)
            .post('/api/jobs')
            .send({ title: 'Test Job' });

        expect(res.status).toBe(401);
    });

    // ─── GET single job ───
    test('GET /api/jobs/:id — returns job details', async () => {
        if (!jobId) return;
        // skip if job creation failed

        const res = await request(app).get(`/api/jobs/${jobId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(jobId);
        expect(res.body.data.title).toBe('Test React Developer');
    });

    test('GET /api/jobs/:id — 404 for non-existent job', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/jobs/${fakeId}`);

        expect(res.status).toBe(404);
    });

    // ─── Apply to job ───
    test('POST /api/jobs/:id/apply — user can apply', async () => {
        if (!jobId) return;

        const res = await request(app)
            .post(`/api/jobs/${jobId}/apply`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                resumeUrl: 'https://example.com/resume.pdf',
                coverLetter: 'I am very interested in this position',
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('successfully');
    });

    test('POST /api/jobs/:id/apply — cannot apply twice', async () => {
        if (!jobId) return;

        // Apply again
        const res = await request(app)
            .post(`/api/jobs/${jobId}/apply`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ resumeUrl: 'https://example.com/resume.pdf' });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('already');
    });
});