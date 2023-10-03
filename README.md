# 어디갈까
- NodeBase를 기반으로 제작된 1번째 프로젝트로, 나에게 맞춤 세계여행을 찾아보자.
- 세계여행을 찾을 때, 세계 전 지역 패키지를 낮은 가격순, 높은 가격순, 랭킹 순 네이버 최저가 크롤링을 이용하여 찾아보자

# 여행 가이드
- 내가 추천하는 여행 가이드, 여행 사진들을 올리고
- 올린 사람은 광고를 통해 수익을 얻고, 시청자는 여행 글 들로 경험을 얻는다.

# Technology Stack
<ul>
  <li>Languages
    <img height="20" src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
    <img height="20" src="https://img.shields.io/badge/typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  </li>
  <li>Backend
    <img height="20" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
    <img height="20" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
 </li>
  <li>Databases
    <img height="20" src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
    <img height="20" src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
       <img height="20" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">  
  </li>
  <li>Messaging
    <img height="20" src="https://img.shields.io/badge/MQTT-FF6600?style=for-the-badge&logo=eclipse-mosquitto&logoColor=white">
  </li>

</ul>


# Brainstorm

# Node.js
나라별 인기 여행 리스트
- 나라에 기반한 인기 여행지 목록을 가져와서 표시합니다.
- 데이터 검색 및 다양한 소스(데이터베이스 또는 외부 API 등)에서 데이터를 효율적으로 가져오기 위해 Node.js를 선택합니다.

도시별 인기 여행 리스트
- 도시에 기반한 인기 여행지 목록을 가져와서 표시합니다.
- 나라별 목록과 유사하게, Node.js는 데이터 검색 및 도시별 여행 정보의 렌더링을 효과적으로 처리할 수 있습니다.

인기있는 여행 순위
- 인기 있는 여행지를 순위별로 생성하여 표시합니다.
- Node.js는 인기 점수를 계산하고 여행지를 순위별로 정렬하는 로직을 효율적으로 처리할 수 있습니다.

가이드와 여행가의 1:1 채팅서비스
- MQTT와 Redis를 이용하여 가이드와 여행자 간의 실시간 채팅 기능을 구현합니다.
- Node.js는 Express.js와 MQTT.js, Redis 등의 라이브러리를 활용하여 확장 가능하고 실시간 애플리케이션을 구축하는 데 뛰어난 지원을 제공합니다.


