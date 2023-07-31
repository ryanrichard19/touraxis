import request from 'supertest';
import app from '../../../src/app';
import { Users } from '../../../src/model/users.model';
import { Tasks } from '../../../src/model/tasks.model';

beforeAll(async () => {
    try {
        await Users.drop();
        await Tasks.drop();
    } catch (error) {}
});

let User_id = '';
describe('POST /api/users', () => {
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
                User_id = response.body._id;
            }));
});

describe('GET /api/users/:user_id/tasks', () => {
    it('responds with an array of tasks', async () =>
        request(app)
            .get(`/api/users/${User_id}/tasks`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response: any) => {
                expect(response.body).toHaveProperty('length');
                expect(response.body.length).toBe(0);
            }));
});

let id = '';
describe('POST /api/users/:user_id/tasks', () => {
    it('responds with an error if the user is invalid', async () =>
        request(app)
            .post(`/api/users/xxxx/tasks`)
            .set('Accept', 'application/json')
            .send({
                name: 'My task',
                description: 'Description of task',
                date_time: '2016-05-25T14:25:00'
            })
            .expect('Content-Type', /json/)
            .expect(422)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            }));
    it('responds with an inserted object', async () =>
        request(app)
            .post(`/api/users/${User_id}/tasks`)
            .set('Accept', 'application/json')
            .send({
                name: 'My task',
                description: 'Description of task',
                date_time: '2016-05-25T14:25:00'
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toHaveProperty('_id');
                id = response.body._id;
                expect(response.body).toHaveProperty('name');
                expect(response.body.name).toBe('My task');
                expect(response.body).toHaveProperty('description');
                expect(response.body.description).toBe('Description of task');
                expect(response.body).toHaveProperty('date_time');
                expect(response.body.date_time).toBe('2016-05-25T12:25:00.000Z');
                expect(response.body).toHaveProperty('status');
                expect(response.body.status).toBe('pending');
            }));
});

describe('GET /api/users/:user_id/tasks:id', () => {
    it('responds with a single user', async () =>
        request(app)
            .get(`/api/users/${User_id}/tasks/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('_id');
                expect(response.body._id).toBe(id);
                expect(response.body).toHaveProperty('name');
                expect(response.body.name).toBe('My task');
                expect(response.body).toHaveProperty('description');
                expect(response.body.description).toBe('Description of task');
                expect(response.body).toHaveProperty('date_time');
                expect(response.body.date_time).toBe('2016-05-25T12:25:00.000Z');
                expect(response.body).toHaveProperty('status');
                expect(response.body.status).toBe('pending');
            }));
    it('responds with an invalid ObjectId error', (done) => {
        request(app).get(`/api/users/${User_id}/tasks/adsfadsfasdfasdf`).set('Accept', 'application/json').expect('Content-Type', /json/).expect(422, done);
    });
    it('responds with a not found error', (done) => {
        request(app).get(`/api/users/${User_id}/tasks/6306d061477bdb46f9c57fa4`).set('Accept', 'application/json').expect('Content-Type', /json/).expect(404, done);
    });
});

describe('PUT /api/users/:user_id/tasks:id', () => {
    it('responds with an invalid ObjectId error', (done) => {
        request(app).put('/api/users/adsfadsfasdfasdf').set('Accept', 'application/json').expect('Content-Type', /json/).expect(422, done);
    });
    it('responds with a not found error', (done) => {
        request(app)
            .put(`/api/users/${User_id}/tasks/6306d061477bdb46f9c57fa4`)
            .set('Accept', 'application/json')
            .send({
                name: 'My updated task'
            })
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('responds with a single task', async () =>
        request(app)
            .put(`/api/users/${User_id}/tasks/${id}`)
            .set('Accept', 'application/json')
            .send({
                name: 'My updated task'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('_id');
                id = response.body._id;
                expect(response.body).toHaveProperty('name');
                expect(response.body.name).toBe('My updated task');
                expect(response.body).toHaveProperty('description');
                expect(response.body.description).toBe('Description of task');
                expect(response.body).toHaveProperty('date_time');
                expect(response.body.date_time).toBe('2016-05-25T12:25:00.000Z');
                expect(response.body).toHaveProperty('status');
                expect(response.body.status).toBe('pending');
            }));
});

describe('DELETE /api/users/:user_id/tasks:id', () => {
    it('responds with an invalid ObjectId error', (done) => {
        request(app).delete(`/api/users/${User_id}/tasks/adsfadsfasdfasdf`).set('Accept', 'application/json').expect('Content-Type', /json/).expect(422, done);
    });
    it('responds with a not found error', (done) => {
        request(app).delete(`/api/users/${User_id}/tasks/6306d061477bdb46f9c57fa4`).set('Accept', 'application/json').expect('Content-Type', /json/).expect(404, done);
    });
    it('responds with a 204 status code', (done) => {
        request(app).delete(`/api/users/${User_id}/tasks/${id}`).expect(204, done);
    });
    it('responds with a not found error', (done) => {
        request(app).get(`/api/users/${User_id}/tasks/${id}`).set('Accept', 'application/json').expect(404, done);
    });
});
