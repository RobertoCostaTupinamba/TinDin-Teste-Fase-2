import request from 'supertest';

import mongoose from 'mongoose';

import { app } from '../../src/app';

describe('User', () => {
  beforeAll(async () => {
    const dbUser = process.env.DB_USER || '';
    const dbPassword = process.env.DB_PASS || '';
    const dbName = process.env.NODE_ENV === 'development' ? 'TinDin' : 'TinDinTeste';

    await mongoose
      .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.1bwnn.mongodb.net/${dbName}?retryWrites=true&w=majority`)
      .then(() => console.log('test db connected'))
      .catch((err) => {
        console.log(err);
      });
  });

  it('deve retornar um usuário autenticado', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        email: 'robertotupinamba@gmail.com',
        password: '11111111',
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('deve retornar um erro ao tentar autenticar pois senha está invalida', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        email: 'robertotupinamba@gmail.com',
        password: 'asdasdsad',
      })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('deve retornar um erro ao tentar autenticar pois email esta invalido', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        email: 'robertotupinamba@gmail.comm',
        password: '11111111',
      })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('devera avisar que tem campos faltando', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send()
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  afterAll((done) => {
    mongoose.connection.close(() => done());
  });
});
