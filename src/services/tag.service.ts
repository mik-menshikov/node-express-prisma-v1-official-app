import prisma from '../../prisma/prisma-client';

const getTags = async (username?: string): Promise<string[]> => {
  const queries = [];

  if (username) {
    queries.push({
      username: {
        equals: username,
      },
    });
  }

  const tags = await prisma.tag.groupBy({
    where: {
      articles: {
        some: {},
        every: {
          author: {
            OR: queries.length ? queries : undefined,
          },
        },
      },
    },
    by: ['name'],
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
    take: 10,
  });

  return tags.map(tag => tag.name);
};

export default getTags;
