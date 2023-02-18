import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      avatar: faker.image.avatar(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
  });

  console.log(`Created user with id: ${user.id}`);

  const articlesToCreate = Array.from({ length: 10 }).map(() => ({
    authorId: user.id,
    title: faker.lorem.sentence(),
    lead: faker.lorem.paragraph(),
    preview: faker.image.image(),
    content: faker.lorem.paragraphs(),
    isPublished: true,
  }));

  const articlesCreated = await Promise.all(
    articlesToCreate.map(async (article) => {
      const res = await prisma.article.create({
        data: article,
      });
      console.log(`Created article with id: ${res.id}`);
      return res;
    })
  );

  console.log(`Created ${articlesCreated.length} articles`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
