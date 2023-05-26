const supertest = require('supertest');
const chai = require('chai');
const app = require('./categories.service.js');
const expect = chai.expect;

describe('Categories', () => {
    it('should GET all categories', (done) => {
        supertest(app)
            .get('/categories')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should GET a category by ID', (done) => {
        supertest(app)
            .get('/categories/1')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name');
                done();
            });
    });

    it('should POST a new category', (done) => {
        const category = { name: 'Test Category' };
        supertest(app)
            .post('/categories')
            .send(category)
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name');
                done();
            });
    });

    it('should PUT an existing category', (done) => {
        const category = { name: 'Updated Category' };
        supertest(app)
            .put('/categories/1')
            .send(category)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name');
                done();
            });
    });

    it('should DELETE a category', (done) => {
        supertest(app)
            .delete('/categories/1')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
    });
});
