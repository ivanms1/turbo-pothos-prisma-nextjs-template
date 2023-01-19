import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      avatar: faker.image.avatar(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      role: 'ADMIN',
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
    tags: faker.helpers.uniqueArray(faker.word.noun, 5),
  }));

  const articles = await prisma.article.createMany({
    data: articlesToCreate,
  });

  console.log(`Created ${articles.count} articles`);
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
