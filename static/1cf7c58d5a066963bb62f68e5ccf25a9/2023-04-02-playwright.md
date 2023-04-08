---
layout: post
title: Playwright
date: 2023-04-02
published: 2023-04-02
category: 개발
tags: ['test']
comments: true,
thumbnail: './assets/02/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# Playwright 기본

- Install playwright

  ```bash
  # 브라우저 설치
  $ npm i -D playwright

  # 테스팅 라이브러리 설치
  $ npm i -D @playwright/test
  ```

# Playwright Commands

- Actions

  - Text input
    \<input\>, \<textarea\>, [contenteditable] 엘리먼트를 포커스 & 텍스트를 바로 입력할 경우 호출
    locator.fill() 대체해서 사용 가능

    ```tsx
    // Text input
    await page.getByRole('textbox').fill('Peter');

    // Date input
    await page.getByLabel('Birth date').fill('2020-02-02');

    // Time input
    await page.getByLabel('Appointment time').fill('13:15');

    // Local datetime input
    await page.getByLabel('Local time').fill('2020-03-02T05:15');
    ```

  - Type characters → real keyboard type
    입력 엘리먼트에 실제 키보드 입력이 되는것처럼 동작
    locator.type() 대체해서 사용 가능
    ```tsx
    // Type character by character
    await page.locator('#area').type('Hello World!');
    ```
  - Keys and shortcuts
    엘리먼트를 선택하거나 단축키를 생성하기 위한 동작
    keyboardEvent.key 이벤트를 사용이 가능
    [locator.press](http://locator.press)() 대체 가능

    ```tsx
    // Hit Enter
    await page.getByText('Submit').press('Enter');

    // Dispatch Control+Right
    await page.getByRole('textbox').press('Control+ArrowRight');

    // Press $ sign on keyboard
    await page.getByRole('textbox').press('$');

    // <input id=name>
    await page.locator('#name').press('Shift+A');

    // <input id=name>
    await page.locator('#name').press('Shift+ArrowLeft');
    ```

  - Checkboxes and radio buttons → checkbox, radio
    input[type=checkbox], input[type=radio] and [role=checkbox] 엘리먼트에 대해서 체크/미체크 세팅, 얻어올 경우 호출
    locator.setChecked() 대체해서 사용 가능

    ```tsx
    // Check the checkbox
    await page.getByLabel('I agree to the terms above').check();

    // Assert the checked state
    expect(
      await page.getByLabel('Subscribe to newsletter').isChecked(),
    ).toBeTruthy();

    // Select the radio button
    await page.getByLabel('XL').check();
    ```

  - Select options → select
    select 엘리먼트를 단일/다중 선택 시 사용
    특정 옵션에 value, label 선택이 가능
    locator.selectOption() 대체해서 사용가능

    ```tsx
    // Single selection matching the value
    await page.getByLabel('Choose a color').selectOption('blue');

    // Single selection matching the label
    await page.getByLabel('Choose a color').selectOption({ label: 'Blue' });

    // Multiple selected items
    await page
      .getByLabel('Choose multiple colors')
      .selectOption(['red', 'green', 'blue']);
    ```

  - Mouse Click → click

    - DOM이 접근이 가능할 때까지 대기
    - DOM이 보여질 때까지 대기(no empty, no display:none, no visibility:hidden)
    - 움직임이 멈출때까지 대기(예: transition finishes)
    - 뷰포트 안에 엘리먼트가 보여질 경우(scroll)
    - 엘리먼트가 다른 엘리먼트에 가려지지 않을 때까지 대기
    - 엘리먼트가 detach 된다면 다시 attach 될때까지 대기
    - 강제클릭: 다른 엘리먼트에 의해서 가려질 경우 강제로 클릭 가능
    - dispatchEvent: 사용자의 입력과 상관없이 클릭 이벤트만 전달하고 싶은경우

    ```tsx
    // Generic click
    await page.getByRole('button').click();

    // Double click
    await page.getByText('Item').dblclick();

    // Right click
    await page.getByText('Item').click({ button: 'right' });

    // Shift + click
    await page.getByText('Item').click({ modifiers: ['Shift'] });

    // Hover over element
    await page.getByText('Item').hover();

    // Click the top left corner
    await page.getByText('Item').click({ position: { x: 0, y: 0 } });

    // Force Click
    await page.getByRole('button').click({ force: true });

    // Dispatch Click
    await page.getByRole('button').dispatchEvent('click');
    ```

  - Upload files
    input 엘리먼트 type=”file”인 경우 사용이 가능
    locator.setInputFiles() 대체 가능
    엘리먼트가 동적으로 생성된 경우 waitForEvent로 대기 가능(page.on(’filechooser’) 대체 가능)

    ```tsx
    // Select one file
    await page.getByLabel('Upload file').setInputFiles('myfile.pdf');

    // Select multiple files
    await page
      .getByLabel('Upload files')
      .setInputFiles(['file1.txt', 'file2.txt']);

    // Remove all the selected files
    await page.getByLabel('Upload file').setInputFiles([]);

    // Upload buffer from memory
    await page.getByLabel('Upload file').setInputFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is test'),
    });

    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('Upload file').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('myfile.pdf');
    ```

  - Focus Element
    locator.focus() 함수로 대체 가능
    ```tsx
    await page.getByLabel('Password').focus();
    ```
  - Drag and Drop
    locator.dragTo() 대체 가능
    lower-level 함수로 대체할 경우(locator.hover, mouse.down, mouse.move, mouse.up 사용가능)

    ```tsx
    // drag and drop
    await page
      .locator('#item-to-be-dragged')
      .dragTo(page.locator('#item-to-drop-at'));

    // lower-level
    await page.locator('#item-to-be-dragged').hover();
    await page.mouse.down();
    await page.locator('#item-to-drop-at').hover();
    await page.mouse.up();
    ```

- Assertions

  - List of assertions
    ```tsx
    expect(locator).toBeChecked() → Checkbox is checked
    expect(locator).toBeDisabled() → Element is disabled
    expect(locator).toBeEditable() → Element is enabled
    expect(locator).toBeEmpty() → Container is empty
    expect(locator).toBeEnabled() → Element is enabled
    expect(locator).toBeFocused() → Element is focused
    expect(locator).toBeHidden() → Element is not visible
    expect(locator).toBeInViewport() → Element intersects viewport
    expect(locator).toBeVisible() → Element is visible
    expect(locator).toContainText() → Element contains text
    expect(locator).toHaveAttribute() → Element has a DOM attribute
    expect(locator).toHaveClass() → Element has a class property
    expect(locator).toHaveCount() → List has exact number of children
    expect(locator).toHaveCSS() → Element has CSS property
    expect(locator).toHaveId() → Element has an ID
    expect(locator).toHaveJSProperty() → Element has a JavaScript property
    expect(locator).toHaveScreenshot() → Element has a screenshot
    expect(locator).toHaveText() → Element matches text
    expect(locator).toHaveValue() → Input has a value
    expect(locator).toHaveValues() → Select has options selected
    expect(page).toHaveScreenshot() → Page has a screenshot
    expect(page).toHaveTitle() → Page has a title
    expect(page).toHaveURL() → Page has a URL
    expect(apiResponse).toBeOK() → Response has an OK status
    ```
  - Negating Matchers
    ```tsx
    expect(value).not.toEqual(0);
    await expect(locator).not.toContainText('some text');
    ```
  - Soft Assertions
    기본적으로 테스트 실패 시 실행이 종료되지만, soft assertion 일 경우에는 종료가 되지 않는다.
    실패 여부를 체크하기 위해서 [test.info](http://test.info) 사용 가능

    ```tsx
    // Make a few checks that will not stop the test when failed...
    await expect.soft(page.getByTestId('status')).toHaveText('Success');
    await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

    // ... and continue the test to check more things.
    await page.getByRole('link', { name: 'next page' }).click();
    await expect
      .soft(page.getByRole('heading', { name: 'Make another order' }))
      .toBeVisible();

    // test.info
    //// Make a few checks that will not stop the test when failed...
    await expect.soft(page.getByTestId('status')).toHaveText('Success');
    await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

    //// Avoid running further if there were soft assertion failures.
    expect(test.info().errors).toHaveLength(0);
    ```

  - Custom Expect Message
    특정 에러 메시지를 표현
    expect.soft 대체 가능

    ```tsx
    await expect(page.getByText('Name'), 'should be logged in').toBeVisible();

    Error: should be logged in

    // Call log:
    //   - expect.toBeVisible with timeout 5000ms
    //   - waiting for "getByText('Name')"

    //   2 |
    //   3 | test('example test', async({ page }) => {
    // > 4 |   await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
    //     |                                                                  ^
    //   5 | });
    //   6 |

    // 동일한 코드
    expect.soft(value, 'my soft assertion').toBe(56);
    ```

  - Polling
    동기식 폴링일 경우 expect, 비동기 폴링일 경우 expect.poll
    특히, API 호출에서 많이 사용

    ```tsx
    await expect
      .poll(
        async () => {
          const response = await page.request.get('https://api.example.com');
          return response.status();
        },
        {
          // Custom error message, optional.
          message: 'make sure API eventually succeeds', // custom error message
          // Poll for 10 seconds; defaults to 5 seconds. Pass 0 to disable timeout.
          timeout: 10000,
        },
      )
      .toBe(200);

    await expect
      .poll(
        async () => {
          const response = await page.request.get('https://api.example.com');
          return response.status();
        },
        {
          // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
          intervals: [1_000, 2_000, 10_000],
          timeout: 60_000,
        },
      )
      .toBe(200);
    ```

  - Retrying

    ```tsx
    // API 응답이 성공할 때까지 코드 블록을 재 실행
    await expect(async () => {
      const response = await page.request.get('https://api.example.com');
      expect(response.status()).toBe(200);
    }).toPass();

    // API 응답에 재시도 간격에 대해서 사용자 지정 시간을 세팅
    await expect(async () => {
      const response = await page.request.get('https://api.example.com');
      expect(response.status()).toBe(200);
    }).toPass({
      // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
      intervals: [1_000, 2_000, 10_000],
      timeout: 60_000,
    });
    ```

- Locators
  page.getByRole() → 접근성 속성을 찾을 경우

  - 보조 기술이 페이지를 인식하는 방법을 사용할 경우 사용
    page.getByLabel() → form 컨트롤 라벨 텍스트 찾을 경우
  - form fields 찾을 경우 사용
    page.getByPlaceholder() → placeholder 찾은 경우
  - 엘리먼트에 label이 없고 placeholder 텍스트가 있는경우 사용
    page.getByText() → 텍스트 찾을 경우
  - 인터렉션이 없는 엘리먼트의 텍스트를 찾을 경우(div, span, p) 사용
  - 인터렉션이 있는 엘리먼트(button, a, input): page.getByLabel
    page.getByAltText() → 대체 텍스트를 찾을 경우
  - img, area 엘리먼트 처럼 대체 텍스트가 있는 경우 사용
    page.getByTitle() → 타이틀 속성을 찾을 경우
  - 엘리먼트 title 속성이 있는경우
    page.getByTestId() → data-testid 속성을 찾을 경우
  - text, role 사용할 없거나, testid를 사용이 가능할 경우 사용
    Filtering Locators
  - 엘리먼트 내부에 특정 값을 검색할 경우 filter 사용
  - hasText: 텍스트 검색, has: locator 검색

  ```tsx
  // hasText
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Product 2' })
    .getByRole('button', { name: 'Add to cart' })
    .click();

  // has
  await page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })
    .getByRole('button', { name: 'Add to cart' })
    .click();
  ```

  Get by nth item

  - 특정 엘리먼트 배열의 인덱스 접근 가능
  - locator.first(), locator.last(), locator.nth() 대체 가능

  ```tsx
  const banana = await page.getByRole('listitem').nth(1);
  ```

  Rare Use cases

  - Iterate elements
  - Iterate using regular for loop
  - Evaluate in the page → DOM api 사용할 경우

  ```tsx
  // Iterate elementsPlaywright-Tutorial.png
  for (const row of await page.getByRole('listitem').all())
    console.log(await row.textContent());

  // Iterate using regular for loop
  const rows = page.getByRole('listitem');
  const count = await rows.count();
  for (let i = 0; i < count; ++i) console.log(await rows.nth(i).textContent());

  // Evaluate in the page
  const rows = page.getByRole('listitem');
  const texts = await rows.evaluateAll(list =>
    list.map(element => element.textContent),
  );
  ```

# **참고페이지**

- [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
- [https://hyperconnect.github.io/2022/01/28/e2e-test-with-playwright.html](https://hyperconnect.github.io/2022/01/28/e2e-test-with-playwright.html)
