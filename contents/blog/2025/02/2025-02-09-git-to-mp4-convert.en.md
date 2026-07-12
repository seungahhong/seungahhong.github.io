---
layout: post
title: FE Performance Improvement - Converting gif to mp4
date: 2025-02-09
published: 2025-02-09
category: Development
tags: ['performance']
comments: true
thumbnail: './assets/09/thumbnail.jpeg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# Overview

Among our resources, the gif format tends to be large in size. To reduce the amount of data users need to download and to improve loading speed, I carried out a performance improvement task that converts gifs to the mp4 video format, which provides more efficient compression, and applied this feature to the service.

# Requirements Analysis

- Conversion format
  - img > gif → video > mp4
  - When an mp4 file with the same filename exists, load the mp4 instead of the gif
- Applying a placeholder
  - Set the placeholder height based on the image width and height values stored in the dataset
- Recalculating the size
  - Recalculate the width/height when a browser resize occurs
- Viewport-based mp4 loading/playback/pause
  - Load the mp4 when it reaches the viewport region
- Provide the same behavior as a gif
  - autoplay, mute, loop, playinline

# Determining whether an mp4 file exists with the same filename as the gif image file

- Example code

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

# Setting an mp4 placeholder to prevent layout shift on initial load

- Example code

  ```tsx
  <video ~~ data-natural-width="300" data-natural-height="300" />
  const video = document.querySelect('video');
  const { dataset, style } = video;
  const { naturalHeight, naturalWidth } = dataset;

  // layout shift 방지를 위한 엘리먼트 높이값 지정
  const heightRate = parseFloat(naturalHeight / naturalWidth);
  style.setProperty('height', `${naturalWidth * heightRate}px`);
  ```

# Handling mp4 when the user first enters, re-enters, or leaves the viewport

- Example code

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
