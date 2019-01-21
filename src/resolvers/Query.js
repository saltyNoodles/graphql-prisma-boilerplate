import { getUserId } from '../utils';

const Query = {
  users(parent, { query, ...args }, { prisma }, info) {
    const opArgs = {
      ...args,
    };
    if (query) {
      opArgs.where = {
        OR: [
          {
            name_contains: query,
          },
        ],
      };
    }
    return prisma.query.users(opArgs, info);
  },

  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return await prisma.query.user({ where: { id: userId } }, info);
  },
};
export default Query;
