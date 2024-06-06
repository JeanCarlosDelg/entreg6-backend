const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailCode = require("../models/EmailCode");
const sendEmail = require("../utils/sendEmail");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { firstName, lastName, email, password, gender, frontBaseUrl } =
    req.body;
  const passwordEncripted = await bcrypt.hash(password, 10);
  const result = await User.create({
    firstName,
    lastName,
    email,
    password: passwordEncripted,
    gender,
  });

  const code = require("crypto").randomBytes(32).toString("hex");
  const link = `${frontBaseUrl}/${code}`;

  await EmailCode.create({
    code: code,
    userId: result.id,
  });

  await sendEmail({
    to: email,
    subject: "Verify your account in the Booking-App",
    html: `
    <h1>Hello, ${firstName} ${lastName}</h1>
    <h3>Thanks for sign up in user app</h3>
    <p>To verify your email, click on the following link:</p>
    <a href="${link}">${link}</a>
    `,
  });

  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, gender } = req.body;
  const result = await User.update(
    { firstName, lastName, email, gender },
    { where: { id }, returning: true }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const verifyCode = catchError(async (req, res) => {
  const { code } = req.params;
  const emailCode = await EmailCode.findOne({ where: { code } });
  if (!emailCode) return res.status(401).json({ message: "Invalid code" });

  const user = await User.findByPk(emailCode.userId);
  user.isVerified = true;
  await user.save();

  await emailCode.destroy();

  return res.json(user);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: " Invalid credentials" });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
  return res.status(401).json({ message: " Invalid credentials" });
  if (!user.isVerified) return res.status(403).json({ message: "User not verified" });

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ user, token });
});

const resetPassword = catchError(async (req, res) => {
  const { email, frontBaseUrl } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "User not found" });
  const code = require("crypto").randomBytes(32).toString("hex");
  const link = `${frontBaseUrl}/${code}`;

  await EmailCode.create({
    code: code,
    userId: user.id,
  });

  await sendEmail({
    to: email,
    subject: "Update your password",
    html: `
    <h1>Hello, ${user.firstName} ${user.lastName}</h1>
    <h3>Thanks for sign up in user app</h3>
    <p>To verify your email, click on the following link:</p>
    <a href="${link}">${link}</a>
    `,
  });

  return res.status(201).json({code, message: "Check your email and follow the instructions" });
});

const updatePassword = catchError(async (req, res) => {
  const { code } = req.params;
  const { password } = req.body;
  const emailCode = await EmailCode.findOne({ where: { code } });
  if (!emailCode) return res.status(401).json({ message: "Invalid code" });

  const encriptedPassword = await bcrypt.hash(password, 10);
  // const user = await User.findByPk(emailCode.userId)
  // user.password = encriptedPassword
  // await user.save()
  const user = await User.update(
    { password: encriptedPassword },
    { where: { id: emailCode.userId }, returning: true }
  );

  await emailCode.destroy();

  return res.json(user[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  verifyCode,
  login,
  resetPassword,
  updatePassword
};
