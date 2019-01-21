import 'cross-fetch/polyfill';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../src/prisma';

export const userOne = {
  input: {
    name: 'Jen',
    email: 'jen0@example.com',
    password: bcrypt.hashSync('Password12345'),
  },
  user: undefined,
  jwt: undefined,
};

export const userTwo = {
  input: {
    name: 'John',
    email: 'john0@example.com',
    password: bcrypt.hashSync('johnspw1298'),
  },
  user: undefined,
  jwt: undefined,
};

export const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.AUTH_SECRET);
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.AUTH_SECRET);
};
