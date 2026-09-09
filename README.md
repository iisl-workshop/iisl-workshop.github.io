# Workshop website

워크샵 홈페이지 틀
바로 index.html을 열어 확인 가능

## 가장 자주 수정할 파일

워크숍 제목, 날짜, 일정, 연사, 장소, 주최자 정보는 모두 content.js에 모여 있음

1. 행사명이 정해지면 meta의 shortName, eyebrow, title, titleAccent를 바꾸기
2. 날짜, 시간, 장소, 주소는 meta의 date, time, location, cityName, city에서 수정하기
3. 연사 사진은 assets/speakers 폴더에 넣고 해당 연사의 image 값을 assets/speakers/파일명.jpg로 바꾸기
4. 아직 정해지지 않은 링크는 빈 문자열로 두면 버튼이 자동으로 비활성화됨
5. Venue에 표시되는 프로그램 구성은 venue의 programSummary에서 수정하기

### 일정 한 개 추가하기

program.items 배열 안에 아래 형태의 블록을 복사해 추가

    {
      type: "session",
      time: "14:00",
      endTime: "14:30",
      title: "Talk title",
      speaker: "Speaker name",
      affiliation: "Affiliation",
    },

휴식 시간은 type: "break"를 사용

    { type: "break", time: "15:00", endTime: "15:30", title: "Coffee break" },

오전·오후처럼 프로그램 묶음을 나누려면 type: "track"을 사용

    {
      type: "track",
      label: "Evening",
      title: "Track title",
    },

### 연사 한 명 추가하기

speakers 배열 안에 아래 형태의 블록을 복사해 추가

    {
      name: "Speaker name",
      affiliation: "University or organization",
      role: "Title",
      talk: "Talk title",
      image: "assets/speakers/speaker-name.jpg",
      url: "https://speaker-website.example",
    },

image 또는 url이 아직 없으면 빈 문자열로 두어도 됨
사진이 없으면 이름의 앞 두 글자가 자동으로 표시됨. initials는 따로 입력하지 않음.

## 수정 후 확인

- `node --test tests/site.test.cjs`: 콘텐츠 렌더링, 이미지 경로, 메뉴·스크롤 동작 검사
- CSS나 JS를 수정하면 index.html의 해당 파일 `?v=` 숫자도 올려 캐시 갱신
- 파비콘은 사용하지 않으며, index.html의 빈 아이콘 설정을 유지

## 파일 구성

- index.html: 페이지의 기본 뼈대
- content.js: 워크숍 정보와 반복 콘텐츠
- script.js: 콘텐츠 표시와 모바일 메뉴 동작
- styles.css: 색상, 레이아웃, 반응형 디자인
- assets: 로고와 연사 사진 등 이미지
