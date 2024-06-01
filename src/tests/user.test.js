const request = require("supertest");
const app = require("../app");

let id;
let token;

test("POST /users It must create users", async () => {
  const newUser = {
    firstName: "test",
    lastName: "Prueba",
    email: "prueba@gmail.com",
    password: "321123",
    gender: "female",
  };
  const res = await request(app).post("/users")
    .send(newUser);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.firstName).toBe(newUser.firstName);
});

test('POST /user/login It must credentials correct', async () => {
  const credentials = {
    email: "prueba@gmail.com",
    password: "321123"
  }
  const res = await request(app).post('/users/login')
    .send(credentials)
  token = res.body.token
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
  expect(res.body.user.email).toBe(credentials.email);
});

test('POST /user/login It must credentials not correct', async () => {
  const credentials = {
    email: "incorrecto@gmail.com",
    password: "incorrecto"
  }
  const res = await request(app).post('/users/login')
    .send(credentials)
  expect(res.status).toBe(401);
});

test("GET /users It must getAll the users", async () => {
  const res = await request(app)
    .get("/users")
    .set('Authorization', `Bearer ${token}`)
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("PUT /users/:id It must upDate users", async () => {
  const userUpdate = {
    firstName: "testUpdate",
  };
  const res = await request(app)
    .put(`/users/${id}`).send(userUpdate)
    .set('Authorization', `Bearer ${token}`)
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(userUpdate.firstName);
});

test("DELETE /users/:id It must delete users", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
  expect(res.status).toBe(204);
});
