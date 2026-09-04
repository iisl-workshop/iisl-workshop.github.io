/*
 * 이 파일의 내용만 바꾸면 페이지의 주요 정보가 자동으로 갱신됩니다.
 * 배열 항목을 추가할 때 앞 항목 끝의 쉼표를 확인하세요.
 */

const WORKSHOP_DATA = {
  meta: {
    shortName: "IISL Workshop",
    year: "2026",
    eyebrow: "IISL Workshop 2026",
    title: "Workshop Title",
    titleAccent: "Goes Here.",
    summary:
      "A focused workshop bringing together researchers to exchange ideas, discuss emerging questions, and build new collaborations.",
    statusNote: "Template preview · Replace the sample text in content.js",
    date: "Date to be announced",
    time: "Time to be announced",
    location: "Venue to be announced",
    city: "City, Country",
    registrationUrl: "",
    registrationLabel: "Registration coming soon",
    contactEmail: "organizer@example.com",
  },

  about: {
    label: "About the workshop",
    title: "A place for focused questions and open exchange.",
    paragraphs: [
      "Use this section to introduce the central question of the workshop and explain why it matters now.",
      "Add a short description of the audience, the scope of the event, and what participants can expect to take away.",
    ],
    topics: [
      {
        number: "01",
        title: "Research theme one",
        description: "Describe the first topic or question that the workshop will explore.",
      },
      {
        number: "02",
        title: "Research theme two",
        description: "Describe the second topic or question that connects the invited talks.",
      },
      {
        number: "03",
        title: "Research theme three",
        description: "Describe the third topic, challenge, or direction for discussion.",
      },
    ],
  },

  program: {
    title: "Workshop schedule.",
    note: "The program below is a sample and can be replaced as details are confirmed.",
    items: [
      { type: "break", time: "08:30", endTime: "09:00", title: "Registration & check-in" },
      {
        type: "session",
        time: "09:00",
        title: "Welcome and opening remarks",
        speaker: "Organizer name",
        affiliation: "IISL",
        description: "A brief welcome and introduction to the goals of the workshop.",
      },
      {
        type: "session",
        time: "09:20",
        title: "Invited talk title",
        speaker: "Speaker One",
        affiliation: "University or organization",
        description: "Add a one- or two-sentence summary when the talk details are available.",
      },
      { type: "break", time: "10:10", endTime: "10:40", title: "Coffee break" },
      {
        type: "session",
        time: "10:40",
        title: "Invited talk title",
        speaker: "Speaker Two",
        affiliation: "University or organization",
        description: "Add a one- or two-sentence summary when the talk details are available.",
      },
      { type: "break", time: "12:00", endTime: "13:30", title: "Lunch break" },
      {
        type: "session",
        time: "13:30",
        title: "Panel discussion or invited talk",
        speaker: "Panelists or speaker",
        affiliation: "Multiple institutions",
        description: "Use this field for the session abstract, panel theme, or participation details.",
      },
      { type: "break", time: "17:00", endTime: "", title: "Closing remarks" },
    ],
  },

  speakers: [
    {
      name: "Speaker One",
      initials: "S1",
      affiliation: "University or organization",
      role: "Professor / Researcher",
      talk: "Invited talk title",
      image: "",
      url: "",
    },
    {
      name: "Speaker Two",
      initials: "S2",
      affiliation: "University or organization",
      role: "Professor / Researcher",
      talk: "Invited talk title",
      image: "",
      url: "",
    },
    {
      name: "Speaker Three",
      initials: "S3",
      affiliation: "University or organization",
      role: "Professor / Researcher",
      talk: "Invited talk title",
      image: "",
      url: "",
    },
  ],

  venue: {
    name: "Venue to be announced",
    address: "Add the full street address here.",
    details: [
      { label: "Transit", value: "Nearest station or bus stop" },
      { label: "From airport", value: "Recommended route and approximate travel time" },
      { label: "Room", value: "Building, floor, and room name" },
    ],
    mapUrl: "",
    mapLabel: "Workshop venue",
  },

  contact: {
    copy: "Questions about the program or logistics? Contact the organizing committee and we will be happy to help.",
    organizers: [
      { name: "Organizer One", affiliation: "IISL", email: "organizer@example.com" },
      { name: "Organizer Two", affiliation: "IISL", email: "organizer@example.com" },
      { name: "Organizer Three", affiliation: "IISL", email: "organizer@example.com" },
    ],
  },

  footerLinks: [
    { label: "IISL", url: "" },
    { label: "GitHub", url: "https://github.com/iisl-workshop" },
  ],
};
