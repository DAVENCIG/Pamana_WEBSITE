// Content imported verbatim from the PAMANA Android app
// (app/src/main/java/com/owli/pamana/data/DatabaseSeeder.java -> seedDatabase()).
// Topic IDs are stable slugs instead of SQLite auto-increment IDs.
import type { Grade, SourceTopic } from "./types"

export const androidGrades: Grade[] = [
  {
    id: "grade-7",
    number: 7,
    title: "Grade 7",
    subtitle: "Pagsisimula sa Panitikan at Kultura",
    image: "banaue",
  },
  {
    id: "grade-8",
    number: 8,
    title: "Grade 8",
    subtitle: "Tuklasin ang Kasaysayan ng Pilipinas",
    image: "intramuros",
  },
  {
    id: "grade-9",
    number: 9,
    title: "Grade 9",
    subtitle: "Ekonomiks at Pag-unlad ng Lipunan",
    image: "manilaCathedral",
  },
  {
    id: "grade-10",
    number: 10,
    title: "Grade 10",
    subtitle: "Pag-usapan ang mga Isyu sa Lipunan",
    image: "festival",
  },
]

export const androidTopics: SourceTopic[] = [
  {
    id: "katangiang-pisikal-ng-timog-silangang-asya",
    gradeId: "grade-7",
    title: "Katangiang Pisikal ng Timog-Silangang Asya",
    description:
      "Pag-aralan ang heograpiya, klima, at anyong lupa at tubig sa Timog-Silangang Asya.",
    category: "Heograpiya",
    image: "banaue",
    lesson: {
      title: "Katangiang Pisikal ng Timog-Silangang Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 15,
      content:
        "Ang Timog-Silangang Asya ay isang rehiyon na binubuo ng mga bansang matatagpuan sa pagitan ng Indian Ocean at Pacific Ocean.\n\nNahati ito sa dalawang pangunahing bahagi: Mainland Southeast Asia at Maritime Southeast Asia.\n\nAng rehiyon ay may iba't ibang anyong lupa at anyong tubig. Maraming bansa rito ang nakararanas ng monsoon dahil sa lokasyon nito.\n\nAng Pilipinas ay kabilang sa Maritime Southeast Asia at binubuo ng mahigit 7,000 isla. Mayaman din ang rehiyon sa biodiversity dahil sa tropikal na klima nito.\n\nBahagi rin ng rehiyon ang Pacific Ring of Fire kaya maraming lugar dito ang may mga bulkan at nakararanas ng lindol.",
      summary:
        "Ang Timog-Silangang Asya ay may iba't ibang katangiang pisikal, klima, anyong lupa, anyong tubig, at likas na yaman.",
      vocabulary: [
        {
          term: "Pacific Ring of Fire",
          definition:
            "Lugar sa paligid ng Pacific Ocean kung saan maraming bulkan at lindol.",
        },
        {
          term: "Maritime Southeast Asia",
          definition: "Bahaging insular o kapuluan ng Timog-Silangang Asya.",
        },
        {
          term: "Habagat",
          definition:
            "Timog-kanlurang monsoon na nagdadala ng ulan sa maraming bahagi ng Pilipinas.",
        },
        {
          term: "Biodiversity",
          definition:
            "Pagkakaiba-iba ng mga halaman, hayop, at iba pang buhay na organismo.",
        },
      ],
    },
    quiz: [
      {
        question:
          "Ano ang dalawang pangunahing bahagi ng Timog-Silangang Asya?",
        options: [
          "Mainland at Maritime Southeast Asia",
          "East at West Asia",
          "North at South Asia",
          "Central at South Asia",
        ],
        correctIndex: 0,
        explanation:
          "Ang Timog-Silangang Asya ay nahahati sa Mainland at Maritime Southeast Asia.",
      },
      {
        question: "Anong rehiyon ang kinabibilangan ng Pilipinas?",
        options: [
          "Mainland Southeast Asia",
          "Maritime Southeast Asia",
          "Central Asia",
          "South Asia",
        ],
        correctIndex: 1,
        explanation: "Ang Pilipinas ay kabilang sa Maritime Southeast Asia.",
      },
      {
        question: "Ano ang Pacific Ring of Fire?",
        options: [
          "Lugar na maraming disyerto",
          "Lugar na maraming bulkan at lindol",
          "Lugar na maraming ilog",
          "Lugar na maraming glacier",
        ],
        correctIndex: 1,
        explanation: "Maraming bulkan at lindol sa Pacific Ring of Fire.",
      },
      {
        question: "Ano ang Habagat?",
        options: [
          "Hilagang-silangang monsoon",
          "Timog-kanlurang monsoon",
          "Silangang hangin",
          "Kanlurang bagyo",
        ],
        correctIndex: 1,
        explanation: "Ang Habagat ay timog-kanlurang monsoon.",
      },
      {
        question: "Bakit mahalaga ang mga ilog sa sinaunang pamayanan?",
        options: [
          "Dahil nagbibigay ito ng tubig",
          "Dahil walang lupa sa paligid nito",
          "Dahil malamig ang klima",
          "Dahil walang halaman",
        ],
        correctIndex: 0,
        explanation:
          "Mahalaga ang ilog bilang pinagkukunan ng tubig at tulong sa pagsasaka.",
      },
    ],
  },
  {
    id: "sinaunang-kabihasnan-at-kultura",
    gradeId: "grade-7",
    title: "Sinaunang Kabihasnan at Kultura",
    description:
      "Alamin ang mga sinaunang kabihasnan at kultura na umusbong sa Asya.",
    category: "Kultura",
    image: "angkor",
    lesson: {
      title: "Sinaunang Kabihasnan at Kultura",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang mga sinaunang kabihasnan ay umusbong sa iba't ibang bahagi ng Asya dahil sa pagkakaroon ng matabang lupain, sapat na tubig, at angkop na kapaligiran.\n\nKabilang sa mahahalagang sinaunang kabihasnan ang Mesopotamia, Indus, Huang He, at iba pang pamayanang umunlad sa paligid ng mga ilog.\n\nNagkaroon sila ng sariling sistema ng pagsulat, relihiyon, batas, sining, at teknolohiya na naging pundasyon ng kanilang mga lipunan.",
      summary:
        "Ang mga sinaunang kabihasnan ay umunlad dahil sa ugnayan ng tao, kapaligiran, agrikultura, pamahalaan, at kultura.",
      vocabulary: [
        {
          term: "Kabihasnan",
          definition:
            "Organisadong pamayanan na may sariling kultura, pamahalaan, ekonomiya, at sistema ng pamumuhay.",
        },
        {
          term: "Mesopotamia",
          definition:
            "Sinaunang rehiyon na matatagpuan sa pagitan ng mga ilog Tigris at Euphrates.",
        },
        {
          term: "Indus",
          definition:
            "Sinaunang kabihasnang umusbong sa lambak ng Indus River.",
        },
        {
          term: "Huang He",
          definition:
            "Mahalagang ilog sa China na naging sentro ng mga sinaunang pamayanan.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "kolonyalismo-at-imperyalismo-sa-asya",
    gradeId: "grade-7",
    title: "Kolonyalismo at Imperyalismo sa Asya",
    description:
      "Suriin ang mga dahilan, pamamaraan, at epekto ng kolonyalismo at imperyalismo sa Asya.",
    category: "Kasaysayan",
    image: "intramuros",
    lesson: {
      title: "Kolonyalismo at Imperyalismo sa Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang kolonyalismo ay tumutukoy sa pagtatatag ng kontrol ng isang makapangyarihang bansa sa ibang lupain at mamamayan.\n\nSamantala, ang imperyalismo ay mas malawak na patakaran ng pagpapalawak ng kapangyarihan at impluwensya ng isang bansa.\n\nMaraming bansang Europeo ang naghanap ng bagong rutang pangkalakalan at mga produktong maaaring ipagbili. Dahil dito, nakarating sila sa iba't ibang bahagi ng Asya.\n\nNagkaroon ng malaking epekto ang kolonyalismo sa politika, ekonomiya, kultura, relihiyon, at pamumuhay ng mga Asyano.",
      summary:
        "Binago ng kolonyalismo at imperyalismo ang maraming lipunang Asyano.",
      vocabulary: [
        {
          term: "Kolonyalismo",
          definition:
            "Sistema kung saan kinokontrol ng isang makapangyarihang bansa ang ibang lupain.",
        },
        {
          term: "Imperyalismo",
          definition:
            "Patakaran ng pagpapalawak ng kapangyarihan at impluwensya ng isang bansa.",
        },
        {
          term: "Kolonya",
          definition: "Teritoryong kontrolado o pinamamahalaan ng ibang bansa.",
        },
        {
          term: "Kolonyal na Pamahalaan",
          definition:
            "Pamahalaang itinatag o pinamamahalaan ng isang kolonyal na kapangyarihan.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "mga-sinaunang-kabihasnan-sa-asya",
    gradeId: "grade-7",
    title: "Mga Sinaunang Kabihasnan sa Asya",
    description:
      "Tuklasin ang mga pangunahing sinaunang kabihasnan at ang kanilang mga ambag.",
    category: "Kasaysayan",
    image: "greatWall",
    lesson: {
      title: "Mga Sinaunang Kabihasnan sa Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Maraming sinaunang kabihasnan ang umusbong sa Asya. Ang mga ito ay karaniwang matatagpuan malapit sa mga ilog dahil mahalaga ang tubig sa pagsasaka, transportasyon, at pang-araw-araw na pamumuhay.\n\nSa Mesopotamia, umunlad ang mga lungsod sa pagitan ng Tigris at Euphrates. Sa Timog Asya naman, umusbong ang Kabihasnang Indus.\n\nSa Silangang Asya, umunlad ang mga sinaunang pamayanan sa paligid ng Huang He.",
      summary:
        "Ang mga sinaunang kabihasnan sa Asya ay nagbigay ng mahahalagang ambag sa kasaysayan.",
      vocabulary: [
        {
          term: "Mesopotamia",
          definition: "Sinaunang rehiyon sa pagitan ng Tigris at Euphrates.",
        },
        {
          term: "Harappa",
          definition: "Mahalagang lungsod ng Kabihasnang Indus.",
        },
        {
          term: "Mohenjo-daro",
          definition: "Isa sa mga pangunahing lungsod ng Kabihasnang Indus.",
        },
        {
          term: "Sumer",
          definition:
            "Isa sa mga sinaunang kabihasnang umusbong sa Mesopotamia.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "pamumuhay-ng-mga-sinaunang-tao",
    gradeId: "grade-7",
    title: "Pamumuhay ng mga Sinaunang Tao",
    description: "Alamin ang paraan ng pamumuhay ng mga sinaunang tao.",
    category: "Kultura",
    image: "pottery",
    lesson: {
      title: "Pamumuhay ng mga Sinaunang Tao",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang pamumuhay ng mga sinaunang tao ay malapit na nakaugnay sa kanilang kapaligiran.\n\nSa mga unang panahon, umaasa sila sa pangangaso, pangingisda, pangangalap ng pagkain, at kalaunan ay pagsasaka.\n\nNang matutunan ng mga tao ang pagtatanim at pag-aalaga ng hayop, nagsimula silang manatili sa mas permanenteng pamayanan.\n\nUnti-unting umunlad ang kanilang mga kasangkapan, tirahan, pananamit, at paraan ng pakikipagkalakalan.",
      summary:
        "Nagbago ang pamumuhay ng mga sinaunang tao mula sa pangangaso at pangangalap tungo sa pagsasaka.",
      vocabulary: [
        {
          term: "Pangangaso",
          definition:
            "Paraan ng pagkuha ng pagkain sa pamamagitan ng paghuli ng mga hayop.",
        },
        {
          term: "Pagsasaka",
          definition:
            "Pagpapalago ng mga halaman o pananim para sa pagkain at kabuhayan.",
        },
        {
          term: "Pamayanan",
          definition: "Pangkat ng mga taong naninirahan sa isang lugar.",
        },
        {
          term: "Permanenteng Pamayanan",
          definition:
            "Pamayanang matatag na tinitirhan ng mga tao sa mahabang panahon.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "relihiyon-at-paniniwala-sa-asya",
    gradeId: "grade-7",
    title: "Relihiyon at Paniniwala sa Asya",
    description:
      "Suriin ang iba't ibang relihiyon at paniniwala sa mga sinaunang lipunang Asyano.",
    category: "Kultura",
    image: "monks",
    lesson: {
      title: "Relihiyon at Paniniwala sa Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Malaki ang naging papel ng relihiyon at paniniwala sa paghubog ng mga sinaunang lipunang Asyano.\n\nSa Asya umusbong ang ilang pangunahing relihiyon at tradisyong pilosopikal tulad ng Hinduismo, Budismo, Confucianism, at Taoism.\n\nAng mga ito ay nakaimpluwensya sa kanilang mga batas, pagpapahalaga, sining, edukasyon, at pakikipagkapwa.",
      summary:
        "Ang relihiyon at paniniwala ay naging mahalagang bahagi ng kultura at pamumuhay ng mga sinaunang lipunan.",
      vocabulary: [
        {
          term: "Hinduismo",
          definition:
            "Isa sa mga pinakamatandang relihiyon na nagmula sa Timog Asya.",
        },
        {
          term: "Budismo",
          definition:
            "Relihiyong nakabatay sa mga aral ni Siddhartha Gautama o Buddha.",
        },
        {
          term: "Confucianism",
          definition:
            "Tradisyong pilosopikal na nagbibigay-diin sa moralidad, pamilya, at maayos na lipunan.",
        },
        {
          term: "Taoism",
          definition:
            "Tradisyong pilosopikal na nagmula sa sinaunang China at nagbibigay-diin sa pagkakaisa sa Tao.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "kabuhayan-at-kalakalan-sa-asya",
    gradeId: "grade-7",
    title: "Kabuhayan at Kalakalan sa Asya",
    description:
      "Pag-aralan ang mga pangunahing kabuhayan at sinaunang rutang pangkalakalan sa Asya.",
    category: "Ekonomiks",
    image: "floatingMarket",
    lesson: {
      title: "Kabuhayan at Kalakalan sa Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang kabuhayan ng mga sinaunang Asyano ay nakadepende sa kanilang kapaligiran at mga likas na yaman.\n\nKabilang dito ang pagsasaka, pangingisda, paghahayupan, paggawa ng kagamitan, at pakikipagkalakalan.\n\nNaging mahalaga ang kalakalan sa pagkakaroon ng ugnayan ng iba't ibang pamayanan.\n\nAng mga rutang panlupa at pandagat ay naging daan para sa pagpapalitan ng produkto, ideya, teknolohiya, relihiyon, at kultura.",
      summary:
        "Ang kalakalan ay naging mahalagang paraan ng pagpapalitan ng produkto, ideya, teknolohiya, at kultura.",
      vocabulary: [
        {
          term: "Kalakalan",
          definition:
            "Pagpapalitan ng produkto o serbisyo sa pagitan ng mga tao o pamayanan.",
        },
        {
          term: "Silk Road",
          definition:
            "Sinaunang network ng mga rutang pangkalakalan na nag-ugnay sa Asya at iba pang rehiyon.",
        },
        {
          term: "Barter",
          definition:
            "Direktang pagpapalitan ng produkto o serbisyo nang hindi gumagamit ng salapi.",
        },
        {
          term: "Mangangalakal",
          definition:
            "Taong nakikilahok sa pagbili, pagbebenta, o pagpapalitan ng mga produkto.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "mga-likas-na-yaman-ng-asya",
    gradeId: "grade-7",
    title: "Mga Likas na Yaman ng Asya",
    description:
      "Tuklasin ang mga likas na yaman ng Asya at ang kahalagahan ng pangangalaga sa mga ito.",
    category: "Heograpiya",
    image: "palawan",
    lesson: {
      title: "Mga Likas na Yaman ng Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang Asya ay mayaman sa iba't ibang likas na yaman tulad ng kagubatan, yamang tubig, yamang mineral, langis, natural gas, at matabang lupang maaaring gamitin sa agrikultura.\n\nAng mga likas na yaman ay mahalaga sa pagkain, kabuhayan, industriya, enerhiya, at kalakalan.\n\nMahalaga ang pangangalaga sa kalikasan upang mapanatili ang mga yamang maaaring gamitin ng kasalukuyan at susunod na henerasyon.",
      summary:
        "Ang wastong paggamit at pangangalaga sa likas na yaman ay mahalaga.",
      vocabulary: [
        {
          term: "Likas na Yaman",
          definition:
            "Mga yamang nagmumula sa kalikasan na maaaring gamitin ng tao.",
        },
        {
          term: "Yamang Mineral",
          definition:
            "Mga mineral na nakukuha mula sa lupa at ginagamit sa iba't ibang industriya.",
        },
        {
          term: "Yamang Tubig",
          definition: "Mga anyong tubig at yamang nakukuha mula sa mga ito.",
        },
        {
          term: "Konserbasyon",
          definition: "Wastong pangangalaga at paggamit ng likas na yaman.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "populasyon-at-pamayanan-sa-asya",
    gradeId: "grade-7",
    title: "Populasyon at Pamayanan sa Asya",
    description:
      "Unawain ang distribusyon ng populasyon at pagbuo ng iba't ibang pamayanan sa Asya.",
    category: "Heograpiya",
    image: "cityCrowd",
    lesson: {
      title: "Populasyon at Pamayanan sa Asya",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang populasyon ay tumutukoy sa bilang ng mga taong naninirahan sa isang partikular na lugar.\n\nHindi pantay ang distribusyon ng populasyon dahil naaapektuhan ito ng klima, anyong lupa, pagkakaroon ng tubig, kabuhayan, at oportunidad sa trabaho.\n\nHabang lumalaki ang populasyon, tumataas din ang pangangailangan para sa pagkain, tirahan, edukasyon, trabaho, transportasyon, at iba pang serbisyo.",
      summary:
        "Ang distribusyon ng populasyon sa Asya ay naaapektuhan ng kapaligiran, kabuhayan, at oportunidad.",
      vocabulary: [
        {
          term: "Populasyon",
          definition: "Bilang ng mga taong naninirahan sa isang lugar.",
        },
        {
          term: "Distribusyon",
          definition:
            "Paraan ng pagkakakalat o pagkakabahagi ng populasyon sa isang lugar.",
        },
        {
          term: "Densidad ng Populasyon",
          definition:
            "Bilang ng tao na naninirahan sa bawat yunit ng lawak ng isang lugar.",
        },
        {
          term: "Urbanisasyon",
          definition:
            "Proseso ng paglaki ng mga lungsod at pagdami ng mga taong naninirahan dito.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "kultura-at-pagkakakilanlan-ng-mga-asyano",
    gradeId: "grade-7",
    title: "Kultura at Pagkakakilanlan ng mga Asyano",
    description:
      "Kilalanin ang pagkakaiba-iba ng kultura at pagkakakilanlan ng mga Asyano.",
    category: "Kultura",
    image: "festival",
    lesson: {
      title: "Kultura at Pagkakakilanlan ng mga Asyano",
      gradeLabel: "Baitang 7",
      durationMinutes: 10,
      content:
        "Ang kultura ay binubuo ng mga kaugalian, tradisyon, wika, sining, paniniwala, pagpapahalaga, at paraan ng pamumuhay ng isang pangkat ng tao.\n\nMakikita sa Asya ang napakalaking pagkakaiba-iba ng kultura. Bawat bansa at pamayanan ay may sariling mga tradisyon, pagkain, kasuotan, musika, sayaw, sining, at paraan ng pakikipag-ugnayan.\n\nMahalaga ang paggalang sa kultura ng ibang tao at pagkilala sa sariling kultura.",
      summary:
        "Ang kultura ay mahalagang bahagi ng pagkakakilanlan ng isang tao at pamayanan.",
      vocabulary: [
        {
          term: "Kultura",
          definition:
            "Kabuuan ng mga paniniwala, kaugalian, tradisyon, sining, at paraan ng pamumuhay.",
        },
        {
          term: "Tradisyon",
          definition:
            "Mga kaugaliang ipinapasa mula sa isang henerasyon patungo sa susunod.",
        },
        {
          term: "Pagkakakilanlan",
          definition:
            "Mga katangiang nagbibigay ng pagkilala sa isang tao o pangkat.",
        },
        {
          term: "Pagkakaiba-iba",
          definition:
            "Pagkakaroon ng iba't ibang katangian, kultura, paniniwala, at paraan ng pamumuhay.",
        },
      ],
    },
    quiz: [],
  },
  {
    id: "ang-rebolusyong-pilipino-at-pambansang-kamalayan",
    gradeId: "grade-8",
    title: "Ang Rebolusyong Pilipino at Pambansang Kamalayan",
    description:
      "Pag-aralan ang Rebolusyong Pilipino at ang pag-usbong ng pambansang kamalayan.",
    category: "Kasaysayan",
    image: "rizalMonument",
    lesson: {
      title: "Ang Rebolusyong Pilipino at Pambansang Kamalayan",
      gradeLabel: "Baitang 8",
      durationMinutes: 15,
      content:
        "Ang Rebolusyong Pilipino ay isang mahalagang bahagi ng kasaysayan ng Pilipinas na naglalayong wakasan ang kolonyal na pamamahala ng Espanya.\n\nNaging mahalaga rito ang pag-usbong ng kamalayang pambansa at pagkakaisa ng mga Pilipino.\n\nAng mga kilusang reporma at rebolusyon ay nagpakita ng pagnanais ng mga Pilipino para sa pagbabago at sariling pamamahala.",
      summary:
        "Ang Rebolusyong Pilipino ay naging mahalagang hakbang sa pagbuo ng pambansang kamalayan.",
      vocabulary: [
        {
          term: "Rebolusyon",
          definition:
            "Malaking pagbabago sa sistema ng pamahalaan o lipunan, kadalasang bunga ng malawakang pagkilos.",
        },
        {
          term: "Pambansang Kamalayan",
          definition:
            "Pagkakaroon ng pagkilala at pagkakaisa bilang isang bansa.",
        },
      ],
    },
    quiz: [
      {
        question: "Ano ang pangunahing layunin ng Rebolusyong Pilipino?",
        options: [
          "Palawakin ang teritoryo ng Pilipinas",
          "Wakasan ang kolonyal na pamamahala",
          "Magkaroon ng bagong relihiyon",
          "Palakasin ang kalakalan",
        ],
        correctIndex: 1,
        explanation:
          "Layunin ng rebolusyon na wakasan ang kolonyal na pamamahala.",
      },
      {
        question: "Ano ang mahalagang konseptong umusbong sa panahong ito?",
        options: [
          "Pambansang kamalayan",
          "Pyudalismo",
          "Mercantilismo",
          "Nomadismo",
        ],
        correctIndex: 0,
        explanation: "Naging mahalaga ang pagbuo ng pambansang kamalayan.",
      },
      {
        question: "Ano ang ibig sabihin ng rebolusyon?",
        options: [
          "Maliit na pagbabago lamang",
          "Malaking pagbabago sa lipunan o pamahalaan",
          "Pagpapalitan ng produkto",
          "Paglipat ng tirahan",
        ],
        correctIndex: 1,
        explanation:
          "Ang rebolusyon ay malaking pagbabago sa sistema ng lipunan o pamahalaan.",
      },
      {
        question: "Ano ang ipinakita ng mga kilusang rebolusyonaryo?",
        options: [
          "Pagnanais para sa pagbabago",
          "Pagtanggap sa kolonyalismo",
          "Pag-iwas sa edukasyon",
          "Pagpapalawak ng teritoryo",
        ],
        correctIndex: 0,
        explanation:
          "Ipinakita ng mga kilusang rebolusyonaryo ang pagnanais para sa pagbabago.",
      },
      {
        question: "Ano ang ibig sabihin ng pambansang kamalayan?",
        options: [
          "Pagkilala bilang isang bansa",
          "Pag-aaral ng kalakalan",
          "Pagsunod sa ibang bansa",
          "Paglalakbay sa ibang lugar",
        ],
        correctIndex: 0,
        explanation:
          "Ang pambansang kamalayan ay pagkilala at pagkakaisa bilang isang bansa.",
      },
    ],
  },
  {
    id: "pag-usbong-ng-sinaunang-kabihasnan-sa-daigdig",
    gradeId: "grade-8",
    title: "Pag-usbong ng Sinaunang Kabihasnan sa Daigdig",
    description:
      "Tuklasin kung paano umusbong at umunlad ang mga sinaunang kabihasnan sa daigdig.",
    category: "Heograpiya",
    image: "pyramids",
    quiz: [],
  },
  {
    id: "pangunahing-konsepto-ng-ekonomiks-at-kakapusan",
    gradeId: "grade-9",
    title: "Pangunahing Konsepto ng Ekonomiks at Kakapusan",
    description:
      "Alamin ang mga pangunahing konsepto ng ekonomiks at ang suliranin ng kakapusan.",
    category: "Ekonomiks",
    image: "market",
    quiz: [],
  },
  {
    id: "mga-suliraning-pangkapaligiran-at-disaster-risk",
    gradeId: "grade-10",
    title: "Mga Suliraning Pangkapaligiran at Disaster Risk",
    description:
      "Talakayin ang mga suliraning pangkapaligiran at kahalagahan ng disaster risk reduction.",
    category: "Lipunan",
    image: "flood",
    quiz: [],
  },
]
