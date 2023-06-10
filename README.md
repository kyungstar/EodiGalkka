# 어디갈까
- NodeBase를 기반으로 제작된 1번째 프로젝트로, 나에게 맞춤 세계여행을 찾아보자.
- 세계여행을 찾을 때, 세계 전 지역 패키지를 낮은 가격순, 높은 가격순, 랭킹 순 네이버 최저가 크롤링을 이용하여 찾아보자

# 여행 가이드
- 내가 추천하는 여행 가이드, 여행 사진들을 올리고
- 올린 사람은 광고를 통해 수익을 얻고, 시청자는 여행 글 들로 경험을 얻는다.

# ERD Cloud
- https://www.erdcloud.com/d/7bTgpLWAuogBFX6vz

# 관리자
- 악성 글, 악성 댓글을 MQTT로 통신받아 실시간 대처를 하도록 한다.

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
1. 나라별 인기 여행 리스트
2. 도시별 인기 여행 리스트
3. 인기있는 여행 순위 
4. 가이드와 여행가의 1:1 채팅서비스 > MQTT, Redis를 이용하여 진행하도록 한다. (Web Socket - X)
5. 관리자에서 나라, 도시, 여행글을 제재 및 공지사항을 등록한다. 순서변경도 가능하다. (블랙리스트도 가능하다.)
6. 사용자가 여행을 찾는 글을 작성할 수 있다.
7. 가이드가 여행을 모집하는 글을 작성할 수 있다.
8. 관리자가 여행 글을 등록하며, 순서를 정렬한다.
* 작업이 고도화된다면, 필요에 따라 MSA 구분 서빅스를 JAVA로 구현 할 예정이다.


