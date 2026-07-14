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

const kpis = [
  // Awareness
  { category: 'awareness', name: 'Reach', w1: '12,400', w2: '15,200', w3: '14,800', w4: '18,500', total: '60,900', description: 'Measures how many unique people saw our content.' },
  { category: 'awareness', name: 'Impressions', w1: '15,100', w2: '18,400', w3: '17,500', w4: '22,100', total: '73,100', description: 'Shows how often content was displayed.' },
  { category: 'awareness', name: 'Profile Visits', w1: '450', w2: '520', w3: '480', w4: '610', total: '2,060', description: 'Indicates curiosity.' },
  { category: 'awareness', name: 'Followers Gained', w1: '45', w2: '62', w3: '55', w4: '85', total: '247', description: 'Shows audience growth and brand awareness.' },

  // Engagement
  { category: 'engagement', name: 'Likes', w1: '1,200', w2: '1,450', w3: '1,380', w4: '1,750', total: '5,780', description: 'Basic engagement but lowest buying intent.' },
  { category: 'engagement', name: 'Comments', w1: '85', w2: '112', w3: '95', w4: '140', total: '432', description: 'Indicates conversations and genuine interest.' },
  { category: 'engagement', name: 'Shares', w1: '120', w2: '155', w3: '145', w4: '210', total: '630', description: 'High shares mean the content is valuable enough for users to recommend it.' },
  { category: 'engagement', name: 'Saves', w1: '210', w2: '280', w3: '250', w4: '340', total: '1,080', description: 'One of the strongest indicators of future purchase intent.' },
  { category: 'engagement', name: 'Engagement Rate', w1: '4.5%', w2: '5.1%', w3: '4.8%', w4: '5.8%', total: '5.05%', description: 'Measures overall content quality.' },

  // Conversion
  { category: 'conversion', name: 'Instagram DMs', w1: '15', w2: '22', w3: '18', w4: '28', total: '83', description: 'Indicates people are interested enough to start a conversation.' },
  { category: 'conversion', name: 'Itinerary Requests', w1: '8', w2: '12', w3: '10', w4: '15', total: '45', description: 'Shows high purchase intent.' },
  { category: 'conversion', name: 'Consultation Calls', w1: '4', w2: '6', w3: '5', w4: '8', total: '23', description: 'Qualified leads who are actively planning a trip.' },
  { category: 'conversion', name: 'Packages Sent', w1: '3', w2: '5', w3: '4', w4: '7', total: '19', description: 'Measures how many prospects entered the sales pipeline.' },
  { category: 'conversion', name: 'Bookings', w1: '1', w2: '2', w3: '1', w4: '3', total: '7', description: 'Final business outcome' },
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

  console.log('Seeding KPIs...');
  for (const kpi of kpis) {
    const existing = await prisma.kpi.findUnique({
      where: { name: kpi.name },
    });

    if (!existing) {
      await prisma.kpi.create({
        data: kpi,
      });
      console.log(`Created KPI: ${kpi.name}`);
    } else {
      await prisma.kpi.update({
        where: { id: existing.id },
        data: {
          category: kpi.category,
          w1: kpi.w1,
          w2: kpi.w2,
          w3: kpi.w3,
          w4: kpi.w4,
          total: kpi.total,
          description: kpi.description,
        },
      });
      console.log(`Updated KPI: ${kpi.name}`);
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

