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

test("GET /bookings It must bring getall the bookings", async () => {
  const res = await request(app)
    .get("/bookings")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /bookings It must create booking", async () => {
  const newBooking = {
    checkIn: "2024-05-30",
    checkOut: "2024-06-28"
  };
  const res = await request(app)
  .post("/bookings")
  .send(newBooking)
  .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.checkIn).toBe(newBooking.checkIn);
});

test("PUT /bookings/:id It must update bookings", async () => {
  const bookingUpdate = {
    checkIn: "2024-05-30",
    checkOut: "2024-06-30"
  };
  const res = await request(app)
    .put(`/bookings/${id}`)
    .send(bookingUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.checkIn).toBe(bookingUpdate.checkIn);
});

test("DELETE /bookings/:id It must delete booking", async () => {
  const res = await request(app)
    .delete(`/bookings/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
