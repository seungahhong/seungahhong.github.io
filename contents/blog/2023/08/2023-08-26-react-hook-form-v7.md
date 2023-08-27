---
layout: post
title: react-hook-form v7
date: 2023-08-26
published: 2023-08-26
category: 개발
tags: ['form']
comments: true,
thumbnail: './assets/26/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# 설치

```bash
npm i react-hook-form@latest // react-hook-form: "^7.0.0"
npm i @hookform/resolvers@latest // @hookform/resolvers: "^2.0.0" if you are using resolvers
npm i @hookform/devtools@latest  // @hookform/devtools: "^3.0.0" if you are using devtools
```

# react-hook-form v5 → v7 변경사항

## useForm

config 파일명에 prefix에 validation 삭제
errors 객체가 formState 객체 속성으로 변경
shouldUnregister 기본 값이 false → true로 수정

```tsx
const { register } = useForm({
  - validationResolver: undefined,
  + resolver: undefined,

  - validationContext: undefined,
  + context: undefined,

  - validateCriteriaMode: "firstError",
  + criteriaMode: "firstError",

  - submitFocusError: true,
  + shouldFocusError: true,

  - shouldUnregister: false,
  + shouldUnregister: true, // 디폴트값이 true로 설정
})

- const { errors } = useForm();
+ const { formState: { errors } } = useForm();
```

## validationSchema → resolver

resolver 3번째 인자로 options 객체 설정 추가

```bash
npm install @hookform/resolvers
```

```tsx
- resolver: (values: any, context?: object) => Promise<ResolverResult> | ResolverResult
+ resolver: (
+    values: any,
+    context?: object,
+    options: {
+       criteriaMode?: 'firstError' | 'all',
+       names?: string[],
+       fields: { [name]: field } // Support nested field
+    }
+  ) => Promise<ResolverResult> | ResolverResult
```

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    age: yup.number().required(),
  })
  .required();

const App = () => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(d => console.log(d))}>
      <input {...register('name')} />
      <input type="number" {...register('age')} />
      <input type="submit" />
    </form>
  );
};
```

## register

register 메서드를 더 이상 ref에 할당하지 않고, input props에 spread 연산으로 처리해준다.
return the following props: `onChange`, `onBlur`, `name` and `ref`.

```tsx
- <input ref={register({ required: true })} name="test" />
+ <input {...register('test', { required: true })} />
```

codemod library 적용

```tsx
npx @hookform/codemod v7/update-register
```

배열 형태의 객체를 얻어오기 위한 문맥 처리를 [] 배열에서 . 으로 구분하도록 수정
단, 대괄호를 사용한 코드에 대해서도 정상적으로 동작은 됨

```tsx
- test[2].test
+ test.2.test
```

Custom register
register에 name attribute를 넣을 필요없이, 1번째 인자에 name 넣어주면 됩니다.

```tsx
-register({ name: 'test' }) + register('test');
```

validate 함수 호출 전에 valueAs가 선 실행됨

```tsx
- <input ref={register({ valueAsNumber: true, validate: (value) => parseInt(value) === 2 ) })} name="test" />
+ <input {...register('test', { valueAsNumber: true, validate: (value) => value === 2 ) }} /> // no longer need to parse again
```

register를 구조 분해 시 render 전에 호출해서 값을 넘겨야함

```tsx
const { ref, ...rest } = register('test') // invoke this before render

<Input {...rest} inputRef={ref} />
```

## Controller

API 사용법이 간단해졌고, 이전 props도 render method에 props로 변경됨
as prop 삭제되었고, render props에 field, fieldState가 포함되었음

- field: onChange, onBlur, Value
- fieldState: isDirty, dirtyFields
  rules에 valueAs\* 메서드를 지원하지 않음.

```tsx
- <Controller as={Input}
-   name="test"
-   onChange={([_, value]) => value}
-   onChangeName="onTextChange"
-   onBlur={([_, value]) => value}
-   onBlurName="onTextChange"
-   valueName="textValue"
- />

+ <Controller name="test"
+   render={({ onChange, onBlur, value }) => {
+     return <Input
+       valueName={value}
+       onTextChange={(val) => onChange(value)}
+       onTextBlur={(val) => onBlur(value)}
+     />
+   }}
+ />

