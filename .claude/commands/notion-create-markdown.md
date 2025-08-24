## 실행 방법

1. mcp notion을 이용해서 인자로 전달된 $ARGUMENTS 기준으로 페이지를 검색
2. 검색된 페이지에 데이터를 api로 가져와서 markdown 파일로 생성
3. 생성된 파일 규칙은 오늘 날짜 기준으로 폴더를 생성해서 markdown을 추가해줘(markdown 이름은 $ARGUMENTS.md 파일로 생성해줘)
4. 이미지 같은 경우에는 날짜에 월 기준 폴더에 assets 폴더 생성 후 그 이후에 일자 폴더를 생성 후에 이미지를 저장해줘(단, 한자리 일자일 경우 앞에 0을 붙여줘)

## markdown 작성법

1. 생성된 markdown 파일 앞쪽에 목차를 아래와 같이 생성해줘(date, published 오늘 날짜로 넣어줘 - 포멧은 yyyy-mm-dd로 작성해줘)
<!--

---

layout: post
title: $ARGUMENTS
date:
published:
category: 개발
tags: []
comments: true
thumbnail: ''
github: ''

---

-->

1. Target 브랜치를 인자로 전달: `/code-review $ARGUMENTS` (예: `/code-review main`)
2. 현재 브랜치에서 target 브랜치로의 PR을 자동으로 찾아 리뷰
3. 리뷰 생성 후 자동으로 GitHub PR에 코멘트 추가
