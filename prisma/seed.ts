import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    title: 'Family',
    subtitle: 'Memories for Generations',
    description: 'Relaxed cultural strolls, interactive museums, and kid-friendly resort stays from Baku to historic Sheki.',
    img: '/Trips/family.jpg',
    tag: 'All Ages',
    tone: 'primary',
  },
  {
    title: 'Friends',
    subtitle: 'Group Excursions & Fun',
    description: 'Action-packed off-roading, vibrant seaside beach clubs, and memorable group tours through active mud volcanoes.',
    img: '/Trips/friends.jpg',
    tag: 'Social',
    tone: 'primary',
  },
  {
    title: 'Couples',
    subtitle: 'Romantic Getaways',
    description: 'Private spa retreats, scenic cable cars over snowy peaks, and candlelit dinners overlooking the Caspian Sea skyline.',
    img: '/Trips/couple.jpg',
    tag: 'Romance',
    tone: 'primary',
  },
  {
    title: 'Adventure',
    subtitle: 'Highland Thrills',
    description: 'Explore breathtaking hiking trails, paragliding, and rugged mountain terrains perfect for adrenaline seekers.',
    img: '/Trips/adventure.jpg',
    tag: 'Active',
    tone: 'primary',
  },
];

async function main() {
  console.log('Seeding trip categories...');
  
  for (const category of categories) {
    // We use createMany or upsert here, but since title is not marked as unique in schema,
    // we'll just check if it exists first to avoid duplicates if run multiple times.
    const existing = await prisma.tripCategory.findFirst({
      where: { title: category.title },
    });

    if (!existing) {
      await prisma.tripCategory.create({
        data: category,
      });
      console.log(`Created category: ${category.title}`);
    } else {
      console.log(`Category already exists: ${category.title}`);
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
