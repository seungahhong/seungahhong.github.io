---
layout: post
title: FE 성능개선 - gif to mp4 변환
date: 2025-02-09
published: 2025-02-09
category: 개발
tags: ['performance']
comments: true
thumbnail: './assets/09/thumbnail.jpeg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# 개요

리소스 중에 용량이 큰 gif 포멧을 효율적인 압축 방식을 제공하는 mp4 비디오 포멧으로 변경해서 리소스 수신 용량을 줄이고 로딩 속도를 개선하기 위해서 해당 기능을 서비스에 적용을 위한 성능개선 작업을 진행하였습니다.

# 요구사항 분석

- 변환 형식
  - img > gif → video > mp4
  - 동일한 파일명이 있는 mp4 파일이 있는 경우 gif 보다는 mp4 로딩되도록 처리
- placeholder 적용
  - dataset에서 저장된 이미지 너비, 높이값을 바탕으로 placeholder 높이값 지정
- 사이즈 재 계산
  - 브라우저 리사이즈 발생 시 너비/높이 사이즈를 재계산
- 뷰포트 기준 mp4 로딩/재생/일시중지 작업
  - viewport 기준 영역에 도달했을 때 mp4 로딩 되도록 수정
- gif 동작과 동일한 기능 제공
  - autoplay, mute, loop, playinline

# gif 이미지 파일과 동일한 파일명에 mp4 파일 존재 유무 판단

- 예제코드

  ```tsx
  const createVideoFromGif = (element: HTMLImageElement) => {
    const videoElement = document.createElement('video');
    videoElement.setAttribute('muted', 'true');
    videoElement.setAttribute('loop', 'true');
    videoElement.setAttribute('type', 'video/mp4');
    // 모바일 브라우저에서 비디오를 인라인으로 재생하기 위해서는 다음 주요 속성을 추가해야 한다.
    // Android용 Chrome의 경우 autoplay, muted만 필요하지만 Safari를 사용하는 경우 playsinline 모두 필요!
    videoElement.setAttribute('playsinline', '');

    // 지연 로딩을 위해서 적용된 dataset.src를 video에도 적용하기 위해서 추가
    videoElement.dataset.src = element.dataset.src.replace('.gif', '.mp4');

    // layout shift 방지를 위해서 사용되는 이미지 높이/너비값을 저장한 dataset도 video 태그에도 적용
    videoElement.dataset.naturalWidth = element.dataset.naturalWidth;
    videoElement.dataset.naturalHeight = element.dataset.naturalHeight;

    return videoElement;
  };
  ```

# 초기 로딩 시 layout shift 방지를 위한 mp4 placeholder 지정

- 예제코드

  ```tsx
  <video ~~ data-natural-width="300" data-natural-height="300" />
  const video = document.querySelect('video');
  const { dataset, style } = video;
  const { naturalHeight, naturalWidth } = dataset;

  // layout shift 방지를 위한 엘리먼트 높이값 지정
  const heightRate = parseFloat(naturalHeight / naturalWidth);
  style.setProperty('height', `${naturalWidth * heightRate}px`);
  ```

# 사용자 viewport 최초 진입/재진입/벗어날 경우에 대한 mp4 처리

- 예제코드

  ```tsx
  useEffect(() => {
     const video = document.querySelect('video');
     const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const { target, intersectionRatio } = entry;
          if (entry.intersectionRatio > 0) {
  		      // 비디오가 뷰포트에 진입한 경우
  	        if (target.src === '') { // 최초 mp4가 뷰포트에 진입한 경우(지연로딩)
  		        target.src = target.dataset.src;

  		        target.play().catch(() => {
  							// NotAllowedError
                // 브라우저에서 미디어 재생이 되지 않는 경우, 보통 사파리 브라우저 정책으로 인해 안되는 경우
                // Auto-play was prevented(low power mode)
                // Do something like adding controls to allow user to manually play

                // NotSupportedError
                // MediaSource가 지원되는 포맷으로 표현되지 않는 경우(예: 안드로이드 웹뷰에서 mp4 사이즈가 큰 경우)
  							if (target && target.parentElement) {
  								const imageElement = document.createElement('img');
  								// 브라우저 로딩 이슈로 인해서 로딩이 안될 경우 .gif 확장자로 다시 재로딩
  							  imageElement.src = target.dataset.src.replace('.gif', '.mp4');

  							  // 이미지 높이값도 동일한게 지정
  							  imageElement.height = target.style.height;
  							};

  							target.parentElement.replaceChild(imageElement, target);
  						});
  						return;
  	        }

            if(target.paused) { // 비디오가 일시정지 된 경우
              target.play().catch(() => { // 브라우저 로딩이 실패한 경우
                // NotAllowedError
                // 브라우저에서 미디어 재생이 되지 않는 경우, 보통 사파리 브라우저 정책으로 인해 안되는 경우
                // Auto-play was prevented(low power mode)
                // Do something like adding controls to allow user to manually play

                // NotSupportedError
                // MediaSource가 지원되는 포맷으로 표현되지 않는 경우(예: 안드로이드 웹뷰에서 mp4 사이즈가 큰 경우)
  							if (target && target.parentElement) {
  								const imageElement = document.createElement('img');
  								// 브라우저 로딩 이슈로 인해서 로딩이 안될 경우 .gif 확장자로 다시 재로딩
  							  imageElement.src = target.dataset.src.replace('.gif', '.mp4');

  							  // 이미지 높이값도 동일한게 지정
  							  imageElement.height = target.style.height;
  							});

  							target.parentElement.replaceChild(imageElement, target);
              };
            }
          } else {
  	        // 비디오가 뷰포트를 벗어난 경우
            if(!target.paused){
              target.pause();
            }
          }
        });
      if (video) {
        observer.observe(video);
      }
      return () => {
        observer.disconnect();
      };
    }, []);
  ```
