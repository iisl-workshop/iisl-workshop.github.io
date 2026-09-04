# IISL Workshop website

GitHub Pages에서 바로 동작하는 워크숍 안내 페이지 템플릿입니다. 별도의 빌드나 설치 과정 없이 index.html을 열어 확인할 수 있습니다.

## 가장 자주 수정할 파일

워크숍 제목, 날짜, 일정, 연사, 장소, 주최자 정보는 모두 content.js에 모여 있습니다.

1. content.js에서 예시 문구를 실제 정보로 교체합니다.
2. 연사 사진은 assets/speakers 폴더에 넣고 해당 연사의 image 값을 assets/speakers/파일명.jpg로 바꿉니다.
3. 아직 정해지지 않은 링크는 빈 문자열로 두면 버튼이 자동으로 비활성화됩니다.

### 일정 한 개 추가하기

program.items 배열 안에 아래 형태의 블록을 복사해 추가합니다.

    {
      type: "session",
      time: "14:00",
      title: "Talk title",
      speaker: "Speaker name",
      affiliation: "Affiliation",
      description: "Short description (optional)",
    },

휴식 시간은 type: "break"를 사용합니다.

    { type: "break", time: "15:00", endTime: "15:30", title: "Coffee break" },

### 연사 한 명 추가하기

speakers 배열 안에 아래 형태의 블록을 복사해 추가합니다.

    {
      name: "Speaker name",
      initials: "SN",
      affiliation: "University or organization",
      role: "Title",
      talk: "Talk title",
      image: "assets/speakers/speaker-name.jpg",
      url: "https://speaker-website.example",
    },

image 또는 url이 아직 없으면 빈 문자열로 두어도 됩니다.

## 로컬에서 확인하기

    cd /workspace/iisl-workshop
    python3 -m http.server 8000

브라우저에서 http://localhost:8000 을 엽니다.

## 파일 구성

- index.html: 페이지의 기본 뼈대
- content.js: 워크숍 정보와 반복 콘텐츠
- script.js: 콘텐츠 표시와 모바일 메뉴 동작
- styles.css: 색상, 레이아웃, 반응형 디자인
- assets: 로고와 연사 사진 등 이미지
