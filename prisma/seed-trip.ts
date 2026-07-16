import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Try to find a category, or create one
  let category = await prisma.tripCategory.findFirst();
  if (!category) {
    category = await prisma.tripCategory.create({
      data: {
        title: 'Weekend Escapes',
        description: 'Short weekend escapes around Azerbaijan',
      },
    });
  }

  const trip = await prisma.trip.create({
    data: {
      title: 'Baku City Break',
      subtitle: 'WEEKEND IN AZERBAIJAN!',
      durationText: '4 DAYS / 3 NIGHTS',
      durationDays: 4,
      categoryId: category.id,
      inclusions: [
        'Transportation services throughout the entire route.',
        'Accommodation at the hotel for 3 nights.',
        'Meal plan: hotel breakfasts; 1 dinner featuring a variety of dishes in Baku; 1 dinner en route from Lahij to Baku; 1 lunch in Lahij; soft drinks served with all lunches and dinners.',
        'Services of a professional tour guide and tour escort throughout the programme.',
        'Entrance fees to all sightseeing attractions included in the itinerary (except the Palace of the Shirvanshahs and the Maiden Tower in Baku).'
      ],
      itinerary: [
        {
          "day": "Day-1",
          "activities": [
            "Arrival in Baku. Meeting with representatives of the receiving party.",
            "Airport transfer to the city center (25–30 km). Hotel check-in. You will have some time to freshen up and get ready for your first introduction to the wonderful city of Baku.",
            "At 20:30, you will be welcomed to dinner at a prestigious restaurant with a pleasant atmosphere, offering a true celebration of flavors. While enjoying traditional Azerbaijani cuisine and the melodies of national music, you will feel the spirit of Eastern culture touching your heart and leaving an indelible impression. This evening will mark the beginning of your unforgettable journey into the world of Azerbaijani fairy tales.",
            "22:30/23:00 Return to the hotel."
          ]
        },
        {
          "day": "Day-2",
          "activities": [
            "After breakfast, you will enjoy a combined driving and walking sightseeing tour of the city center. You will be immersed in the history and culture of both ancient and modern Baku. The tour will take you along the city’s main avenues, streets, and squares, where you will see sculptural, monumental, architectural, and historical landmarks. You will also admire panoramic views of the city and Baku Bay from the observation deck of Highland Park with its memorial complexes, followed by a walking tour through the medieval part of the Old City.",
            "“Icheri Sheher” / Old City.\nThe medieval fortified walls, towers, and main city gates of Baku will welcome you with a distinctive architectural style of residential houses, narrow cobblestone streets, and ancient buildings, each telling its own unique story. You will also see the “Archeopark” archaeological excavation site, as well as artisan workshops, craft studios, souvenir shops, and antique stores.\n– You will see one of the symbols of Baku – the famous Maiden Tower, rising above the city and holding centuries-old secrets. The Maiden Tower (7th–12th centuries) is an architectural icon surrounded by numerous legends. It is a majestic and the most mysterious eight-tiered monument of Baku. The exact date of its construction and its original purpose remain the subject of ongoing scholarly debate.\n– You will visit the memorial and religious complex of the Shirvanshahs’ Palace (15th century), an outstanding architectural ensemble. The palace complex is the largest monument of the Shirvan-Absheron branch of Azerbaijani architecture. It was not built according to a single architectural plan and consists of a number of structures arranged across three levels, following the natural relief of the terrain.\n– You will also have the opportunity to visit the world’s first and only unique Museum of Miniature Books, listed in the Guinness World Records, where tiny masterpieces of remarkable craftsmanship are displayed. Where else can you see a collection of books in which even the largest one does not exceed 10 cm in length and 10 cm in width?!\n– The gallery of the eccentric artist Ali Shamsi will amaze you with its uniqueness and rich imagination. While strolling through the Old City, you will feel as if you have been transported back in time, immersing yourself in the atmosphere of the medieval East.",
            "Lunch break (on-site, at an additional cost).",
            "After lunch, return to the hotel. (Guests who wish to remain in the city center may be dropped off there and make their own way back to the hotel at their convenience).\nThose who wish may continue exploring the city center on foot, or enjoy the lively atmosphere of Baku’s night clubs, restaurants, and beer bars."
          ]
        },
        {
          "day": "Day-3",
          "activities": [
            "An Exciting Journey to Nagorno-Shirvan – One of Azerbaijan's Most Beautiful Regions!",
            "Breakfast at the hotel. Guests may leave their luggage at the hotel and take only the essentials for the day.",
            "09:00 A fascinating sightseeing and educational journey to Azerbaijan's northwestern region along the route Baku – Shamakhi – Mughanli Pass – the Girdimanchay River Gorge and Canyon – the highland settlement and reserve of Lahij.\nThroughout the journey, guests will enjoy an informative guided tour with fascinating insights into the region's history, culture, and natural heritage. The itinerary includes several scenic photo stops, as well as sightseeing opportunities while travelling along the foothills of the southwestern slopes of the Greater Caucasus Mountains:\n– Juma Mosque (11th–early 20th centuries), located in the city of Shamakhi.\n The Juma Mosque is the largest functioning mosque in the Caucasus and one of the oldest Islamic places of worship not only in Azerbaijan, but throughout the South Caucasus and the Middle East. According to historical tradition, the mosque was originally founded in the 8th century, when Shamakhi was chosen as the residence of the Arab Caliph. Over the centuries, it has been rebuilt and restored several times, while preserving its status as one of the country's most important religious and architectural landmarks.\n– Introduction to the Ismayilli District and the Russian village of Ivanovka.\n Guests will learn about the Ismayilli region and the unique village of Ivanovka, founded by Russian Molokans – members of a Spiritual Christian community who were resettled to Azerbaijan during the reign of Catherine II (1762–1796). Known for their strong work ethic and close-knit community, the Molokans successfully adapted to their new homeland and have lived peacefully alongside people of different ethnicities and faiths for generations. Ivanovka is home to the country's last remaining collective farm (kolkhoz), which continues to operate to this day. The Molokans follow a simple and austere way of life, traditionally avoiding smoking, profanity, and the veneration of icons. Instead of churches, they gather for worship in modest prayer houses, which are deliberately unadorned and outwardly resemble ordinary residential homes.\n– Panoramic views of the Niyaldag Range, part of the Greater Caucasus Mountains, from Muganli Pass.\n– Scenic views of the dramatic rocky cliffs of the Girdimanchay River Canyon.",
            "Short stop/walk by canyon and suspension bridge over river.",
            "12:00 Arrival in Lahij, a picturesque highland village and open-air historical and architectural museum, situated at an altitude of 1,250–1,500 metres above sea level on the banks of the Girdimanchay River.\nDating back to the 4th century, Lahij is renowned for its remarkably advanced water supply and three-level sewage system – an exceptional engineering achievement for its time. The village has preserved the atmosphere of a medieval Persian town, with its cobbled streets, traditional stone houses, and centuries-old craftsmanship. For centuries, the local community has been renowned for its traditional crafts, particularly carpet weaving, blacksmithing, and copper craftsmanship. Lahij was an important stop along historic caravan routes connecting Turkey, Georgia, Armenia, Persia, and Dagestan, with merchants transporting goods and trading handcrafted products throughout the region.\nMerchants once brought foodstuffs, copper, and textiles to the village, while exporting finely crafted copperware, edged weapons, household utensils, and other handcrafted goods. Lahij earned a lasting reputation for the exceptional quality of its bladesmithing and copper craftsmanship. To this day, visitors can browse artisan workshops offering beautifully handcrafted copperware engraved with intricate Eastern motifs, as well as handwoven textiles, knitted and woven handicrafts, woodwork, leather goods, traditional knives, and a wide variety of authentic local souvenirs. According to legend, the legendary Monomakh's Cap–the historic crown worn by Russian tsars for centuries – was crafted by the master artisans of Lahij.\nThe works of Lahij's blacksmiths, coppersmiths, and master metal engravers are showcased in art museums around the world. Some of these exceptional handcrafted pieces have become part of the collections of the Louvre Museum and the Bern Historical Museum.",
            "12:30-14:00 Enjoy a traditional homemade lunch with a local family or dine at one of Lahij's authentic local restaurants.",
            "After lunch, enjoy a guided walk through the charming mountain village, discovering its distinctive architecture and rich cultural heritage. The program includes a visit to the local history museum, traditional artisan workshops, and craft boutiques, where visitors can observe skilled craftsmen producing handcrafted copper ware, metal engravings, embossed metalwork, blacksmith products, handwoven carpets, and other traditional handicrafts.\nGuests wishing to purchase a unique souvenir will have the opportunity to watch skilled local artisans craft it right before their eyes.",
            "16:30/17:00 Departure for the return journey along the route: Lahij – Ismayilli – Shamakhi – Baku. En route, stop for dinner at a restaurant in Shamakhi, where guests will enjoy traditional Azerbaijani cuisine.",
            "20:30/21:00 Arrival in Baku and transfer to the hotel."
          ]
        },
        {
          "day": "Day-4",
          "activities": [
            "Breakfast at the hotel. Check-out by 12:00.",
            "Transfer to the airport.",
            "Before departure, you may visit the famous “Yashil Bazar / Green Market.”\n“Yashil Bazar” is one of the largest markets in the city – a modern pavilion where you can purchase a wide variety of fresh and eco-friendly agricultural products from different regions."
          ]
        }
      ],
      pricing: [
        {
          "tableNumber": 1,
          "hotels": [
            {
              "name": "Shah Palace (Old City)",
              "rooms": [
                { "type": "Std/Budget Room", "pax6": 473, "pax8": 485, "pax10": 553, "pax12": 453 },
                { "type": "Superior Atrium View", "pax6": 453, "pax8": 465, "pax10": 533, "pax12": 428 },
                { "type": "Deluxe with view", "pax6": 413, "pax8": 425, "pax10": 493, "pax12": 413 }
              ]
            },
            {
              "name": "Molokan Inn",
              "rooms": [
                { "type": "Std Courtyard View", "pax6": 470, "pax8": 486, "pax10": 545, "pax12": 450 },
                { "type": "Std Park View", "pax6": 450, "pax8": 466, "pax10": 525, "pax12": 425 },
                { "type": "Deluxe Park View", "pax6": 410, "pax8": 426, "pax10": 485, "pax12": 410 }
              ]
            }
          ]
        }
      ]
    }
  });
  
  console.log("Trip seeded successfully", trip);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
