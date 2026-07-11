import { PrismaClient } from '../generated/prisma/client';

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
