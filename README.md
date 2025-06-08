# 남현 바자회 카페 키오스크, 주문 관리 시스템 개발

### 개발기간 2024.04.20 ~ 2024.04.25 

## 기능 종류
카페 음료 주문, 주문 목록 확인, 주문 삭제, 주문 목록 CSV 파일로 저장

## Router 
- / - 주문
- /order - 주문 목록

## Available Scripts
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm run start`

## 배포 전 준비
1. .env 파일 준비(firestore 접근 권한).


## Firebase 배포 방법

1.  Firebase CLI 설치: `npm install -g firebase-tools`
2.  Firebase 로그인: `firebase login`
3.  Firebase 프로젝트 초기화: `firebase init`
    - Hosting 선택
    - 사용할 Firebase 프로젝트 선택 (기존 프로젝트 또는 새 프로젝트 생성)
    - public 디렉토리 설정 (build로 설정)
4.  빌드: `npm run build`
5.  Firebase 배포: `firebase deploy`

## 주의 사항
1. .env 파일 존재 여부 확인.
2. firebase login 토큰 만료로, 안될 가능성 존재.
3. firebase logout 후 재로그인 후 재진행 필요: `firebase login --reauth`