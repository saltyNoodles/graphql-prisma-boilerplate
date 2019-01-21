import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import { seedDatabase, userOne } from './utils/seedDatabase';
import { createUser, getUsers, login, getProfile } from './utils/operations';
import { getClient } from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
  const variables = {
    data: { name: 'Derrick', email: 'derrick@example.com', password: 'thisIsaPassword!' },
  };

  const { data } = await client.mutate({
    mutation: createUser,
    variables,
  });

  const userExists = await prisma.exists.User({ id: data.createUser.user.id });
  expect(userExists).toBe(true);
});

test('Should expose public author profiles', async () => {
  const { data } = await client.query({ query: getUsers });

  expect(data.users.length).toBe(2);
  expect(data.users[0].email).toBe(null);
});

test('Should not login with bad credentials', async () => {
  const variables = {
    email: 'jen0@example.com',
    password: 'badpassword12345',
  };

  // Throws on bad password
  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('Should not create a new user with a short password', async () => {
  const variables = {
    data: {
      name: 'Derrick',
      email: 'derrick@example.com',
      password: '123',
    },
  };

  await expect(
    client.mutate({
      mutation: createUser,
      variables,
    }),
  ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const authenticatedClient = getClient(userOne.jwt);

  const { data } = await authenticatedClient.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
