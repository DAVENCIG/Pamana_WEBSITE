// Content added for the website. The Android app listed these three topics but
// shipped no lesson or quiz for them (it displayed generic fallback text instead).
// Review with the content team before publishing.
import type { Lesson, SourceQuestion } from "./types"

export const webLessons: Record<string, Lesson> = {
  "pag-usbong-ng-sinaunang-kabihasnan-sa-daigdig": {
    title: "Pag-usbong ng Sinaunang Kabihasnan sa Daigdig",
    gradeLabel: "Baitang 8",
    durationMinutes: 12,
    content:
      "Umusbong ang kabihasnan nang matutong manirahan nang permanente ang mga tao, magtanim, at bumuo ng organisadong pamayanan.\n\n" +
      "Karamihan sa mga unang kabihasnan sa daigdig ay umusbong sa mga lambak-ilog: ang Mesopotamia sa pagitan ng Tigris at Euphrates, ang Egypt sa tabi ng Nile, ang Indus sa Timog Asya, at ang Tsina sa tabi ng Huang He.\n\n" +
      "Mahalaga ang ilog dahil nagbibigay ito ng tubig para sa irigasyon, matabang lupa tuwing ito ay umaapaw, at daan para sa transportasyon at kalakalan.\n\n" +
      "Sa Mesoamerica naman, umusbong ang mga kabihasnang Olmec at Maya dahil sa matabang lupa at pagtatanim ng mais.\n\n" +
      "Kasabay ng pag-unlad ng agrikultura, nabuo ang mga lungsod, pamahalaan, relihiyon, espesyalisasyon sa trabaho, at mga sistema ng pagsulat tulad ng cuneiform at hieroglyphics.",
    summary:
      "Umusbong ang mga sinaunang kabihasnan sa mga lugar na may sapat na tubig at matabang lupa, at nagbunga ito ng mga lungsod, pamahalaan, at sistema ng pagsulat.",
    vocabulary: [
      {
        term: "Lambak-ilog",
        definition:
          "Mababang lupain sa paligid ng ilog na karaniwang mataba at angkop sa pagsasaka.",
      },
      {
        term: "Irigasyon",
        definition:
          "Sistema ng pagdadala ng tubig sa mga taniman upang mapalago ang pananim.",
      },
      {
        term: "Cuneiform",
        definition:
          "Sistema ng pagsulat ng Mesopotamia na gumamit ng hugis-sinsel na marka sa luwad.",
      },
      {
        term: "Hieroglyphics",
        definition:
          "Sistema ng pagsulat ng sinaunang Egypt na gumamit ng mga larawan at simbolo.",
      },
      {
        term: "Mesoamerica",
        definition:
          "Rehiyon sa gitnang bahagi ng Amerika kung saan umusbong ang mga kabihasnang Olmec at Maya.",
      },
    ],
  },
  "pangunahing-konsepto-ng-ekonomiks-at-kakapusan": {
    title: "Pangunahing Konsepto ng Ekonomiks at Kakapusan",
    gradeLabel: "Baitang 9",
    durationMinutes: 12,
    content:
      "Ang ekonomiks ay isang agham panlipunan na nag-aaral kung paano ginagamit at hinahati ng tao at lipunan ang limitadong pinagkukunang-yaman upang matugunan ang walang katapusang pangangailangan at kagustuhan.\n\n" +
      "Ang kakapusan (scarcity) ang pangunahing suliranin ng ekonomiks. Umiiral ito dahil limitado ang likas na yaman, lakas-paggawa, kapital, at oras, samantalang patuloy na dumarami ang pangangailangan ng tao.\n\n" +
      "Iba ito sa kakulangan (shortage), na pansamantalang pagkaubos ng isang produkto sa pamilihan dahil sa kalamidad, hoarding, o problema sa produksyon.\n\n" +
      "Dahil sa kakapusan, kailangang gumawa ng matalinong desisyon. Ang trade-off ay ang pagpili ng isang bagay kapalit ng iba, at ang opportunity cost ay ang halaga ng pinakamahusay na alternatibong isinuko.\n\n" +
      "Upang matugunan ang kakapusan, sinasagot ng bawat lipunan ang apat na pangunahing tanong pang-ekonomiya: Ano ang lilikhain? Paano lilikhain? Para kanino lilikhain? Gaano karami ang lilikhain?",
    summary:
      "Dahil sa kakapusan, kailangang pumili at magpasya nang matalino ang tao at lipunan sa paggamit ng limitadong pinagkukunang-yaman.",
    vocabulary: [
      {
        term: "Ekonomiks",
        definition:
          "Agham panlipunan na nag-aaral sa matalinong paggamit ng limitadong pinagkukunang-yaman.",
      },
      {
        term: "Kakapusan",
        definition:
          "Pangmatagalang kalagayan kung saan limitado ang pinagkukunang-yaman kumpara sa pangangailangan ng tao.",
      },
      {
        term: "Kakulangan",
        definition: "Pansamantalang pagkaubos ng isang produkto sa pamilihan.",
      },
      {
        term: "Trade-off",
        definition: "Pagpili o pagsasakripisyo ng isang bagay kapalit ng iba.",
      },
      {
        term: "Opportunity Cost",
        definition:
          "Halaga ng pinakamahusay na alternatibong isinuko sa paggawa ng desisyon.",
      },
    ],
  },
  "mga-suliraning-pangkapaligiran-at-disaster-risk": {
    title: "Mga Suliraning Pangkapaligiran at Disaster Risk",
    gradeLabel: "Baitang 10",
    durationMinutes: 12,
    content:
      "Ang Pilipinas ay isa sa mga bansang lantad sa iba't ibang kalamidad dahil matatagpuan ito sa Pacific Ring of Fire at sa daanan ng mga bagyo sa Kanlurang Pasipiko.\n\n" +
      "Kabilang sa mga pangunahing suliraning pangkapaligiran ang solid waste, polusyon sa hangin at tubig, pagkasira ng kagubatan, at climate change na nagpapalala sa lakas ng bagyo at pagbaha.\n\n" +
      "Ang hazard ay isang banta tulad ng bagyo, lindol, o pagputok ng bulkan. Nagiging disaster o kalamidad ito kapag lubhang naapektuhan ang buhay, ari-arian, at kabuhayan ng isang komunidad.\n\n" +
      "Ang vulnerability ay ang kahinaan ng isang komunidad na harapin ang hazard, samantalang ang capacity ay ang kakayahan nitong maghanda, tumugon, at bumangon.\n\n" +
      "Layunin ng Disaster Risk Reduction and Management (DRRM) na bawasan ang panganib sa pamamagitan ng apat na yugto: prevention at mitigation, preparedness, response, at rehabilitation at recovery. Sa Pilipinas, itinatakda ito ng Republic Act 10121.",
    summary:
      "Ang wastong paghahanda at pangangalaga sa kapaligiran ay nakababawas sa panganib at pinsalang dulot ng mga kalamidad.",
    vocabulary: [
      {
        term: "Hazard",
        definition:
          "Banta o pangyayaring maaaring magdulot ng pinsala, tulad ng bagyo, lindol, o pagputok ng bulkan.",
      },
      {
        term: "Vulnerability",
        definition:
          "Kahinaan o kakulangan ng isang komunidad na harapin ang epekto ng hazard.",
      },
      {
        term: "Capacity",
        definition:
          "Kakayahan ng komunidad na maghanda, tumugon, at bumangon mula sa kalamidad.",
      },
      {
        term: "Climate Change",
        definition:
          "Pangmatagalang pagbabago sa temperatura at panahon ng daigdig.",
      },
      {
        term: "DRRM",
        definition:
          "Sistematikong pamamaraan ng pagbabawas at pamamahala sa panganib ng kalamidad.",
      },
    ],
  },
}

