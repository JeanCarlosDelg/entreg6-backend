const request = require('supertest');
const app = require('../app');

let id;
let token;

beforeAll(async () => {
  const credentials = {
    email: "prueba.test@gmail.com",
    password: "321123"
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test('GET /hotels It must getAll the hotels', async () => {
  const res = await request(app).get('/hotels');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test('POST /hotels It must create hotels', async () => {
  const newHotel = {
    name: "test",
    description: 'test description',
    price: 1.000,
    address: "50 Central Park South, New York, NY 10019, USA",
    lat: 40.765380,
    lon: -73.974560
  };
  const res = await request(app)
    .post('/hotels')
    .send(newHotel)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(newHotel.name);
});

test('PUT /hotels/:id It must upDate hotels', async () => {
  const hotelUpdate = {
    name: 'testUpdate',
  };
  const res = await request(app)
    .put(`/hotels/${id}`)
    .send(hotelUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(hotelUpdate.name);
  });

test('DELETE /hotels/:id It must delete hotels', async () => {
  const res = await request(app)
    .delete(`/hotels/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
