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
    registrationUrl: "https://forms.gle/V22FsKEZS7BCbzuP7",
    registrationLabel: "Register now",
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
        title: "Semantic Communication",
        description:
          "Security mechanisms that use task meaning and context, not only transmitted bits, to protect critical communication.",
      },
      {
        number: "02",
        title: "Mission-Critical IoT",
        description:
          "RF/EM and multimodal sensing with physical-layer protection for device integrity and resilient mission-critical IoT.",
      },
      {
        number: "03",
        title: "Human–AI Teaming",
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
        title: "Keynote I — RF/EM Sensing for Trustworthy IoT",
        speaker: "Prof. Alanson Sample",
        affiliation: "University of Michigan",
        description:
          "설명 넣어야 함...",
      },
      {
        type: "session",
        time: "10:30",
        endTime: "11:00",
        title:
          "Keynote II — Semantic Communication–Enabled Physical-Layer Security for Mission-Critical IoT",
        speaker: "Prof. Euiseok Hwang",
        affiliation: "GIST",
        description:
          "설명 넣어야 함...",
      },
      {
        type: "session",
        time: "11:00",
        endTime: "11:20",
        title:
          "Student Talk I — Sensing-Driven IoT Systems: Toward Secure Device-Level Data Integrity",
        speaker: "Cameron Daniel Haire",
        affiliation: "PhD Candidate · University of Michigan",
        description: "설명 넣어야 함...",
      },
      {
        type: "session",
        time: "11:20",
        endTime: "11:40",
        title:
          "Student Talk II — Session Binding for Bio-based Multi-modal Sensing via Homomorphic Encryption",
        speaker: "Heehun Jung",
        affiliation: "PhD Candidate · GIST",
        description: "설명 넣어야 함...",
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
        title: "Invited Talk I — Human–AI Teaming Security: Overview",
        speaker: "Prof. Hyuk Lim",
        affiliation: "KENTECH",
        description: "설명 넣어야 함...",
      },
      {
        type: "session",
        time: "13:20",
        endTime: "13:40",
        title: "Invited Talk II — Title to be announced",
        speaker: "Prof. Youngsik Kim",
        affiliation: "DGIST",
        description: "설명 넣어야 함...",
      },
      {
        type: "session",
        time: "13:40",
        endTime: "14:00",
        title: "Invited Talk III — Title to be announced",
        speaker: "Prof. Yongwoo Lee",
        affiliation: "Inha University",
        description: "설명 넣어야 함...",
      },
      {
        type: "session",
        time: "14:00",
        endTime: "14:30",
        title: "Panel Discussion & Closing — Toward Autonomous Cyber Defense",
        speaker: "All speakers",
        affiliation: "Closing session",
        description:
          "설명 넣어야 함...",
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
      image: "assets/speakers/Cameron-Haire.jpeg",
      url: "https://callmeron7.github.io/about/",
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
      image: "assets/speakers/Hyuk-Lim.jpg",
      url: "https://hlim.kentech.ac.kr/",
    },
    {
      name: "Youngsik Kim",
      initials: "YK",
      affiliation: "DGIST",
      role: "Professor · Invited Talk",
      talk: "Title to be announced",
      image: "assets/speakers/Youngsik-Kim.jpg",
      url: "https://sites.google.com/site/mypurist/",
    },
    {
      name: "Yongwoo Lee",
      initials: "YL",
      affiliation: "Inha University",
      role: "Professor · Invited Talk",
      talk: "Title to be announced",
      image: "assets/speakers/Youngwoo-Lee.png",
      url: "https://yongwoo-lee-ccl.github.io/online-cv/",
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
      "궁금한 점이 있다면 저희에게 문의 주세용 ^^, 여기 넣을지 뺄지, 넣는다면 누구 넣을지",
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
        logo: "assets/logos/GIST.svg",
        url: "https://www.gist.ac.kr/en/main.html",
      },
      {
        name: "University of Michigan",
        displayName: "University of Michigan",
        logo: "assets/logos/Michigan.png",
        url: "https://umich.edu/",
      },
      {
        name: "Korea Institute of Energy Technology",
        displayName: "KENTECH",
        logo: "assets/logos/KENTECH.jpg",
        url: "https://www.kentech.ac.kr/main.do",
      },
      {
        name: "Daegu Gyeongbuk Institute of Science and Technology",
        displayName: "DGIST",
        logo: "assets/logos/DGIST.png",
        logoScale: "expanded",
        url: "https://www.dgist.ac.kr/eng/index.do",
      },
      {
        name: "Inha University",
        displayName: "Inha University",
        logo: "assets/logos/INHA.svg",
        logoScale: "large",
        url: "https://www.inha.ac.kr/eng/index.do",
      },
    ],
    supporters: [
      {
        name: "Institute of Electrical and Electronics Engineers",
        displayName: "IEEE",
        logo: "assets/logos/IEEE.svg",
        url: "https://www.ieee.org/",
      },
      {
        name: "GIST AI Institute",
        displayName: "GIST AI Institute",
        logo: "assets/logos/GIST_AI.png",
        url: "https://mseeng.gist.ac.kr/aieng/index.do",
      },
    ],
  },

};
