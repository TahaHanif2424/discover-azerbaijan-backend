import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const categoryMetadata: Record<string, { subtitle: string; description: string; img: string; tag: string; tone: string }> = {
  'Family FIT': {
    subtitle: 'Memories for Generations',
    description: 'Relaxed cultural strolls, interactive museums, and kid-friendly resort stays from Baku to historic Sheki.',
    img: '/uploads/family.jpg',
    tag: 'All Ages',
    tone: 'primary',
  },
  'Wellness FIT': {
    subtitle: 'Wellness & Relaxation',
    description: 'Rejuvenating wellness treatments and premium spa resorts in Baku and Naftalan.',
    img: '/uploads/friends.jpg',
    tag: 'Relaxation',
    tone: 'primary',
  },
  'Honeymoon FIT': {
    subtitle: 'Romantic Getaways',
    description: 'Private honeymoon room setups, romantic dinners, and scenic excursions for couples.',
    img: '/uploads/couple.jpg',
    tag: 'Romance',
    tone: 'primary',
  },
  'Event Group': {
    subtitle: 'Unforgettable Events',
    description: 'Experience premium events like Baku F1 Grand Prix and Dream Fest at Sea Breeze Resort.',
    img: '/uploads/adventure.jpg',
    tag: 'Events',
    tone: 'primary',
  },
  'MICE/ Corporate Group': {
    subtitle: 'Corporate Retreats & Meetings',
    description: 'Professional corporate meeting setups, team-building retreats, and gala dinners.',
    img: '/uploads/family.jpg',
    tag: 'Corporate',
    tone: 'primary',
  },
};

async function main() {
  const jsonPath = path.join(__dirname, 'packages.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: packages.json not found at ${jsonPath}`);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const categoriesData = JSON.parse(fileData);

  console.log('Clearing existing database records...');
  // Delete orders first due to foreign key constraints
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`Deleted ${deletedOrders.count} existing orders.`);

  // Delete trips
  const deletedTrips = await prisma.trip.deleteMany({});
  console.log(`Deleted ${deletedTrips.count} existing trips.`);

  // Delete categories
  const deletedCategories = await prisma.tripCategory.deleteMany({});
  console.log(`Deleted ${deletedCategories.count} existing categories.`);

  console.log('Seeding new categories and packages...');

  for (const catData of categoriesData) {
    const catName = catData.category;
    const metadata = categoryMetadata[catName] || {
      subtitle: 'Premium Travel Experience',
      description: `Curated ${catName} packages in Azerbaijan.`,
      img: '/uploads/family.jpg',
      tag: 'Custom',
      tone: 'primary',
    };

    console.log(`Creating Category: ${catName}`);
    const category = await prisma.tripCategory.create({
      data: {
        title: catName,
        subtitle: metadata.subtitle,
        description: metadata.description,
        img: metadata.img,
        tag: metadata.tag,
        tone: metadata.tone,
      },
    });

    for (const pkg of catData.packages) {
      console.log(`  Creating Package: ${pkg.title} under ${catName}`);
      await prisma.trip.create({
        data: {
          title: pkg.title,
          subtitle: catName.toUpperCase(),
          description: `Enjoy a curated ${pkg.title} travel package under our ${catName} collection, fully customized to provide a premium experience in Azerbaijan.`,
          price3Star: pkg.price3Star,
          price4Star: pkg.price4Star,
          price5Star: pkg.price5Star,
          islamabadDepartureAddOn: pkg.islamabadDepartureAddOn,
          expressVisaAddOn: pkg.expressVisaAddOn,
          currency: 'PKR',
          durationDays: pkg.durationDays,
          durationText: pkg.durationText,
          inclusions: pkg.inclusions,
          img: metadata.img, // Use the category image as a beautiful default
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
