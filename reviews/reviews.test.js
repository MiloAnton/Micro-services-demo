const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./reviews.service.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reviews Service', () => {
  describe('GET /reviews', () => {
    it('should get all reviews', (done) => {
      chai.request(app)
        .get('/reviews')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /reviews/:id', () => {
    it('should get a single review', (done) => {
      const id = 1;
      chai.request(app)
        .get(`/reviews/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('POST /reviews', () => {
    it('should post a new review', (done) => {
      const review = {
        bookId: 1,
        userId: 1,
        rating: 5,
        comment: 'Test review'
      };
      chai.request(app)
        .post('/reviews')
        .send(review)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('PUT /reviews/:id', () => {
    it('should update a review', (done) => {
      const id = 1;
      const review = {
        bookId: 1,
        userId: 1,
        rating: 4,
        comment: 'Updated test review'
      };
      chai.request(app)
        .put(`/reviews/${id}`)
        .send(review)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should delete a review', (done) => {
      const id = 1;
      chai.request(app)
        .delete(`/reviews/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('GET /reviews/book/:bookId', () => {
    it('should get all reviews for a specific book', (done) => {
      const bookId = 1;
      chai.request(app)
        .get(`/reviews/book/${bookId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /reviews/rating/:rating', () => {
    it('should get all reviews with a specific rating', (done) => {
      const rating = 5;
      chai.request(app)
        .get(`/reviews/rating/${rating}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /reviews/user/:userId', () => {
    it('should get all reviews from a specific user', (done) => {
      const userId = 1;
      chai.request(app)
        .get(`/reviews/user/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});