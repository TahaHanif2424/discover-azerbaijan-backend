import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  {
    title: 'Family',
    subtitle: 'Memories for Generations',
    description: 'Relaxed cultural strolls, interactive museums, and kid-friendly resort stays from Baku to historic Sheki.',
    img: '/uploads/family.jpg',
    tag: 'All Ages',
    tone: 'primary',
  },
  {
    title: 'Friends',
    subtitle: 'Group Excursions & Fun',
    description: 'Action-packed off-roading, vibrant seaside beach clubs, and memorable group tours through active mud volcanoes.',
    img: '/uploads/friends.jpg',
    tag: 'Social',
    tone: 'primary',
  },
  {
    title: 'Couples',
    subtitle: 'Romantic Getaways',
    description: 'Private spa retreats, scenic cable cars over snowy peaks, and candlelit dinners overlooking the Caspian Sea skyline.',
    img: '/uploads/couple.jpg',
    tag: 'Romance',
    tone: 'primary',
  },
  {
    title: 'Adventure',
    subtitle: 'Highland Thrills',
    description: 'Explore breathtaking hiking trails, paragliding, and rugged mountain terrains perfect for adrenaline seekers.',
    img: '/uploads/adventure.jpg',
    tag: 'Active',
    tone: 'primary',
  },
];

const users = [
  {
    email: 'tahahanif24@gmail.com',
    name: 'Taha Bin Hanif',
    password: 'discover123*',
    role: 'admin',
  },
  {
    email: 'zqazilbash@gmail.com',
    name: 'Zulfiqar Ali',
    password: 'discover123*',
    role: 'admin',
  },
  {
    email: 'abeehamahin@gmail.com',
    name: 'Abeeha Mahin',
    password: 'discover123*',
    role: 'admin',
  }, {
    email: 'arishashhd@gmail.com',
    name: 'Aarish Shahid',
    password: 'discover123*',
    role: 'marketing',
  }
];

async function main() {
  console.log('Seeding trip categories...');

  for (const category of categories) {
    const existing = await prisma.tripCategory.findFirst({
      where: { title: category.title },
    });

    if (!existing) {
      await prisma.tripCategory.create({
        data: category,
      });
      console.log(`Created category: ${category.title}`);
    } else {
      await prisma.tripCategory.update({
        where: { id: existing.id },
        data: { img: category.img },
      });
      console.log(`Updated existing category image for: ${category.title}`);
    }
  }

  console.log('Seeding users...');
  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role,
        },
      });
      console.log(`Created user: ${user.email}`);
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: user.name,
          password: hashedPassword,
          role: user.role,
        },
      });
      console.log(`Updated existing user password/role for: ${user.email}`);
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

