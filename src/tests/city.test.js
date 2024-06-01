const request = require("supertest");
const app = require("../app");

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

test("GET /cities It must getAll the cities", async () => {
  const res = await request(app).get("/cities");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /cities It must create cities", async () => {
  const newCity = {
    name: "test",
    country: "tests",
    countryId: "ts",
  };
  const res = await request(app)
    .post("/cities")
    .send(newCity)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(newCity.name);
});

test("PUT /cities/:id It must upadte cities", async () => {
  const cityUpdate = {
    name: "testUpdate",
  };
  const res = await request(app)
    .put(`/cities/${id}`)
    .send(cityUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(cityUpdate.name);
});

test("DELETE /cities/:id It must delete cities", async () => {
  const res = await request(app)
    .delete(`/cities/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
