---
layout: post
title: FE Development Process
date: 2023-01-01
published: 2023-01-01
category: Development
tags: ['process']
comments: true,
thumbnail: './assets/01/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# Preliminary Work

## 1. Review Planning and Design

- Review wireframes and design drafts
- Design and share a plan for shared componentization based on the design drafts
- Check marketing tracking

## 2. Review APIs and Provide Feedback

- Review the API interface and deliver FE feedback
  - [https://sanghaklee.tistory.com/57](https://sanghaklee.tistory.com/57)

## 3. Write a Development Overview

- Organize the planning document, wireframes, design drafts, API specifications, schedule (release, QA), and owners
- Organize the information needed for development
  - Development (task) list, main branch, development owners

## 4. Review Technologies to Adopt

- State management, development language, Storybook, testing
  - Development language
    - VanillaJS, Typescript, React
  - State management
    - Client: Redux, Mobx, ContextAPI, etc.
      - [https://material-debt-c1c.notion.site/FE-0bbd0e51f3784ee1b477515dd19d608b](https://www.notion.so/FE-0bbd0e51f3784ee1b477515dd19d608b)
    - Server: React-query, SWR, etc.
      - [https://material-debt-c1c.notion.site/FE-0bfcc3f53777429b9d713476ceeeefed](https://www.notion.so/FE-0bfcc3f53777429b9d713476ceeeefed)
  - Testing
    - Unit tests, integration tests
      - [https://seungahhong.github.io/blog/2022/07/2022-07-24-jest/](https://seungahhong.github.io/blog/2022/07/2022-07-24-jest/)
    - E2E tests
      - [https://seungahhong.github.io/blog/2022/08/2022-08-07-cypress/](https://seungahhong.github.io/blog/2022/08/2022-08-07-cypress/)
  - Storybook: [https://seungahhong.github.io/blog/2022/03/2022-03-19-storybook/](https://seungahhong.github.io/blog/2022/03/2022-03-19-storybook/)
  - MSW API integration: [https://seungahhong.github.io/blog/2022/07/2022-07-25-msw/](https://seungahhong.github.io/blog/2022/07/2022-07-25-msw/)

## 5. Define Standards

- Discuss development standards based on the review of technologies to adopt
  - Define standards for the adopted technologies
  - Organize development documentation
    - JSDoc, TSDoc
    - Documentation for collaboration: notion, wiki

## 6. Estimate the Development Schedule

- Write the design proposal
- Improvement tasks
- Screen component development
  - Schedule for Storybook-level development
- API integration work
  - Share the BE API interface, integrate MSW
  - Schedule for actual API release and integration
- Testing
  - API, state management, screen-level, React unit tests
  - e2e tests
- Actual development
  - Schedule per development module/screen
  - Schedule for code review/sharing
- Follow-up work
  - Performance measurement, documentation, etc.
- Checklist items
  - Check the planning/design completion schedule
  - Check the API interface and actual API release schedule
  - Check the working branch and test environment
  - Check the QA schedule
  - → QA (2 weeks prior) → FE (component development) → BE API integration (completed 2 weeks prior) → FE (development complete)

# Actual Development

## 1. Preliminary Development

- Write the design proposal
  - Write a design proposal that fits the project after discussion with planning/design/BE
    - Write a design proposal at the shared component level: to share with planning/design
  - Write the design proposal
    - gliffy, plantuml
  - Folder structure
- Improvement tasks
  - Legacy improvement tasks
    - Improve complex existing tasks
  - Update designs/libraries to the latest versions
  - Apply the latest technologies (JS → TS, etc.)
- Screen component development
  - Storybook-level development for collaboration with planners/designers
  - Write Storybook stories at the component level and for the entire screen
- Mock API development
  - Develop mocking APIs based on the API interface
- Build and deploy
  - Work on the build and deployment process for the deliverables

## 2. Development in Progress

- Identify shared components
  - Start development with components that can be shared first
- Actual development
  - Development based on the design proposal
  - Storybook (screen/shared components)
  - Testing
    - Unit tests, integration tests
    - e2e tests
  - Collaboration
    - Code review
  - Performance improvement

# Follow-up Work

## 1. Development Testing

- Test the development code
  - Check whether the test environment is ready depending on the server state (collaborate with BE)
- Cross-browser testing
  - [https://www.lambdatest.com/](https://www.lambdatest.com/)
  - [https://www.browserling.com/](https://www.browserling.com/)
  - IE, Chrome, Safari, Opera, and so on
- Deploy to the test environment
  - If the scope of impact overlaps with the server, deploy FE after the backend deployment
  - If there are projects with overlapping code or screens, perform the merge work (resolve code conflicts)

## 2. Run QA and Deploy

- Share the QA deployment environment and confirm the release date/time
- Check the QA completion date

## 3. Performance Measurement

- Measure performance using tools such as Lighthouse, WebPageTest, web accessibility tools, and Chrome DevTools
  - Web accessibility, Lighthouse, loading/responsiveness time measurement, rendering optimization, etc.
  - Improvement work
    - Performance improvement: Lighthouse
      - FCP (First Content Paint)
      - SI (Speed Index)
      - LCP (Largest Contentful Paint)
      - TTI (Time to Interaction)
      - TBT (Total Blocking Time)
    - Web accessibility improvement
      - Lighthouse web accessibility
      - Storybook addon: [https://storybook.js.org/addons/@storybook/addon-a11y](https://storybook.js.org/addons/@storybook/addon-a11y)
      - openwax: [https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=chae-yul&logNo=221187023938](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=chae-yul&logNo=221187023938)
    - Rendering optimization
      - React.memo, useMemo, useCallback

## 4. Development Retrospective

- Hold a development retrospective covering what went well, what was disappointing, and what should be improved

## 5. Documentation

- Improve/propose/share FE standards based on deliverables (FE adoption)
- After identifying shared components, migrate them to the design system
- Propose changes to the development process (organize disappointing points and areas for improvement in the development process encountered during development)

## 6. Follow-up Tasks

- Organize follow-up tasks such as refactoring and post-development work
