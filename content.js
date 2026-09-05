/*
 * 이 파일의 내용만 바꾸면 페이지의 주요 정보가 자동으로 갱신됩니다.
 * 행사명과 등록 정보는 미정이며, PPT에서 확정된 날짜·장소·기관·프로그램을 반영했습니다.
 */

const WORKSHOP_DATA = {
  meta: {
    shortName: "IISL Workshop",
    year: "2026",
    eyebrow: "IISL · Joint research workshop",
    title: "2026 Joint",
    titleAccent: "Workshop",
    themeTitle: "AI-Driven Autonomous Security",
    summary:
      "Exploring how communication, sensing, and human–AI collaboration can shape trustworthy, adaptive security for mission-critical connected systems.",
    statusNote: "Official workshop title to be announced",
    themeLabels: [
      "Semantic Communication",
      "Mission-Critical IoT",
      "Human–AI Teaming",
    ],
    date: "October 12, 2026",
    time: "10:00–14:30",
    location: "GIST Seoul Office",
    cityName: "Seoul",
    city: "23, Sejong-daero, Jung-gu, Seoul",
    registrationUrl: "",
    registrationLabel: "Registration to open later",
    contactEmail: "",
  },
  sections: {
    speakers: "Speakers",
  },

  about: {
    label: "Research scope",
    title: "From trusted signals to autonomous cyber defense.",
    paragraphs: [
      "Future connected systems need to understand more than packets. They must reason about meaning, sense their physical environment, and adapt to threats without losing human oversight.",
      "This joint workshop links work in semantic communication and physical-layer security with secure IoT sensing and human–AI teaming. The program is designed to move from device-level trust toward system-level autonomous defense.",
    ],
    topics: [
      {
        number: "01",
        title: "Semantic communication",
        description:
          "Security mechanisms that use task meaning and context, not only transmitted bits, to protect critical communication.",
      },
      {
        number: "02",
        title: "Trusted sensing & IoT",
        description:
          "RF/EM and multimodal sensing approaches for device integrity, session binding, and trustworthy connected environments.",
      },
      {
        number: "03",
        title: "Physical-layer security",
        description:
          "Resilient communication and sensing foundations for mission-critical IoT at the intersection of cyber and physical systems.",
      },
      {
        number: "04",
        title: "Human–AI teaming",
        description:
          "Collaborative intelligence, operational oversight, and the path toward adaptive and autonomous cyber defense.",
      },
    ],
  },

  program: {
    title: "Program",
    items: [
      {
        type: "note",
        label: "Opening",
        title: "Welcome & opening",
        description: "Chair: Prof. Euiseok Hwang · GIST",
      },
      {
        type: "track",
        label: "01 · Morning",
        title: "Semantic Communication & Physical-Layer Security for IoT",
      },
      {
        type: "session",
        time: "10:00",
        endTime: "10:30",
        title: "RF/EM Sensing for Trustworthy IoT",
        speaker: "Prof. Alanson Sample",
        affiliation: "University of Michigan",
        description:
          "A sensing-centered view of trust for connected and embedded systems.",
      },
      {
        type: "session",
        time: "10:30",
        endTime: "11:00",
        title:
          "Semantic Communication–Enabled Physical-Layer Security for Mission-Critical IoT",
        speaker: "Prof. Euiseok Hwang",
        affiliation: "GIST",
        description:
          "Connecting semantic communication with physical-layer protection in critical IoT settings.",
      },
      {
        type: "session",
        time: "11:00",
        endTime: "11:20",
        title:
          "Sensing-Driven IoT Systems: Toward Secure Device-Level Data Integrity",
        speaker: "Cameron Daniel Haire",
        affiliation: "PhD Candidate · University of Michigan",
        description: "",
      },
      {
        type: "session",
        time: "11:20",
        endTime: "11:40",
        title:
          "Session Binding for Bio-based Multi-modal Sensing via Homomorphic Encryption",
        speaker: "Heehun Jung",
        affiliation: "PhD Candidate · GIST",
        description: "",
      },
      {
        type: "break",
        time: "11:40",
        endTime: "13:00",
        title: "Networking lunch",
      },
      {
        type: "track",
        label: "02 · Afternoon",
        title: "Autonomous Security through Human–AI Collaboration",
      },
      {
        type: "session",
        time: "13:00",
        endTime: "13:20",
        title: "Invited Talk 1 — Human–AI Teaming Security: Overview",
        speaker: "Prof. Hyuk Lim",
        affiliation: "KENTECH",
        description: "",
      },
      {
        type: "session",
        time: "13:20",
        endTime: "13:40",
        title: "Invited Talk 2 — Title to be announced",
        speaker: "Prof. Youngsik Kim",
        affiliation: "DGIST",
        description: "",
      },
      {
        type: "session",
        time: "13:40",
        endTime: "14:00",
        title: "Invited Talk 3 — Title to be announced",
        speaker: "Prof. Yongwoo Lee",
        affiliation: "Inha University",
        description: "",
      },
      {
        type: "session",
        time: "14:00",
        endTime: "14:30",
        title: "Panel Discussion & Closing — Toward Autonomous Cyber Defense",
        speaker: "All speakers",
        affiliation: "Closing session",
        description:
          "A closing conversation connecting communication, sensing, and human–AI collaboration.",
      },
    ],
  },

  speakers: [
    {
      name: "Alanson Sample",
      initials: "AS",
      affiliation: "University of Michigan",
      role: "Professor · Keynote I",
      talk: "RF/EM Sensing for Trustworthy IoT",
      image: "assets/speakers/Alanson-Sample.jpeg",
      url: "https://alansonsample.com/",
    },
    {
      name: "Euiseok Hwang",
      initials: "EH",
      affiliation: "GIST",
      role: "Professor · Keynote II",
      talk: "Semantic Communication–Enabled Physical-Layer Security",
      image: "assets/speakers/Euiseok-Hwang.jpg",
      url: "https://iis.gist.ac.kr/prog/gsPerson/isp/P/view.do?siteCode=isp&mno=sub02_01_01&tmplId=template_d1&personId=P00001644",
    },
    {
      name: "Cameron Daniel Haire",
      initials: "CH",
      affiliation: "University of Michigan",
      role: "PhD Candidate · Student Talk",
      talk: "Sensing-Driven IoT Systems",
      image: "",
      url: "",
    },
    {
      name: "Heehun Jung",
      initials: "HJ",
      affiliation: "GIST",
      role: "PhD Candidate · Student Talk",
      talk: "Bio-based Multi-modal Sensing & Homomorphic Encryption",
      image: "assets/speakers/Heehun-Jung.jpg",
      url: "https://iis.gist.ac.kr/prog/gsPerson/isp/S/view.do",
    },
    {
      name: "Hyuk Lim",
      initials: "HL",
      affiliation: "KENTECH",
      role: "Professor · Invited Talk",
      talk: "Human–AI Teaming Security: Overview",
      image: "",
      url: "",
    },
    {
      name: "Youngsik Kim",
      initials: "YK",
      affiliation: "DGIST",
      role: "Professor · Invited Talk",
      talk: "Title to be announced",
      image: "",
      url: "",
    },
    {
      name: "Yongwoo Lee",
      initials: "YL",
      affiliation: "Inha University",
      role: "Professor · Invited Talk",
      talk: "Title to be announced",
      image: "",
      url: "",
    },
  ],

  venue: {
    programSummary: "Keynotes, student talks, invited talks & panel",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=GIST%20Seoul%20Office%2C%2023%20Sejong-daero%2C%20Jung-gu%2C%20Seoul",
    mapEmbedUrl:
      "https://www.google.com/maps?q=GIST%20Seoul%20Office%2C%2023%20Sejong-daero%2C%20Jung-gu%2C%20Seoul&z=17&output=embed",
  },

  contact: {
    copy:
      "The official workshop title, registration details, and organizing contacts will be added here as soon as they are confirmed.",
    organizers: [
      {
        name: "Organizing committee",
        affiliation: "Contact details to be announced",
        email: "",
      },
    ],
  },

  institutions: {
    hosts: [
      {
        name: "Gwangju Institute of Science and Technology",
        displayName: "GIST",
        logo: "",
        url: "",
      },
      {
        name: "University of Michigan",
        displayName: "University of Michigan",
        logo: "",
        url: "",
      },
      {
        name: "Korea Institute of Energy Technology",
        displayName: "KENTECH",
        logo: "",
        url: "",
      },
      {
        name: "Daegu Gyeongbuk Institute of Science and Technology",
        displayName: "DGIST",
        logo: "",
        url: "",
      },
      {
        name: "Inha University",
        displayName: "Inha University",
        logo: "",
        url: "",
      },
    ],
    supporters: [
      {
        name: "Institute of Electrical and Electronics Engineers",
        displayName: "IEEE",
        logo: "",
        url: "",
      },
      {
        name: "GIST AI Institute",
        displayName: "GIST AI Institute",
        logo: "",
        url: "",
      },
    ],
  },

};