- <Controller as={<input />} />
+ <Controller render={({ field }) => <input {...field} />}

- <Controller render={(props, meta) => <input {...props} />} />
+ <Controller render={({ field, fieldState }) => <input {...field} />} />
```

## flat form option values(not support)

기본적으로 중첩된 객체를 리턴

```tsx
-watch({ nest: true });
+watch();

-getValues({ nest: true });
+getValues();
```

## triggerValidation → trigger

메서드 명이 trigger로 변경
trigger에 리턴값이 void로 변경

```tsx
-triggerValidation();
+trigger();

-(await trigger('test')) + // Returns true|false
  (await trigger('test')); // Returns void
```

## FormContext → FormProvider

컴포넌트 명이 FormProvider 변경

```tsx
- <FormContext {...methods}>
+ <FormProvider {...methods}>
```

## Dirty → isDirty

```tsx
- const { dirty } = formState;
+ const { isDirty } = formState;
```

## dirtyFields

dirtyFields method 호출이 아닌 객체 속성을 접근하도록 수정

```tsx
- const { dirtyFields } = formState;
- dirtyFields.has('test');
+ const { dirtyFields } = formState;
+ dirtyFields.test;
```

## ErrorMessage

error core 라이브러리 분리

```bash
npm install @hookform/error-message
```

## clearError → clearErrors

```tsx
-clearError('test') + clearErrors('test');
```

## setError

속성을 받는 로직이 인자에서 객체로 변경
setError에 인자로 배열을 받는 로직 삭제되고 1개만 에러를 세팅하도록 수정
setError 3번째 인자로 옵션 설정 객체 추가

```tsx
- setError('test', 'required', 'message')
+ setError('test', { type: 'required', message: 'message' })

- setError([ { name: 'test1', type: "max", }, { name: 'test', type: "min", } ])
+ [
+   { name: 'test1', type: "max" },
+   { name: 'test', type: "min" }
+ ].forEach(({ name, type }) => setError(name, { type }))

- setError('test', { type: 'type', message: 'issue', shouldFocus: true })
+ setError('test', { type: 'type', message: 'issue' }, { shouldFocus: true })
```

## setValue

setValue 시 디폴트로 dirty 필드가 추가되었고, 여러 오류 지원 중지, 배열 받는 로직 삭제

```tsx
-setValue('test', 'data') +
  setValue('test', 'data', { shouldDirty: true }) -
  setValue([{ test: '1' }, { test1: '2' }]) +
  [{ name: 'test', value: 'data' }].forEach(({ name, value }) =>
    setValue(name, value),
  );
```

## TypedController, useTypedController(not support)

TypedController → Controller
useTypedController → useController

```tsx
- <TypedController
-   as="textarea"
-   name={['nested', 'object', 'test']}
-   defaultValue=""
-   rules={{ required: true }}
- />
+ <Controller
+   name={'nested.object.test'}
+   defaultValue=""
+   rules={{ required: true }}
+   render={({ field }) => <textarea {...field} />}
+ />);
```

## useFieldArray

focus 처리에 대한 속성 문법 변경, 타입 제네릭 추가, name 타입 체크 시 const로 형변환(엄격한 타입 체크로 인한 처리)

```tsx
-append({ test: 'test' }, false);
+append({ test: 'test' }, { shouldFocus: false });

-useFieldArray<FieldArrayValues>();
+useFieldArray();

<input {...register(`test.${index}.firstName` as const)} />;
```

## touched → touchedFields

```tsx
- const { touched } = formState;
+ const { touchedFields } = formState;
```

## watch

watch 리턴값이 객체에서 배열로 변경

```tsx
- const { test, test1 } = watch(['test', 'test1']);
+ const [test, test1] = watch(['test', 'test1']);
```

## reset

2번재 인자가 좀 상세하게 설정할 수 있도록 수정

```tsx
- reset(values, { isDirty: true })
+ // second argument is still optional
+ reset(values, {
+   keepDefaultValues: true, // new
+   keepValues: true, // new
+   keepDirty: true,
+ })
```
