// English translations of the curriculum. Arrays follow the same order as the Tagalog
// source (vocabulary and quiz questions), so question IDs and answer positions match.
import type { Category } from "./types"

export interface TopicTranslation {
  title: string
  description: string
  lesson: {
    gradeLabel: string
    content: string
    summary: string
    vocabulary: Array<{ term: string; definition: string }>
  }
  quiz?: Array<{ question: string; options: string[]; explanation: string }>
}

export const gradesEn: Record<string, { title: string; subtitle: string }> = {
  "grade-7": { title: "Grade 7", subtitle: "Beginning with Literature and Culture" },
  "grade-8": { title: "Grade 8", subtitle: "Discover the History of the Philippines" },
  "grade-9": { title: "Grade 9", subtitle: "Economics and Social Development" },
  "grade-10": { title: "Grade 10", subtitle: "Talking About Social Issues" },
}

export const categoriesEn: Record<Category, string> = {
  Kasaysayan: "History",
  Kultura: "Culture",
  Heograpiya: "Geography",
  Ekonomiks: "Economics",
  Lipunan: "Society",
}

export const topicsEn: Record<string, TopicTranslation> = {
  "katangiang-pisikal-ng-timog-silangang-asya": {
    title: "Physical Features of Southeast Asia",
    description:
      "Study the geography, climate, landforms, and bodies of water of Southeast Asia.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Southeast Asia is a region made up of countries located between the Indian Ocean and the Pacific Ocean.\n\nIt is divided into two main parts: Mainland Southeast Asia and Maritime Southeast Asia.\n\nThe region has many different landforms and bodies of water. Many countries here experience monsoons because of their location.\n\nThe Philippines belongs to Maritime Southeast Asia and is made up of more than 7,000 islands. The region is also rich in biodiversity because of its tropical climate.\n\nThe region is also part of the Pacific Ring of Fire, so many places here have volcanoes and experience earthquakes.",
      summary:
        "Southeast Asia has a wide variety of physical features, climates, landforms, bodies of water, and natural resources.",
      vocabulary: [
        { term: "Pacific Ring of Fire", definition: "The area around the Pacific Ocean where many volcanoes and earthquakes occur." },
        { term: "Maritime Southeast Asia", definition: "The island or archipelagic part of Southeast Asia." },
        { term: "Southwest Monsoon", definition: "The seasonal wind from the southwest that brings rain to many parts of the Philippines." },
        { term: "Biodiversity", definition: "The variety of plants, animals, and other living organisms." },
      ],
    },
    quiz: [
      {
        question: "What are the two main parts of Southeast Asia?",
        options: ["Mainland and Maritime Southeast Asia", "East and West Asia", "North and South Asia", "Central and South Asia"],
        explanation: "Southeast Asia is divided into Mainland and Maritime Southeast Asia.",
      },
      {
        question: "Which region does the Philippines belong to?",
        options: ["Mainland Southeast Asia", "Maritime Southeast Asia", "Central Asia", "South Asia"],
        explanation: "The Philippines belongs to Maritime Southeast Asia.",
      },
      {
        question: "What is the Pacific Ring of Fire?",
        options: ["An area with many deserts", "An area with many volcanoes and earthquakes", "An area with many rivers", "An area with many glaciers"],
        explanation: "There are many volcanoes and earthquakes in the Pacific Ring of Fire.",
      },
      {
        question: "What is the Habagat?",
        options: ["Northeast monsoon", "Southwest monsoon", "Easterly wind", "Western storm"],
        explanation: "The Habagat is the southwest monsoon.",
      },
      {
        question: "Why were rivers important to ancient communities?",
        options: ["Because they provide water", "Because there is no land around them", "Because the climate is cold", "Because there are no plants"],
        explanation: "Rivers were important as a source of water and as a help in farming.",
      },
    ],
  },
  "sinaunang-kabihasnan-at-kultura": {
    title: "Ancient Civilizations and Culture",
    description: "Learn about the ancient civilizations and cultures that emerged in Asia.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Ancient civilizations emerged in different parts of Asia because of fertile land, enough water, and a suitable environment.\n\nImportant ancient civilizations include Mesopotamia, the Indus, the Huang He, and other communities that developed around rivers.\n\nThey developed their own systems of writing, religion, laws, art, and technology, which became the foundation of their societies.",
      summary:
        "Ancient civilizations developed through the relationship between people, the environment, agriculture, government, and culture.",
      vocabulary: [
        { term: "Civilization", definition: "An organized community with its own culture, government, economy, and way of life." },
        { term: "Mesopotamia", definition: "An ancient region located between the Tigris and Euphrates rivers." },
        { term: "Indus", definition: "An ancient civilization that emerged in the Indus River valley." },
        { term: "Huang He", definition: "An important river in China that became a center of ancient communities." },
      ],
    },
  },
  "kolonyalismo-at-imperyalismo-sa-asya": {
    title: "Colonialism and Imperialism in Asia",
    description: "Examine the causes, methods, and effects of colonialism and imperialism in Asia.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Colonialism refers to a powerful country establishing control over other lands and peoples.\n\nImperialism, meanwhile, is the broader policy of expanding a country's power and influence.\n\nMany European countries searched for new trade routes and products they could sell. Because of this, they reached different parts of Asia.\n\nColonialism had a major effect on the politics, economy, culture, religion, and way of life of Asians.",
      summary: "Colonialism and imperialism transformed many Asian societies.",
      vocabulary: [
        { term: "Colonialism", definition: "A system in which a powerful country controls other lands." },
        { term: "Imperialism", definition: "The policy of expanding a country's power and influence." },
        { term: "Colony", definition: "A territory controlled or governed by another country." },
        { term: "Colonial Government", definition: "A government established or run by a colonial power." },
      ],
    },
  },
  "mga-sinaunang-kabihasnan-sa-asya": {
    title: "Ancient Civilizations in Asia",
    description: "Discover the major ancient civilizations and their contributions.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Many ancient civilizations emerged in Asia. They were usually located near rivers because water was essential for farming, transportation, and daily life.\n\nIn Mesopotamia, cities developed between the Tigris and Euphrates. In South Asia, the Indus Civilization emerged.\n\nIn East Asia, ancient communities developed around the Huang He.",
      summary: "The ancient civilizations of Asia made important contributions to history.",
      vocabulary: [
        { term: "Mesopotamia", definition: "An ancient region between the Tigris and Euphrates." },
        { term: "Harappa", definition: "An important city of the Indus Civilization." },
        { term: "Mohenjo-daro", definition: "One of the major cities of the Indus Civilization." },
        { term: "Sumer", definition: "One of the ancient civilizations that emerged in Mesopotamia." },
      ],
    },
  },
  "pamumuhay-ng-mga-sinaunang-tao": {
    title: "The Way of Life of Early Humans",
    description: "Learn how early humans lived.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "The way of life of early humans was closely tied to their environment.\n\nIn the earliest times, they relied on hunting, fishing, gathering food, and eventually farming.\n\nWhen people learned to plant crops and raise animals, they began to stay in more permanent settlements.\n\nTheir tools, shelters, clothing, and ways of trading gradually improved.",
      summary: "The way of life of early humans changed from hunting and gathering to farming.",
      vocabulary: [
        { term: "Hunting", definition: "A way of getting food by catching animals." },
        { term: "Farming", definition: "Growing plants or crops for food and livelihood." },
        { term: "Community", definition: "A group of people living in one place." },
        { term: "Permanent Settlement", definition: "A community where people live steadily for a long time." },
      ],
    },
  },
  "relihiyon-at-paniniwala-sa-asya": {
    title: "Religions and Beliefs in Asia",
    description: "Examine the different religions and beliefs of ancient Asian societies.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Religion and belief played a major role in shaping ancient Asian societies.\n\nSeveral major religions and philosophical traditions emerged in Asia, such as Hinduism, Buddhism, Confucianism, and Taoism.\n\nThese influenced their laws, values, art, education, and relationships with others.",
      summary: "Religion and belief became an important part of the culture and way of life of ancient societies.",
      vocabulary: [
        { term: "Hinduism", definition: "One of the oldest religions, which originated in South Asia." },
        { term: "Buddhism", definition: "A religion based on the teachings of Siddhartha Gautama, the Buddha." },
        { term: "Confucianism", definition: "A philosophical tradition that emphasizes morality, family, and an orderly society." },
        { term: "Taoism", definition: "A philosophical tradition from ancient China that emphasizes harmony with the Tao." },
      ],
    },
  },
  "kabuhayan-at-kalakalan-sa-asya": {
    title: "Livelihood and Trade in Asia",
    description: "Study the main livelihoods and ancient trade routes of Asia.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "The livelihood of ancient Asians depended on their environment and natural resources.\n\nThis included farming, fishing, raising livestock, making tools, and trading.\n\nTrade became important in building connections between different communities.\n\nLand and sea routes became the way for exchanging goods, ideas, technology, religion, and culture.",
      summary: "Trade became an important way of exchanging goods, ideas, technology, and culture.",
      vocabulary: [
        { term: "Trade", definition: "The exchange of goods or services between people or communities." },
        { term: "Silk Road", definition: "An ancient network of trade routes that connected Asia with other regions." },
        { term: "Barter", definition: "The direct exchange of goods or services without using money." },
        { term: "Merchant", definition: "A person who takes part in buying, selling, or exchanging goods." },
      ],
    },
  },
  "mga-likas-na-yaman-ng-asya": {
    title: "The Natural Resources of Asia",
    description: "Discover the natural resources of Asia and why caring for them matters.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Asia is rich in many natural resources such as forests, water resources, mineral resources, oil, natural gas, and fertile land that can be used for agriculture.\n\nNatural resources are important for food, livelihood, industry, energy, and trade.\n\nCaring for nature is important to preserve resources that can be used by present and future generations.",
      summary: "The proper use and care of natural resources is important.",
      vocabulary: [
        { term: "Natural Resources", definition: "Resources that come from nature and can be used by people." },
        { term: "Mineral Resources", definition: "Minerals taken from the ground and used in various industries." },
        { term: "Water Resources", definition: "Bodies of water and the resources obtained from them." },
        { term: "Conservation", definition: "The proper care and use of natural resources." },
      ],
    },
  },
  "populasyon-at-pamayanan-sa-asya": {
    title: "Population and Communities in Asia",
    description: "Understand how population is distributed and how different communities form in Asia.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Population refers to the number of people living in a particular place.\n\nPopulation is not distributed evenly because it is affected by climate, landforms, access to water, livelihood, and job opportunities.\n\nAs population grows, the need for food, housing, education, jobs, transportation, and other services also increases.",
      summary: "Population distribution in Asia is affected by the environment, livelihood, and opportunities.",
      vocabulary: [
        { term: "Population", definition: "The number of people living in a place." },
        { term: "Distribution", definition: "The way a population is spread out or divided across a place." },
        { term: "Population Density", definition: "The number of people living in each unit of area of a place." },
        { term: "Urbanization", definition: "The process of cities growing and more people living in them." },
      ],
    },
  },
  "kultura-at-pagkakakilanlan-ng-mga-asyano": {
    title: "Culture and Identity of Asians",
    description: "Get to know the diversity of Asian cultures and identities.",
    lesson: {
      gradeLabel: "Grade 7",
      content:
        "Culture is made up of the customs, traditions, language, art, beliefs, values, and way of life of a group of people.\n\nAsia shows an enormous diversity of cultures. Each country and community has its own traditions, food, clothing, music, dance, art, and ways of relating to others.\n\nIt is important to respect the cultures of others and to recognize one's own culture.",
      summary: "Culture is an important part of the identity of a person and a community.",
      vocabulary: [
        { term: "Culture", definition: "The whole of beliefs, customs, traditions, art, and way of life." },
        { term: "Tradition", definition: "Customs passed down from one generation to the next." },
        { term: "Identity", definition: "The characteristics that make a person or group recognizable." },
        { term: "Diversity", definition: "Having different characteristics, cultures, beliefs, and ways of life." },
      ],
    },
  },
  "ang-rebolusyong-pilipino-at-pambansang-kamalayan": {
    title: "The Philippine Revolution and National Consciousness",
    description: "Study the Philippine Revolution and the rise of national consciousness.",
    lesson: {
      gradeLabel: "Grade 8",
      content:
        "The Philippine Revolution is an important part of Philippine history that aimed to end Spanish colonial rule.\n\nThe rise of national consciousness and the unity of Filipinos were important in this.\n\nThe reform movements and the revolution showed the Filipinos' desire for change and self-government.",
      summary: "The Philippine Revolution was an important step in forming national consciousness.",
      vocabulary: [
        { term: "Revolution", definition: "A major change in a system of government or society, often the result of widespread action." },
        { term: "National Consciousness", definition: "Recognizing oneself and being united as one nation." },
      ],
    },
    quiz: [
      {
        question: "What was the main goal of the Philippine Revolution?",
        options: ["To expand Philippine territory", "To end colonial rule", "To have a new religion", "To strengthen trade"],
        explanation: "The revolution aimed to end colonial rule.",
      },
      {
        question: "What important concept emerged during this period?",
        options: ["National consciousness", "Feudalism", "Mercantilism", "Nomadism"],
        explanation: "Forming a national consciousness became important.",
      },
      {
        question: "What does revolution mean?",
        options: ["Only a small change", "A major change in society or government", "The exchange of goods", "Moving to a new home"],
        explanation: "A revolution is a major change in the system of society or government.",
      },
      {
        question: "What did the revolutionary movements show?",
        options: ["A desire for change", "Acceptance of colonialism", "Avoidance of education", "Expansion of territory"],
        explanation: "The revolutionary movements showed a desire for change.",
      },
      {
        question: "What does national consciousness mean?",
        options: ["Recognition as one nation", "The study of trade", "Following another country", "Traveling to other places"],
        explanation: "National consciousness is recognition and unity as one nation.",
      },
    ],
  },
  "pag-usbong-ng-sinaunang-kabihasnan-sa-daigdig": {
    title: "The Rise of Ancient Civilizations in the World",
    description: "Discover how ancient civilizations around the world emerged and developed.",
    lesson: {
      gradeLabel: "Grade 8",
      content:
        "Civilization emerged when people learned to settle permanently, grow crops, and form organized communities.\n\n" +
        "Most of the world's first civilizations emerged in river valleys: Mesopotamia between the Tigris and Euphrates, Egypt beside the Nile, the Indus in South Asia, and China beside the Huang He.\n\n" +
        "Rivers were important because they provided water for irrigation, fertile soil whenever they flooded, and a route for transportation and trade.\n\n" +
        "In Mesoamerica, the Olmec and Maya civilizations emerged because of fertile land and the cultivation of corn.\n\n" +
        "As agriculture developed, cities, governments, religions, job specialization, and writing systems such as cuneiform and hieroglyphics were formed.",
      summary:
        "Ancient civilizations emerged in places with enough water and fertile land, which led to cities, governments, and writing systems.",
      vocabulary: [
        { term: "River Valley", definition: "Low land around a river that is usually fertile and suitable for farming." },
        { term: "Irrigation", definition: "A system of bringing water to farms so crops can grow." },
        { term: "Cuneiform", definition: "The writing system of Mesopotamia that used wedge-shaped marks on clay." },
        { term: "Hieroglyphics", definition: "The writing system of ancient Egypt that used pictures and symbols." },
        { term: "Mesoamerica", definition: "A region in the central part of the Americas where the Olmec and Maya civilizations emerged." },
      ],
    },
    quiz: [
      {
        question: "Where did the world's first civilizations usually emerge?",
        options: ["In river valleys", "In deserts without water", "On icy mountaintops", "In the middle of the ocean"],
        explanation: "Most of the first civilizations emerged in river valleys because of water and fertile land.",
      },
      {
        question: "Which river was the center of Egyptian civilization?",
        options: ["Huang He", "Nile", "Indus", "Euphrates"],
        explanation: "Egyptian civilization emerged beside the Nile River.",
      },
      {
        question: "What writing system was developed in Mesopotamia?",
        options: ["Hieroglyphics", "Baybayin", "Cuneiform", "Latin alphabet"],
        explanation: "Cuneiform was the writing system of Mesopotamia.",
      },
      {
        question: "Why was river flooding important to ancient farmers?",
        options: ["It destroys all crops", "It leaves behind fertile soil", "It dries out the land", "It stops trade"],
        explanation: "River flooding leaves fertile soil behind, so farming thrives.",
      },
      {
        question: "Which civilization emerged in Mesoamerica?",
        options: ["Sumer", "Harappa", "Shang", "Maya"],
        explanation: "The Maya and Olmec are civilizations that emerged in Mesoamerica.",
      },
    ],
  },
  "pangunahing-konsepto-ng-ekonomiks-at-kakapusan": {
    title: "Basic Concepts of Economics and Scarcity",
    description: "Learn the basic concepts of economics and the problem of scarcity.",
    lesson: {
      gradeLabel: "Grade 9",
      content:
        "Economics is a social science that studies how people and society use and divide limited resources to meet endless needs and wants.\n\n" +
        "Scarcity (kakapusan) is the central problem of economics. It exists because natural resources, labor, capital, and time are limited, while human needs keep growing.\n\n" +
        "It is different from a shortage (kakulangan), which is a temporary lack of a product in the market because of a disaster, hoarding, or a production problem.\n\n" +
        "Because of scarcity, wise decisions must be made. A trade-off is choosing one thing in exchange for another, and opportunity cost is the value of the best alternative given up.\n\n" +
        "To address scarcity, every society answers four basic economic questions: What to produce? How to produce? For whom to produce? How much to produce?",
      summary:
        "Because of scarcity, people and society must choose and decide wisely how to use limited resources.",
      vocabulary: [
        { term: "Economics", definition: "A social science that studies the wise use of limited resources." },
        { term: "Scarcity", definition: "A long-term condition in which resources are limited compared to human needs." },
        { term: "Shortage", definition: "A temporary lack of a product in the market." },
        { term: "Trade-off", definition: "Choosing or giving up one thing in exchange for another." },
        { term: "Opportunity Cost", definition: "The value of the best alternative given up when making a decision." },
      ],
    },
    quiz: [
      {
        question: "What is the central problem studied in economics?",
        options: ["Scarcity", "Abundance", "Colonialism", "Urbanization"],
        explanation: "Scarcity is the central problem of economics.",
      },
      {
        question: "What is the value of the best alternative given up when making a choice called?",
        options: ["Trade-off", "Opportunity cost", "Income", "Tax"],
        explanation: "Opportunity cost is the value of the best alternative given up.",
      },
      {
        question: "How is a shortage different from scarcity?",
        options: ["A shortage is permanent", "They are exactly the same", "A shortage is only temporary", "A shortage is only about time"],
        explanation: "A shortage is temporary, while scarcity is a long-term condition.",
      },
      {
        question: "Which is NOT one of the four basic economic questions?",
        options: ["What to produce?", "How to produce?", "For whom to produce?", "Who is the richest?"],
        explanation: "The four questions are: what, how, for whom, and how much to produce.",
      },
      {
        question: "Why do people and society need to make wise decisions?",
        options: [
          "Because resources are limited but needs are endless",
          "Because natural resources are unlimited",
          "Because people have only one need",
          "Because production is no longer needed",
        ],
        explanation: "Because of scarcity, we must choose how to use limited resources.",
      },
    ],
  },
  "mga-suliraning-pangkapaligiran-at-disaster-risk": {
    title: "Environmental Problems and Disaster Risk",
    description: "Discuss environmental problems and the importance of disaster risk reduction.",
    lesson: {
      gradeLabel: "Grade 10",
      content:
        "The Philippines is one of the countries most exposed to disasters because it lies in the Pacific Ring of Fire and in the path of typhoons in the Western Pacific.\n\n" +
        "The major environmental problems include solid waste, air and water pollution, deforestation, and climate change, which makes typhoons and flooding worse.\n\n" +
        "A hazard is a threat such as a typhoon, earthquake, or volcanic eruption. It becomes a disaster when it severely affects the lives, property, and livelihood of a community.\n\n" +
        "Vulnerability is a community's weakness in facing a hazard, while capacity is its ability to prepare, respond, and recover.\n\n" +
        "Disaster Risk Reduction and Management (DRRM) aims to reduce risk through four phases: prevention and mitigation, preparedness, response, and rehabilitation and recovery. In the Philippines, this is set by Republic Act 10121.",
      summary:
        "Proper preparation and care for the environment reduce the risks and damage caused by disasters.",
      vocabulary: [
        { term: "Hazard", definition: "A threat or event that can cause harm, such as a typhoon, earthquake, or volcanic eruption." },
        { term: "Vulnerability", definition: "A community's weakness or lack of means to face the effects of a hazard." },
        { term: "Capacity", definition: "A community's ability to prepare for, respond to, and recover from a disaster." },
        { term: "Climate Change", definition: "Long-term change in the Earth's temperature and weather." },
        { term: "DRRM", definition: "A systematic approach to reducing and managing disaster risk." },
      ],
    },
    quiz: [
      {
        question: "Why does the Philippines often experience disasters?",
        options: [
          "Because it is far from the ocean",
          "Because it is in the Pacific Ring of Fire and the path of typhoons",
          "Because it has no mountains",
          "Because its climate is cold all year",
        ],
        explanation: "The Philippines lies in the Pacific Ring of Fire and the path of typhoons.",
      },
      {
        question: "What do you call a threat such as a typhoon, earthquake, or volcanic eruption?",
        options: ["Capacity", "Recovery", "Hazard", "Vulnerability"],
        explanation: "A hazard is a threat or event that can cause harm.",
      },
      {
        question: "What does capacity mean in DRRM?",
        options: [
          "A community's ability to prepare, respond, and recover",
          "The amount of rain in a year",
          "The size of a city's population",
          "The number of typhoons that pass",
        ],
        explanation: "Capacity is a community's ability to face and recover from a disaster.",
      },
      {
        question: "Which law sets DRRM in the Philippines?",
        options: ["RA 9003", "RA 8749", "RA 7610", "RA 10121"],
        explanation: "Republic Act 10121 is the Philippine Disaster Risk Reduction and Management Act.",
      },
      {
        question: "Which is an example of preparedness?",
        options: [
          "Preparing an emergency go-bag and evacuation plan",
          "Throwing garbage into the river",
          "Cutting down trees on the mountain",
          "Ignoring PAGASA warnings",
        ],
        explanation: "Preparing a go-bag and evacuation plan before a disaster is part of preparedness.",
      },
    ],
  },
}
