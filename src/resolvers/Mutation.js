import bcrypt from 'bcryptjs';
import { getUserId, generateToken, hashPassword } from '../utils';

const Mutation = {
  /* User resolvers */
  async createUser(parent, { data }, { prisma }, info) {
    // Destructure the plain text password as plainTextPw and the rest as data

    const password = await hashPassword(data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async login(parent, { email, password }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email } });
    if (!user) throw new Error('Unable to login');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error('Unable to login');

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }

    return await prisma.mutation.updateUser({ where: { id: userId }, data }, info);
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const id = getUserId(request);
    return await prisma.mutation.deleteUser({ where: { id } }, info);
  },
};

export default Mutation;
