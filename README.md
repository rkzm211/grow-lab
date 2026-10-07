# 그로우랩 홈페이지

## 파일 구성
- `index.html`: 메인
- `about.html`: 회사소개
- `services.html`: 서비스와 요금
- `contact.html`: 문의
- `assets/css/style.css`: 디자인 (색상과 글꼴은 파일 맨 위 `:root`에 모여 있음)
- `assets/js/main.js`: 메뉴, 탭, 스크롤 효과, 메인 성장 곡선 애니메이션
- `assets/img/`: 로고, 대표 사진, 파비콘, 카카오톡 QR, 공유 이미지(og.jpg)

## 자주 바꾸는 것
- 카카오톡 링크: 모든 html 파일의 `https://open.kakao.com/o/s9Bw11ai`
- 이메일: 모든 html 파일의 `rkzm211@naver.com`
- 요금: `index.html`과 `services.html`의 `390,000` / `890,000`
- 머리글과 바닥글(사업자 정보)은 4개 페이지에 똑같이 들어 있으니 함께 수정

## 로컬에서 보기
```
python -m http.server 8770 --directory .
```

## 배포
- 주소: https://grow-lab.co.kr (www는 자동으로 이 주소로 이동)
- 저장소: https://github.com/rkzm211/grow-lab (`main` 브랜치)
- `main`에 push하면 GitHub Pages가 1~2분 안에 자동으로 반영
- 도메인 DNS: 가비아 (A 레코드 4개 → 185.199.108~111.153, www CNAME → rkzm211.github.io.)
- 검색 등록: 네이버 서치어드바이저, 구글 서치콘솔 (소유확인 태그는 index.html `<head>`에 있음, 지우지 말 것)