export const webQuizzes: Record<string, SourceQuestion[]> = {
  "pag-usbong-ng-sinaunang-kabihasnan-sa-daigdig": [
    {
      question: "Saan karaniwang umusbong ang mga unang kabihasnan sa daigdig?",
      options: [
        "Sa mga lambak-ilog",
        "Sa mga disyertong walang tubig",
        "Sa tuktok ng mga bundok na may yelo",
        "Sa gitna ng karagatan",
      ],
      correctIndex: 0,
      explanation:
        "Karamihan sa mga unang kabihasnan ay umusbong sa mga lambak-ilog dahil sa tubig at matabang lupa.",
    },
    {
      question: "Anong ilog ang naging sentro ng kabihasnang Egyptian?",
      options: ["Huang He", "Nile", "Indus", "Euphrates"],
      correctIndex: 1,
      explanation: "Umusbong ang kabihasnang Egyptian sa tabi ng Ilog Nile.",
    },
    {
      question: "Anong sistema ng pagsulat ang nabuo sa Mesopotamia?",
      options: ["Hieroglyphics", "Baybayin", "Cuneiform", "Alpabetong Latin"],
      correctIndex: 2,
      explanation: "Cuneiform ang sistema ng pagsulat ng Mesopotamia.",
    },
    {
      question:
        "Bakit mahalaga sa mga sinaunang magsasaka ang pag-apaw ng ilog?",
      options: [
        "Sinisira nito ang lahat ng pananim",
        "Nag-iiwan ito ng matabang lupa",
        "Pinatutuyo nito ang lupa",
        "Pinipigilan nito ang kalakalan",
      ],
      correctIndex: 1,
      explanation:
        "Nag-iiwan ng matabang lupa ang pag-apaw ng ilog, kaya umuunlad ang pagsasaka.",
    },
    {
      question: "Aling kabihasnan ang umusbong sa Mesoamerica?",
      options: ["Sumer", "Harappa", "Shang", "Maya"],
      correctIndex: 3,
      explanation:
        "Ang Maya at Olmec ay mga kabihasnang umusbong sa Mesoamerica.",
    },
  ],
  "pangunahing-konsepto-ng-ekonomiks-at-kakapusan": [
    {
      question: "Ano ang pangunahing suliraning pinag-aaralan ng ekonomiks?",
      options: ["Kakapusan", "Kasaganaan", "Kolonyalismo", "Urbanisasyon"],
      correctIndex: 0,
      explanation: "Kakapusan ang pangunahing suliranin ng ekonomiks.",
    },
    {
      question:
        "Ano ang tawag sa halaga ng pinakamahusay na alternatibong isinuko sa pagpili?",
      options: ["Trade-off", "Opportunity cost", "Kita", "Buwis"],
      correctIndex: 1,
      explanation:
        "Ang opportunity cost ay ang halaga ng pinakamahusay na alternatibong isinuko.",
    },
    {
      question: "Paano naiiba ang kakulangan sa kakapusan?",
      options: [
        "Permanente ang kakulangan",
        "Magkapareho lamang sila",
        "Pansamantala lamang ang kakulangan",
        "Tungkol lamang sa oras ang kakulangan",
      ],
      correctIndex: 2,
      explanation:
        "Pansamantala ang kakulangan, samantalang pangmatagalang kalagayan ang kakapusan.",
    },
    {
      question:
        "Alin ang HINDI kabilang sa apat na pangunahing tanong pang-ekonomiya?",
      options: [
        "Ano ang lilikhain?",
        "Paano lilikhain?",
        "Para kanino lilikhain?",
        "Sino ang pinakamayaman?",
      ],
      correctIndex: 3,
      explanation:
        "Ang apat na tanong ay: ano, paano, para kanino, at gaano karami ang lilikhain.",
    },
    {
      question:
        "Bakit kailangang gumawa ng matalinong desisyon ang tao at lipunan?",
      options: [
        "Dahil limitado ang pinagkukunang-yaman ngunit walang katapusan ang pangangailangan",
        "Dahil walang hanggan ang likas na yaman",
        "Dahil iisa lamang ang pangangailangan ng tao",
        "Dahil hindi na kailangan ang produksyon",
      ],
      correctIndex: 0,
      explanation:
        "Dahil sa kakapusan, kailangang pumili kung paano gagamitin ang limitadong yaman.",
    },
  ],
  "mga-suliraning-pangkapaligiran-at-disaster-risk": [
    {
      question: "Bakit madalas makaranas ng kalamidad ang Pilipinas?",
      options: [
        "Dahil malayo ito sa karagatan",
        "Dahil nasa Pacific Ring of Fire ito at daanan ng mga bagyo",
        "Dahil wala itong mga bundok",
        "Dahil malamig ang klima nito buong taon",
      ],
      correctIndex: 1,
      explanation:
        "Nasa Pacific Ring of Fire at daanan ng mga bagyo ang Pilipinas.",
    },
    {
      question:
        "Ano ang tawag sa banta tulad ng bagyo, lindol, o pagputok ng bulkan?",
      options: ["Capacity", "Recovery", "Hazard", "Vulnerability"],
      correctIndex: 2,
      explanation:
        "Ang hazard ay banta o pangyayaring maaaring magdulot ng pinsala.",
    },
    {
      question: "Ano ang tinutukoy ng capacity sa DRRM?",
      options: [
        "Kakayahan ng komunidad na maghanda, tumugon, at bumangon",
        "Dami ng ulan sa isang taon",
        "Laki ng populasyon ng isang lungsod",
        "Bilang ng mga bagyong dumaraan",
      ],
      correctIndex: 0,
      explanation:
        "Ang capacity ay kakayahan ng komunidad na harapin at bumangon mula sa kalamidad.",
    },
    {
      question: "Anong batas ang nagtatakda ng DRRM sa Pilipinas?",
      options: ["RA 9003", "RA 8749", "RA 7610", "RA 10121"],
      correctIndex: 3,
      explanation:
        "Ang Republic Act 10121 ang Philippine Disaster Risk Reduction and Management Act.",
    },
    {
      question: "Alin ang halimbawa ng paghahanda (preparedness)?",
      options: [
        "Paghahanda ng emergency go-bag at evacuation plan",
        "Pagtatapon ng basura sa ilog",
        "Pagputol ng mga puno sa bundok",
        "Pagbalewala sa mga babala ng PAGASA",
      ],
      correctIndex: 0,
      explanation:
        "Bahagi ng preparedness ang paghahanda ng go-bag at evacuation plan bago dumating ang kalamidad.",
    },
  ],
}
