const request = require("supertest");
const app = require("../app");

let id;
let token;

beforeAll(async () => {
  const credentials = {
    email: "prueba.test@gmail.com",
    password: "321123",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("GET /reviews It must getAll the reviews", async () => {
  const res = await request(app)
    .get("/reviews")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /reviews It must create reviews", async () => {
  const newReviews = {
    rating: '3.8',
    comment: "este es una review prueba",
  };
  const res = await request(app)
    .post("/reviews")
    .send(newReviews)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.rating).toBe(newReviews.rating);
});

test("PUT /reviews/:id It must upDate reviews", async () => {
  const reviewUpdate = {
    rating: '4'
  };
  const res = await request(app)
    .put(`/reviews/${id}`)
    .send(reviewUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.rating).toBe(reviewUpdate.rating);
});

test("DELETE /reviews/:id It must delete reviews", async () => {
  const res = await request(app)
    .delete(`/reviews/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
