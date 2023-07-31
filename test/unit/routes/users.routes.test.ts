import request from 'supertest';
import app from '../../../src/app';
import { Users } from '../../../src/model/users.model';

beforeAll(async () => {
    try {
        await Users.drop();
    } catch (error) {}
});

describe('GET /api/users', () => {
    it('responds with an array of users', async () =>
        request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response: any) => {
                expect(response.body).toHaveProperty('length');
                expect(response.body.length).toBe(0);
            }));
});

let id = '';
describe('POST /api/users', () => {
    it('responds with an error if the user is invalid', async () =>
        request(app)
            .post('/api/users')
            .set('Accept', 'application/json')
            .send({
                username: ''
            })
            .expect('Content-Type', /json/)
            .expect(422)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            }));
    it('responds with an inserted object', async () =>
        request(app)
            .post('/api/users')
            .set('Accept', 'application/json')
            .send({
                username: 'jsmith',
                first_name: 'John',
                last_name: 'Smith'
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toHaveProperty('_id');
                id = response.body._id;
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe('jsmith');
                expect(response.body).toHaveProperty('first_name');
                expect(response.body.first_name).toBe('John');
                expect(response.body).toHaveProperty('last_name');
                expect(response.body.last_name).toBe('Smith');
            }));
});

describe('GET /api/users/:id', () => {
    it('responds with a single user', async () =>
        request(app)
            .get(`/api/users/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe('jsmith');
                expect(response.body).toHaveProperty('first_name');
                expect(response.body.first_name).toBe('John');
                expect(response.body).toHaveProperty('last_name');
                expect(response.body.last_name).toBe('Smith');
            }));
    it('responds with an invalid ObjectId error', (done) => {
        request(app).get('/api/users/adsfadsfasdfasdf').set('Accept', 'application/json').expect('Content-Type', /json/).expect(422, done);
    });
    it('responds with a not found error', (done) => {
        request(app).get('/api/users/6306d061477bdb46f9c57fa4').set('Accept', 'application/json').expect('Content-Type', /json/).expect(404, done);
    });
});

describe('PUT /api/users/:id', () => {
    it('responds with an invalid ObjectId error', (done) => {
        request(app).put('/api/users/adsfadsfasdfasdf').set('Accept', 'application/json').expect('Content-Type', /json/).expect(422, done);
    });
    it('responds with a user not found error', (done) => {
        request(app)
            .put('/api/users/6306d061477bdb46f9c57fa4')
            .set('Accept', 'application/json')
            .send({
                username: 'John',
                first_name: 'Doe'
            })
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('responds with a single user', async () =>
        request(app)
            .put(`/api/users/${id}`)
            .set('Accept', 'application/json')
            .send({
                first_name: 'John',
                last_name: 'Doe'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('_id');
                id = response.body._id;
                 expect(response.body).toHaveProperty('username');
                 expect(response.body.username).toBe('jsmith');
                 expect(response.body).toHaveProperty('first_name');
                 expect(response.body.first_name).toBe('John');
                 expect(response.body).toHaveProperty('last_name');
                 expect(response.body.last_name).toBe('Doe');
            }));
});

describe('DELETE /api/users/:id', () => {
    it('responds with an invalid ObjectId error', (done) => {
        request(app).delete('/api/users/adsfadsfasdfasdf').set('Accept', 'application/json').expect('Content-Type', /json/).expect(422, done);
    });
    it('responds with a not found error', (done) => {
        request(app).delete('/api/users/6306d061477bdb46f9c57fa4').set('Accept', 'application/json').expect('Content-Type', /json/).expect(404, done);
    });
    it('responds with a 204 status code', (done) => {
        request(app).delete(`/api/users/${id}`).expect(204, done);
    });
    it('responds with a not found error', (done) => {
        request(app).get(`/api/users/${id}`).set('Accept', 'application/json').expect(404, done);
    });
});
