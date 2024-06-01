const app = require('../app');
const request = require('supertest');
const path = require('path');
const upload = require('../utils/multer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

let token;
let id;
const file = { path: './testFiles/testMan.jpeg', filename: 'testMan.jpeg' };
const imageUrl = 'https://url.com';

jest.mock('../utils/cloudinary', () => ({
  uploadToCloudinary: jest.fn().mockImplementation(() => ({
    url: imageUrl,
  })),
  deleteFromCloudinary: jest.fn(),
}));

jest.mock('../utils/multer', () => ({
  single: jest.fn(() => (req, res, next) => {
    req.file = file;
    next();
  }),
}));

beforeAll(async () => {
  const credentials = {
    email: 'prueba.test@gmail.com',
    password: '321123'
  };
  const res = await request(app).post('/users/login')
    .send(credentials);
  token = res.body.token;
});

test('GET /images It must getall the images', async () => {
  const res = await request(app)
    .get('/images')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test('POST /images It must create images', async () => {
  const res = await request(app)
    .post('/images')
    .set('Authorization', `Bearer ${token}`)
    .attach('image', path.resolve(__dirname, file.path));
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(upload.single).toHaveBeenCalled();
  expect(uploadToCloudinary).toHaveBeenCalledWith(file);
});

test('DELETE /images/:id It must delete images', async () => {
  const res = await request(app)
    .delete(`/images/${id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
  expect(deleteFromCloudinary).toHaveBeenCalledWith(imageUrl);
});
