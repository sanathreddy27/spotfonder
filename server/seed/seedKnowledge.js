import mongoose from "mongoose";
import dotenv from "dotenv";

import Destination from "../models/Destination.js";
import Attraction from "../models/Attraction.js";

import indiaDestinations from "../data/indiaDestinations.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("=================================");
console.log("✅ Connected to MongoDB");
console.log("=================================");

// Remove old development knowledge
await Destination.deleteMany({});
await Attraction.deleteMany({});

console.log("🗑️ Old knowledge removed");

// Destination-specific knowledge
const destinationKnowledge = {
  Leh: {
    importance:
      "Leh is an important high-altitude destination in Ladakh and a major base for exploring the region's mountain landscapes, monasteries and Himalayan culture.",
    famousFor:
      "Leh is famous for its dramatic Himalayan scenery, Buddhist monasteries, high-altitude roads, Pangong Lake and Ladakh's distinctive culture.",
    description:
      "Leh is a high-altitude town surrounded by rugged mountains and arid landscapes. It is commonly used as a base for exploring Ladakh and nearby Himalayan attractions.",
    history:
      "Leh has historically been an important trading and cultural centre in the Himalayan region and has strong connections with Tibetan Buddhist culture.",
    bestTime:
      "May to September is generally suitable for exploring Leh because many mountain routes are more accessible during the warmer months.",
    tags: [
      "Ladakh",
      "Himalayas",
      "mountains",
      "Buddhist monasteries",
      "adventure",
      "high altitude",
    ],
  },

  "Spiti Valley": {
    importance:
      "Spiti Valley is an important Himalayan destination known for its high-altitude desert landscape, remote villages and Buddhist cultural heritage.",
    famousFor:
      "Spiti Valley is famous for dramatic mountains, monasteries, remote villages, high-altitude roads and clear Himalayan landscapes.",
    description:
      "Spiti is a cold desert mountain valley in Himachal Pradesh with rugged terrain, sparse vegetation and traditional settlements surrounded by high Himalayan peaks.",
    history:
      "The valley has a strong Tibetan Buddhist cultural influence, reflected in its monasteries, villages and traditional way of life.",
    bestTime:
      "The warmer months from roughly May to October are generally more suitable for road travel and sightseeing in Spiti Valley.",
    tags: [
      "Spiti",
      "Himalayas",
      "cold desert",
      "mountains",
      "monasteries",
      "adventure",
    ],
  },

  Manali: {
    importance:
      "Manali is a major Himalayan tourism destination in Himachal Pradesh and an important base for mountain recreation and exploring the surrounding valleys.",
    famousFor:
      "Manali is famous for snow-covered mountains, valleys, waterfalls, adventure activities, Rohtang-area landscapes and nearby trekking routes.",
    description:
      "Manali is a mountain town in the Beas River valley surrounded by forests and Himalayan peaks, offering sightseeing and outdoor activities.",
    history:
      "Manali has developed from a Himalayan settlement into one of Himachal Pradesh's major tourism centres.",
    bestTime:
      "March to June is popular for pleasant weather and outdoor activities, while winter attracts visitors interested in snow.",
    tags: [
      "Himachal Pradesh",
      "Himalayas",
      "mountains",
      "snow",
      "adventure",
      "nature",
    ],
  },

  Shimla: {
    importance:
      "Shimla is an important hill station and one of the best-known colonial-era tourism centres in Himachal Pradesh.",
    famousFor:
      "Shimla is famous for colonial architecture, Mall Road, The Ridge, Himalayan scenery and its historic hill-station character.",
    description:
      "Shimla is a mountain city spread across ridges in the Himalayas, combining historic buildings, forested hills and popular sightseeing areas.",
    history:
      "Shimla became an important British-era hill station and served as the summer capital of British India.",
    bestTime:
      "March to June is generally pleasant for sightseeing, while winter offers colder weather and occasional snowfall.",
    tags: [
      "Shimla",
      "Himachal Pradesh",
      "colonial architecture",
      "mountains",
      "Mall Road",
      "snow",
    ],
  },

  Dharamshala: {
    importance:
      "Dharamshala is an important Himalayan destination known for Tibetan culture, mountain scenery and its connection with the Tibetan spiritual community.",
    famousFor:
      "Dharamshala is famous for McLeod Ganj, Tibetan culture, monasteries, the Dhauladhar mountains and trekking.",
    description:
      "Dharamshala lies against the Dhauladhar range and combines mountain landscapes with Tibetan cultural and spiritual attractions.",
    history:
      "The region became internationally known as a centre of the Tibetan community after the arrival of the Dalai Lama and many Tibetan refugees.",
    bestTime:
      "March to June and September to November are commonly comfortable periods for sightseeing and outdoor exploration.",
    tags: [
      "Dharamshala",
      "McLeod Ganj",
      "Tibetan culture",
      "Dhauladhar",
      "mountains",
      "monasteries",
    ],
  },

  Munnar: {
    importance:
      "Munnar is one of Kerala's best-known hill destinations and an important centre for tea-growing landscapes and nature tourism.",
    famousFor:
      "Munnar is famous for tea plantations, misty mountains, Eravikulam National Park, waterfalls, viewpoints and cool mountain scenery.",
    description:
      "Munnar is a hill station in Kerala's Western Ghats surrounded by tea estates, forests, valleys and mountain landscapes.",
    history:
      "Munnar's modern development is closely associated with the growth of tea plantations in the region during the colonial period.",
    bestTime:
      "September to March is generally comfortable for sightseeing, while the monsoon months bring heavier rainfall and lush green landscapes.",
    tags: [
      "Munnar",
      "Kerala",
      "tea plantations",
      "Western Ghats",
      "nature",
      "mountains",
    ],
  },

  Wayanad: {
    importance:
      "Wayanad is an important nature destination in Kerala known for forests, wildlife, waterfalls, caves and mountain landscapes.",
    famousFor:
      "Wayanad is famous for its forests, Edakkal Caves, waterfalls, wildlife sanctuaries, viewpoints and spice plantations.",
    description:
      "Wayanad is a green highland region with forests, hills, plantations and natural attractions spread across northern Kerala.",
    history:
      "Wayanad has a long connection with indigenous communities, agriculture and the historical trade routes of the Western Ghats.",
    bestTime:
      "October to May is generally suitable for sightseeing and outdoor activities, with weather varying during the monsoon.",
    tags: [
      "Wayanad",
      "Kerala",
      "forests",
      "wildlife",
      "waterfalls",
      "caves",
    ],
  },

  Alleppey: {
    importance:
      "Alleppey, also known as Alappuzha, is an important Kerala backwater destination and a major centre for houseboat tourism.",
    famousFor:
      "Alleppey is famous for backwaters, houseboats, canals, lagoons, paddy fields and peaceful waterways.",
    description:
      "Alleppey is a coastal town surrounded by an interconnected network of canals, lakes and lagoons that form part of Kerala's backwater system.",
    history:
      "The waterways around Alappuzha historically supported trade, transportation, fishing and agriculture and later became important to tourism.",
    bestTime:
      "October to March is generally comfortable for exploring the backwaters and enjoying houseboat experiences.",
    tags: [
      "Alleppey",
      "Alappuzha",
      "Kerala",
      "backwaters",
      "houseboats",
      "canals",
    ],
  },

  Coorg: {
    importance:
      "Coorg, officially Kodagu, is an important hill and plantation destination in Karnataka known for forests, coffee estates and mountain scenery.",
    famousFor:
      "Coorg is famous for coffee plantations, misty hills, waterfalls, forests and Kodava culture.",
    description:
      "Coorg is a scenic highland region with coffee plantations, forests, rivers and rolling hills in the Western Ghats.",
    history:
      "Kodagu has a distinctive regional history and is associated with the Kodava community and its cultural traditions.",
    bestTime:
      "October to March is generally comfortable for sightseeing, plantations and outdoor activities.",
    tags: [
      "Coorg",
      "Kodagu",
      "Karnataka",
      "coffee",
      "Western Ghats",
      "nature",
    ],
  },

  Chikmagalur: {
    importance:
      "Chikmagalur is an important coffee-growing hill destination in Karnataka and a gateway to the surrounding Western Ghats.",
    famousFor:
      "Chikmagalur is famous for coffee plantations, Mullayanagiri, mountain scenery, waterfalls and trekking.",
    description:
      "Chikmagalur is a green hill region surrounded by coffee estates and the mountains of the Western Ghats.",
    history:
      "The region is strongly associated with the development of coffee cultivation in Karnataka.",
    bestTime:
      "September to March is generally suitable for sightseeing, trekking and exploring coffee plantations.",
    tags: [
      "Chikmagalur",
      "Karnataka",
      "coffee",
      "Western Ghats",
      "trekking",
      "mountains",
    ],
  },

  Ooty: {
    importance:
      "Ooty, officially Udhagamandalam, is one of Tamil Nadu's best-known hill stations and an important tourism centre in the Nilgiri Hills.",
    famousFor:
      "Ooty is famous for tea plantations, botanical gardens, lakes, mountain scenery and the Nilgiri Mountain Railway.",
    description:
      "Ooty is a cool hill station surrounded by tea estates, eucalyptus forests and rolling Nilgiri hills.",
    history:
      "Ooty developed as a prominent British-era hill station and retains several colonial-era buildings and institutions.",
    bestTime:
      "March to June is generally pleasant for sightseeing, while September to November can also offer comfortable conditions.",
    tags: [
      "Ooty",
      "Tamil Nadu",
      "Nilgiri Hills",
      "tea",
      "mountains",
      "railway",
    ],
  },

  Kodaikanal: {
    importance:
      "Kodaikanal is an important hill station in Tamil Nadu known for its forests, lake and scenic Palani Hills landscape.",
    famousFor:
      "Kodaikanal is famous for Kodaikanal Lake, viewpoints, waterfalls, pine forests and cool mountain weather.",
    description:
      "Kodaikanal is a hill town surrounded by forests, valleys and the distinctive landscapes of the Palani Hills.",
    history:
      "Kodaikanal developed as a colonial-era hill retreat and later became a major tourism destination in southern India.",
    bestTime:
      "April to June is generally comfortable for sightseeing, while the post-monsoon months can provide lush scenery.",
    tags: [
      "Kodaikanal",
      "Tamil Nadu",
      "Palani Hills",
      "lake",
      "forests",
      "waterfalls",
    ],
  },

  Goa: {
    importance:
      "Goa is a major coastal tourism destination known for its beaches, cultural heritage, Portuguese-influenced architecture and diverse leisure experiences.",
    famousFor:
      "Goa is famous for beaches, historic churches, coastal landscapes, seafood, nightlife and Portuguese-influenced culture.",
    description:
      "Goa combines a long coastline with historic towns, churches, temples, markets, rivers and tropical landscapes.",
    history:
      "Goa has a long history shaped by regional kingdoms and centuries of Portuguese rule, which influenced its architecture and culture.",
    bestTime:
      "November to February is generally popular for beach activities and outdoor sightseeing because the weather is relatively dry and comfortable.",
    tags: [
      "Goa",
      "beaches",
      "coast",
      "Portuguese heritage",
      "seafood",
      "culture",
    ],
  },

  Gokarna: {
    importance:
      "Gokarna is an important coastal destination in Karnataka that combines beaches with Hindu pilgrimage traditions.",
    famousFor:
      "Gokarna is famous for Om Beach, Kudle Beach, Half Moon Beach, coastal landscapes and the Mahabaleshwar Temple.",
    description:
      "Gokarna is a coastal town surrounded by beaches and hills and is known for both pilgrimage and beach tourism.",
    history:
      "Gokarna has long been an important Hindu pilgrimage centre associated with the Mahabaleshwar Temple and Shiva worship.",
    bestTime:
      "October to March is generally suitable for enjoying beaches and exploring the town and surrounding coastline.",
    tags: [
      "Gokarna",
      "Karnataka",
      "beaches",
      "pilgrimage",
      "coast",
      "temples",
    ],
  },

  Udaipur: {
    importance:
      "Udaipur is an important heritage destination in Rajasthan known for its lakes, palaces and Mewar cultural heritage.",
    famousFor:
      "Udaipur is famous for Lake Pichola, City Palace, historic palaces, lakes and the romantic character of its old city.",
    description:
      "Udaipur is a historic city surrounded by lakes and hills, with palaces, temples and traditional markets forming its major attractions.",
    history:
      "Udaipur was founded in the 16th century by Maharana Udai Singh II and became an important centre of the Mewar kingdom.",
    bestTime:
      "October to March is generally comfortable for exploring Udaipur's palaces, lakes and heritage areas.",
    tags: [
      "Udaipur",
      "Rajasthan",
      "Mewar",
      "palaces",
      "lakes",
      "heritage",
    ],
  },

  Jaipur: {
    importance:
      "Jaipur is the capital of Rajasthan and an important centre of heritage tourism, architecture, crafts and regional culture.",
    famousFor:
      "Jaipur is famous for the Pink City, Hawa Mahal, Amber Fort, City Palace, Jantar Mantar and colourful markets.",
    description:
      "Jaipur is a historic planned city with grand forts, palaces, observatories, bazaars and distinctive pink-toned architecture.",
    history:
      "Jaipur was founded in 1727 by Maharaja Sawai Jai Singh II and became the capital of the Kachwaha Rajput kingdom.",
    bestTime:
      "October to March is generally more comfortable for walking through heritage areas and visiting forts and palaces.",
    tags: [
      "Jaipur",
      "Rajasthan",
      "Pink City",
      "forts",
      "palaces",
      "heritage",
    ],
  },

  Jaisalmer: {
    importance:
      "Jaisalmer is an important desert heritage destination in Rajasthan known for its sandstone architecture and Thar Desert setting.",
    famousFor:
      "Jaisalmer is famous for Jaisalmer Fort, golden sandstone havelis, desert landscapes and camel experiences.",
    description:
      "Jaisalmer is a historic desert city surrounded by the Thar Desert and characterised by golden-yellow sandstone buildings.",
    history:
      "Jaisalmer was founded in the 12th century by Rawal Jaisal and developed as an important trading centre along historic routes.",
    bestTime:
      "October to March is generally more comfortable for exploring the desert and historic city because temperatures are lower.",
    tags: [
      "Jaisalmer",
      "Rajasthan",
      "Thar Desert",
      "fort",
      "havelis",
      "desert",
    ],
  },

  "Mount Abu": {
    importance:
      "Mount Abu is Rajasthan's principal hill station and an important destination for mountain scenery, temples and cultural attractions.",
    famousFor:
      "Mount Abu is famous for Nakki Lake, Dilwara Temples, viewpoints and its cooler mountain climate.",
    description:
      "Mount Abu is a hill town in the Aravalli Range surrounded by forests, rocky landscapes and viewpoints.",
    history:
      "Mount Abu has religious and historical importance and is particularly known for the finely carved Dilwara Jain temples.",
    bestTime:
      "October to March is generally comfortable for sightseeing, while the summer months are also popular because of the cooler climate.",
    tags: [
      "Mount Abu",
      "Rajasthan",
      "Aravalli",
      "Dilwara Temples",
      "Nakki Lake",
      "hills",
    ],
  },

  Rishikesh: {
    importance:
      "Rishikesh is an important spiritual and adventure destination on the Ganges in Uttarakhand.",
    famousFor:
      "Rishikesh is famous for yoga, ashrams, the Ganges, suspension bridges, rafting and Himalayan adventure activities.",
    description:
      "Rishikesh lies along the Ganges near the Himalayan foothills and combines spiritual centres with outdoor adventure.",
    history:
      "Rishikesh has long been associated with Hindu pilgrimage, meditation and spiritual traditions.",
    bestTime:
      "September to November and March to May are generally popular for sightseeing and outdoor activities.",
    tags: [
      "Rishikesh",
      "Uttarakhand",
      "Ganges",
      "yoga",
      "rafting",
      "spirituality",
    ],
  },

  Nainital: {
    importance:
      "Nainital is an important hill station in Uttarakhand centred around a scenic natural lake.",
    famousFor:
      "Nainital is famous for Naini Lake, hill viewpoints, boating, Mall Road and surrounding Himalayan scenery.",
    description:
      "Nainital is a mountain town built around Naini Lake and surrounded by forested hills.",
    history:
      "Nainital developed as a British-era hill station and became an important administrative and tourism centre.",
    bestTime:
      "March to June is generally pleasant for sightseeing and boating, while winter brings colder weather.",
    tags: [
      "Nainital",
      "Uttarakhand",
      "Naini Lake",
      "hills",
      "boating",
      "viewpoints",
    ],
  },

  Mussoorie: {
    importance:
      "Mussoorie is one of Uttarakhand's best-known hill stations and an important tourism destination in the Himalayan foothills.",
    famousFor:
      "Mussoorie is famous for Mall Road, Camel's Back Road, viewpoints, waterfalls and Himalayan scenery.",
    description:
      "Mussoorie is a hill town spread along mountain ridges with forests, valleys and viewpoints overlooking the surrounding landscape.",
    history:
      "Mussoorie developed as a British-era hill station and became a popular summer retreat.",
    bestTime:
      "March to June and September to November are generally comfortable periods for sightseeing and outdoor exploration.",
    tags: [
      "Mussoorie",
      "Uttarakhand",
      "hill station",
      "Mall Road",
      "waterfalls",
      "Himalayas",
    ],
  },

  "Valley of Flowers": {
    importance:
      "The Valley of Flowers is an important Himalayan protected area known for alpine meadows and seasonal flowering plants.",
    famousFor:
      "The Valley of Flowers is famous for colourful alpine flowers, Himalayan landscapes, trekking and biodiversity.",
    description:
      "The valley is a high-altitude Himalayan meadow surrounded by dramatic mountains and is known for its seasonal floral displays.",
    history:
      "The valley has been recognised for its ecological importance and forms part of the Nanda Devi and Valley of Flowers National Parks.",
    bestTime:
      "The valley is generally accessible during the summer monsoon season when alpine flowers are in bloom, subject to official access conditions.",
    tags: [
      "Valley of Flowers",
      "Uttarakhand",
      "Himalayas",
      "flowers",
      "trekking",
      "biodiversity",
    ],
  },

  Shillong: {
    importance:
      "Shillong is the capital of Meghalaya and an important gateway to the region's hills, waterfalls and cultural attractions.",
    famousFor:
      "Shillong is famous for its green hills, waterfalls, viewpoints, lakes and distinctive Khasi culture.",
    description:
      "Shillong is a hill city surrounded by pine-covered landscapes, waterfalls and rolling plateaus in Meghalaya.",
    history:
      "Shillong developed as an important administrative centre during the colonial period and remains a major cultural centre of Meghalaya.",
    bestTime:
      "October to April is generally suitable for sightseeing, while the monsoon season brings much heavier rainfall.",
    tags: [
      "Shillong",
      "Meghalaya",
      "hills",
      "waterfalls",
      "Khasi culture",
      "nature",
    ],
  },

  Cherrapunji: {
    importance:
      "Cherrapunji, also known as Sohra, is an important nature destination in Meghalaya known for heavy rainfall, waterfalls and living root bridges.",
    famousFor:
      "Cherrapunji is famous for dramatic waterfalls, caves, lush landscapes, rainfall and living root bridges.",
    description:
      "Cherrapunji is a highland region with deep valleys, limestone caves, waterfalls and dense greenery.",
    history:
      "Sohra has long been associated with the Khasi people and became internationally known because of its exceptional rainfall records.",
    bestTime:
      "October to May is generally more suitable for sightseeing, while the monsoon brings spectacular waterfalls and very heavy rain.",
    tags: [
      "Cherrapunji",
      "Sohra",
      "Meghalaya",
      "waterfalls",
      "caves",
      "living root bridges",
    ],
  },

  Kaziranga: {
    importance:
      "Kaziranga is an important wildlife destination and protected area in Assam known for its exceptional biodiversity.",
    famousFor:
      "Kaziranga is particularly famous for its population of greater one-horned rhinoceroses, along with elephants, wild water buffalo and diverse birdlife.",
    description:
      "Kaziranga National Park contains grasslands, wetlands and forests that support a wide range of wildlife.",
    history:
      "Kaziranga was established as a protected area in the early twentieth century and later became a national park and UNESCO World Heritage Site.",
    bestTime:
      "November to April is generally the main tourism period, with park access depending on seasonal conditions.",
    tags: [
      "Kaziranga",
      "Assam",
      "wildlife",
      "rhinoceros",
      "national park",
      "safari",
    ],
  },

  Tawang: {
    importance:
      "Tawang is an important Himalayan destination in Arunachal Pradesh known for mountain scenery and Tibetan Buddhist heritage.",
    famousFor:
      "Tawang is famous for Tawang Monastery, high mountain passes, lakes, valleys and Buddhist culture.",
    description:
      "Tawang is a high-altitude mountain town surrounded by dramatic Himalayan landscapes and traditional Buddhist cultural sites.",
    history:
      "Tawang has a long history connected with Tibetan Buddhism and is home to the historic Tawang Monastery.",
    bestTime:
      "April to June and September to October are generally suitable for travel, subject to mountain weather and road conditions.",
    tags: [
      "Tawang",
      "Arunachal Pradesh",
      "Himalayas",
      "Tawang Monastery",
      "Buddhism",
      "mountains",
    ],
  },

  Gangtok: {
    importance:
      "Gangtok is the capital of Sikkim and an important Himalayan tourism centre known for mountain views and Buddhist culture.",
    famousFor:
      "Gangtok is famous for monasteries, views of the Himalayas, MG Marg, nearby lakes and Sikkimese culture.",
    description:
      "Gangtok is a mountain city with steep slopes, monasteries, viewpoints and panoramic views toward the surrounding Himalayan ranges.",
    history:
      "Gangtok developed as an important centre of the former Kingdom of Sikkim and became the capital of the modern state.",
    bestTime:
      "March to May and October to mid-December are commonly suitable for sightseeing and mountain views.",
    tags: [
      "Gangtok",
      "Sikkim",
      "Himalayas",
      "monasteries",
      "Buddhism",
      "mountains",
    ],
  },

  Darjeeling: {
    importance:
      "Darjeeling is an important hill station in West Bengal and a major centre of tea production and Himalayan tourism.",
    famousFor:
      "Darjeeling is famous for tea gardens, views of Kanchenjunga, the Darjeeling Himalayan Railway and colonial-era hill-town character.",
    description:
      "Darjeeling is a mountain town surrounded by tea estates and Himalayan landscapes with views toward some of the world's highest peaks.",
    history:
      "Darjeeling developed as a British-era hill station and became closely associated with the growth of tea cultivation and the Himalayan railway.",
    bestTime:
      "March to May and October to November are generally popular periods for clear mountain views and sightseeing.",
    tags: [
      "Darjeeling",
      "West Bengal",
      "tea",
      "Kanchenjunga",
      "toy train",
      "Himalayas",
    ],
  },

  Hampi: {
    importance:
      "Hampi is an important heritage destination in Karnataka and the archaeological remains of the former Vijayanagara capital.",
    famousFor:
      "Hampi is famous for ancient temples, monumental ruins, stone architecture, boulders, the Virupaksha Temple and Vijayanagara heritage.",
    description:
      "Hampi is an extensive archaeological landscape along the Tungabhadra River, containing temples, markets, royal structures and dramatic granite formations.",
    history:
      "Hampi was the capital of the Vijayanagara Empire and flourished as a major political, cultural and trading centre before its decline in the sixteenth century.",
    bestTime:
      "October to February is generally more comfortable for exploring Hampi's large outdoor archaeological areas.",
    tags: [
      "Hampi",
      "Karnataka",
      "Vijayanagara",
      "heritage",
      "temples",
      "archaeology",
    ],
  },

  Pondicherry: {
    importance:
      "Pondicherry, officially Puducherry, is an important coastal destination known for its French-influenced heritage and distinctive urban character.",
    famousFor:
      "Pondicherry is famous for French-style streets, colonial buildings, the Promenade, cafés, beaches and Sri Aurobindo Ashram.",
    description:
      "Pondicherry combines a coastal setting with historic French Quarter streets, colourful buildings, cafés and cultural attractions.",
    history:
      "Pondicherry was an important French colonial settlement and retains significant architectural and cultural influences from that period.",
    bestTime:
      "October to March is generally comfortable for walking around the heritage areas and exploring the coast.",
    tags: [
      "Pondicherry",
      "Puducherry",
      "Tamil Nadu coast",
      "French Quarter",
      "beach",
      "heritage",
    ],
  },
};

const destinations = indiaDestinations.map((place) => {
  const knowledge = destinationKnowledge[place.name];

  if (!knowledge) {
    throw new Error(
      `❌ Missing destination knowledge for: ${place.name}`
    );
  }

  return {
    name: place.name,
    state: place.state,
    category: place.category,

    importance: knowledge.importance,
    famousFor: knowledge.famousFor,
    description: knowledge.description,
    history: knowledge.history,
    bestTime: knowledge.bestTime,

    tags: knowledge.tags,

    knowledgeText: `
Destination: ${place.name}
State: ${place.state}
Category: ${place.category}

Why it is important:
${knowledge.importance}

Famous for:
${knowledge.famousFor}

Description:
${knowledge.description}

History:
${knowledge.history}

Best time to visit:
${knowledge.bestTime}

Tags:
${knowledge.tags.join(", ")}
`.trim(),

    images: [],
  };
});

await Destination.insertMany(destinations);

console.log(
  `🌴 ${destinations.length} destination knowledge records inserted`
);

console.log(
  "📍 Attraction knowledge will come from live place data"
);

console.log("=================================");
console.log("✅ RAG knowledge setup complete");
console.log("=================================");

await mongoose.disconnect();

console.log("🔌 MongoDB disconnected");