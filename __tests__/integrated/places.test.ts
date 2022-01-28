import request from 'supertest';
import axios from 'axios';
import mongoose from 'mongoose';

import { UnsplashService } from '../../src/services/unsplashService';
import { app } from '../../src/app';

type typeplace = {
  _id: string;
  name: string;
  photo: string;
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Places', () => {
  let token: string;
  let place: typeplace;
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

    const req = await request(app).post('/login').send({
      email: 'robertotupinamba@gmail.com',
      password: '11111111',
    });

    token = req.body.token;
  });

  it('não conseguira pegar uma imagem', async () => {
    mockedAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          results: [],
        },
      });
    });

    const unsplash = new UnsplashService();

    const response = await unsplash.getCreateImage({ name: 'sadasdasd', userId: '61eb0cadd653b310c079abc0' });
    expect(response.status).toEqual(404);
  });

  it('deve encontrar no banco uma lugar já adicionado', async () => {
    const unsplash = new UnsplashService();

    const response = await unsplash.getCreateImage({ name: 'Mar', userId: '61eb0cadd653b310c079abc0' });
    expect(response.message).toEqual('Você já adicionou este lugar na lista');
  });

  it('deve conseguir criar um place', () => {
    mockedAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          results: [{ urls: { regular: 'test.png' } }],
        },
      });
    });

    request(app)
      .post('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: Math.random() * (10000 - 0) + 0 })
      .expect(200)
      .then((response) => {
        place = response.body;
      });
  });

  it('deve atualizar um place', (done) => {
    mockedAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          results: [{ urls: { regular: 'test.png' } }],
        },
      });
    });

    request(app)
      .put('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        _id: '61eb4128499b067f30e9a5bf',
        name: Math.random() * (10000 - 0) + 0,
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('não conseguira atualizar um place', (done) => {
    mockedAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          results: [],
        },
      });
    });

    request(app)
      .put('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'sadasdasd' })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('não conseguira atualizar uma imagem', (done) => {
    mockedAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          results: [],
        },
      });
    });

    request(app)
      .put('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'sadasdasd', _id: '61eb4128499b067f30e9a5bf' })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('deve pegar todos os places', (done) => {
    request(app)
      .get('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('deve pegar os places pelo id', (done) => {
    request(app)
      .get('/places/61eb3303d653b310c079abc1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('não deve encontrar um place pelo id', (done) => {
    request(app)
      .get('/places/61eb3303d653b310c079abc')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('deve excluir um place', (done) => {
    request(app)
      .delete(`/places/${place._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('não conseguirar acessar as rotas', (done) => {
    request(app)
      .delete(`/places/${place._id}`)
      .set('Accept', 'application/json')
      // .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('enviara um token invalido', (done) => {
    request(app)
      .delete(`/places/${place._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}asdas`)
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
  afterAll((done) => {
    mongoose.connection.close(() => done());
  });
});
