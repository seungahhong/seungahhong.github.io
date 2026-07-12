---
layout: post
title: react-hook-form v7
date: 2023-08-26
published: 2023-08-26
category: Development
tags: ['form']
comments: true,
thumbnail: './assets/26/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# Installation

```bash
npm i react-hook-form@latest // react-hook-form: "^7.0.0"
npm i @hookform/resolvers@latest // @hookform/resolvers: "^2.0.0" if you are using resolvers
npm i @hookform/devtools@latest  // @hookform/devtools: "^3.0.0" if you are using devtools
```

# react-hook-form v5 → v7 changes

## useForm

Removed the `validation` prefix from config option names
The `errors` object was moved to become a property of the `formState` object
The default value of `shouldUnregister` was changed from `false` to `true`

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

Added an `options` object as the third argument to `resolver`

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

The `register` method is no longer assigned to a `ref`; instead it is spread onto the input props.
return the following props: `onChange`, `onBlur`, `name` and `ref`.

```tsx
-(<input ref={register({ required: true })} name="test" />) +
<input {...register('test', { required: true })} />;
```

Apply the codemod library

```tsx
npx @hookform/codemod v7/update-register
```

Changed the notation for accessing array-shaped objects from `[]` brackets to `.` separators.
That said, code using bracket notation still works correctly.

```tsx
- test[2].test
+ test.2.test
```

Custom register
Instead of passing a `name` attribute to `register`, just pass the name as the first argument.

```tsx
-register({ name: 'test' }) + register('test');
```

`valueAs` now runs before the `validate` function is invoked

```tsx
- <input ref={register({ valueAsNumber: true, validate: (value) => parseInt(value) === 2 ) })} name="test" />
+ <input {...register('test', { valueAsNumber: true, validate: (value) => value === 2 ) }} /> // no longer need to parse again
```

When destructuring `register`, you must call it before render and pass the values through

```tsx
const { ref, ...rest } = register('test') // invoke this before render

<Input {...rest} inputRef={ref} />
```

## Controller

The API is simpler to use, and the previous props are now passed as props to the `render` method.
The `as` prop was removed, and `field` and `fieldState` are now included in the render props.

- field: onChange, onBlur, Value
- fieldState: isDirty, dirtyFields
  `rules` no longer supports the `valueAs*` methods.

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

Returns a nested object by default

```tsx
-watch({ nest: true });
+watch();

-getValues({ nest: true });
+getValues();
```

## triggerValidation → trigger

The method name was changed to `trigger`
The return value of `trigger` was changed to `void`

```tsx
-triggerValidation();
+trigger();

-(await trigger('test')) + // Returns true|false
  (await trigger('test')); // Returns void
```

## FormContext → FormProvider

The component name was changed to `FormProvider`

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

Changed so that you access `dirtyFields` as an object property rather than calling it as a method

```tsx
- const { dirtyFields } = formState;
- dirtyFields.has('test');
+ const { dirtyFields } = formState;
+ dirtyFields.test;
```

## ErrorMessage

Split out from the error core library

```bash
npm install @hookform/error-message
```

## clearError → clearErrors

```tsx
-clearError('test') + clearErrors('test');
```

## setError

The logic for receiving properties was changed from arguments to an object
The logic that accepted an array as an argument to `setError` was removed, so it now sets only a single error
Added an options object as the third argument to `setError`

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

With `setValue`, the dirty field is now added by default, support for multiple errors was dropped, and the logic that accepted an array was removed

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

Changed the property syntax for focus handling, added type generics, and cast the `name` to `const` during type checks (due to stricter type checking)

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

The return value of `watch` was changed from an object to an array

```tsx
- const { test, test1 } = watch(['test', 'test1']);
+ const [test, test1] = watch(['test', 'test1']);
```

## reset

The second argument was updated to allow more detailed configuration

```tsx
- reset(values, { isDirty: true })
+ // second argument is still optional
+ reset(values, {
+   keepDefaultValues: true, // new
+   keepValues: true, // new
+   keepDirty: true,
+ })
```
