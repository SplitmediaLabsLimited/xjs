---
title: XJS Framework API Reference

language_tabs:
  - javascript

toc_footers:
  - <a href='https://github.com/xjs-framework/xjs'>Github</a>
  - <a href='https://xsplit.com'>XSplit</a>
  - © 2019 <a href='https://www.splitmedialabs.com'>SplitmediaLabs, Ltd.</a>
  - All Rights Reserved.

search: true
---

# Introduction

Welcome to XJS Framework API Reference! XJS Framework allows you to create XSplit Broadcaster plugins
using web technologies, with JavaScript as the language to communicate with XSplit Broadcaster's core
functionalities. This allows you to leverage the web to create visually stunning user interfaces, while
still being able to call native functionalities of XSplit Broadcaster.

This documentation is organized in a way that the center column contains most of the details, while the
dark right column would contain some code examples.

<aside class="warning">
This documentation is for the pre-alpha version of XJS Framework. This documentation is still incomplete, and we would be
updating this as we go.
</aside>

> Installation

```bash
# use npm
npm i xjs-framework@3.0.0-alpha.4

# use yarn
yarn add xjs-framework@3.0.0-alpha.4
```

# Xjs Class

## Constructor

> Creating an Xjs instance:

```javascript
import Xjs from 'xjs-framework';

const xjs = new Xjs();
```

> You can also pass in a configuration:

```javascript
import Xjs from 'xjs-framework';

const xjs = new Xjs({
  type: 'remote',
  sendMessage: message => dummyConnection.send(message),
});
```

> You can have multiple xjs instances:

```javascript
import Xjs from 'xjs-framework';

const xjs = new Xjs();
const remoteXjs = new Xjs({
  type: 'remote',
  sendMessage: message => dummyConnection.send(message),
});
```

You need to create an Xjs instance first to get anything done. It is possible to create multiple Xjs instances, and you can configure an Xjs instance by passing a config object.

### Parameters

| Parameter | Type                                                                                 | Required | Default                  | Description                                       |
| --------- | ------------------------------------------------------------------------------------ | -------- | ------------------------ | ------------------------------------------------- |
| config    | [XjsTypes](https://github.com/dcefram/xjs/blob/3.0-experiment/src/core/xjs/types.ts) | false    | { type: XjsTypes.Local } | Set the default configuration of the Xjs instance |

### Returns

A Xjs instance

## getView

> Get a specific view

```javascript
xjs.getView(0).then(view => {
  return view.getScenes();
});
```

Get an instance of a [View](#view-class) based on the index.

<aside class="notice">
Note that the usual "main" view that is used by both the stream and the XSplit Broadcaster Stage is `0`
</aside>

### Parameters

| Parameter | Type   | Required | Default | Description                                                                                                                                      |
| --------- | ------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| index     | number | true     | null    | The index of the View. The main view is always 0, which is what you see by default in the main stage, and is also used when you record or stream |

### Returns

A [View](#view-class) instance

# App Class

```javascript
import Xjs from 'xjs-framework';

const xjs = new Xjs();
const app = xjs.app;
```

<aside class="warning">
This class is still up for discussion. I'm quite conflicted on having this class or just adding a `getAppProperty` and a `setAppProperty` method to the main Xjs class.
</aside>

## getProperty

> The example below demonstrate how to use `getProperty` with the built-in app properties object.

```javascript
import AppProps from 'xjs-framework/props/app-props.ts';

app.getProperty(AppProps.sceneName, { scene: 0 });
```

> The example below demonstrates how to use `getProperty` with your own custom property object. This is useful when trying out new underlying API even before XJS officially supports it. More info in the [AppProps]() section.

```javascript
const customProps = {
  key: 'customprops',
  getValidator: () => true,
  getTransformer: params => params,
  setValidator: () => true,
  setTransformer: params => params.value,
};

app.getProperty(customProps);
```

This method gets the [application level properties](https://github.com/dcefram/xjs/blob/3.0-experiment/src/props/app-props.ts). XJS provides a list of application properties that you can use, and also allows you to create your own.

### Parameters

| Parameter | Type                                                                                      | Required | Default   | Description                                                                                                                                                                                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prop      | [PropertyType](https://github.com/dcefram/xjs/blob/3.0-experiment/src/props/app-props.ts) | true     | undefined | Pass in the information about the underlying property key to be used, the validators, and how to transform the data received.                                                                                                                                                                     |
| param     | shape                                                                                     | false    | undefined | If the property key has a **variable** in it, you should pass in the value of the variable here. Information about what variable to pass are in the corresponding [application properties' documentation](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) |

### Returns

A Promise with the datatype depending on the application property's `getTransformer` method's return type. More information on this is on the [application properties' documentation](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb).

## setProperty

> The example below demonstrate how to use `setProperty` with the built-in app properties object.

```javascript
import AppProps from 'xjs-framework/props/app-props.ts';

app.setProperty(AppProps.sceneName, { scene: 0, name: 'Game Scene' });
```

> The example below demonstrates how to use `setProperty` with your own custom property object. This is useful when trying out new underlying API even before XJS officially supports it. More info in the [AppProps](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) section.

```javascript
const customProps = {
  key: 'customprops',
  getValidator: () => true,
  getTransformer: params => params,
  setValidator: () => true,
  setTransformer: params => params.value,
};

app.setProperty(customProps, { value: 'some value here' });
```

This method sets the [application level properties](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb). XJS provides a list of application properties that you can use, and also allows you to create your own.

### Parameters

| Parameter | Type                                                                                      | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | ----------------------------------------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| prop      | [PropertyType](https://github.com/dcefram/xjs/blob/3.0-experiment/src/props/app-props.ts) | true     | undefined | Pass in the information about the underlying property key to be used, the validators, and how to transform the data received.                                                                                                                                                                                                                                                                                            |
| param     | { value: any, ...rest }                                                                   | true     | undefined | Pass in a variable that has at the very least, a `value` property (ie. `{ value: <any> }`). As with the `getProperty` counterpart, we should also pass in here the required **variables** based on the property's keys. Information about what variable to pass are in the corresponding [application properties' documentation](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) |

### Returns

A Promise which resolves a string. The string value depends on the response of the underlying core API.

# View Class

## getCurrentScene

> Get the active scene of the selected view

```javascript
xjs.getView(0).then(view => {
  return view.getCurrentScene();
});
```

> Each view could have different current scenes

```javascript
const myViews = {
  main: xjs.getView(0),
  preview: xjs.getView(1),
  projectorX: xjs.getView(10),
};

Object.entries(myViews).map(([label, view]) => {
  return (
    <button
      onClick={() => {
        view.getCurrentScene().then(scene => console.log(scene));
      }}
    >
      label
    </button>
  );
});
```

Get the active scene of the selected view. This would most likely be different across different views.

### Returns

A [Scene](#scene-class) instance

# Scene Class

## getItems

```javascript
const scene = await view.getCurrentScene();
const items = await scene.getItems();

console.log(items);
```

Get the items of the scene instance.

### Returns

A [Item](#item-class) instance

# Item Class

## getProperty

> The example below demonstrate how to use `getProperty` with the built-in item properties object.

```javascript
import ItemProps from 'xjs-framework/props/item-props.ts';

const cname = await item.getProperty(ItemProps.customName);

console.log(cname);
```

> The example below demonstrates how to use `getProperty` with your own custom property object. This is useful when trying out new underlying API even before XJS officially supports it. More info in the [ItemProps](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) section.

```javascript
const customProps = {
  key: 'prop:customprops',
  getValidator: () => true,
  getTransformer: params => params,
  setValidator: () => true,
  setTransformer: params => params,
};

item.getProperty(customProps);
```

This method gets the [item level properties](). XJS provides a list of item properties that you can use, and also allows you to create your own.

### Parameters

| Parameter | Type                                                                                       | Required | Default   | Description                                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------ | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prop      | [PropertyType](https://github.com/dcefram/xjs/blob/3.0-experiment/src/props/item-props.ts) | true     | undefined | Pass in the information about the underlying property key to be used, the validators, and how to transform the data received.                                                             |
| param     | shape                                                                                      | false    | undefined | Information about what variable to pass are in the corresponding [item properties' documentation](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) |

### Returns

A Promise with the datatype depending on the item property's `getTransformer` method's return type. More information on this is on the [item properties' documentation](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb).

## setProperty

<aside class="warning">
Confirm with the team if it makes sense to align the `setTransformer` with App Property's `setTransformer`. That is, the second parameter should always be an object?
</aside>

> The example below demonstrate how to use `setProperty` with the built-in item properties object.

```javascript
import ItemProps from 'xjs-framework/props/item-props.ts';

item.setProperty(ItemProps.customName, 'Main Camera Feed');
```

> The example below demonstrates how to use `setProperty` with your own custom property object. This is useful when trying out new underlying API even before XJS officially supports it. More info in the [ItemProps](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) section.

```javascript
const customProps = {
  key: 'prop:customprops',
  getValidator: () => true,
  getTransformer: params => params,
  setValidator: () => true,
  setTransformer: params => params,
};

item.setProperty(customProps, 'some string here');
```

This method sets the [item level properties](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb). XJS provides a list of item properties that you can use, and also allows you to create your own.

### Parameters

| Parameter | Type                                                                                       | Required | Default   | Description                                                                                                                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------ | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prop      | [PropertyType](https://github.com/dcefram/xjs/blob/3.0-experiment/src/props/item-props.ts) | true     | undefined | Pass in the information about the underlying property key to be used, the validators, and how to transform the data received.                                                                                                                                                                |
| param     | value: any                                                                                 | true     | undefined | Value to pass to the underlying item property. The datatype depends on the validator and transformer of the item property. Please refer to the [item properties' documentation](https://www.notion.so/Application-and-Item-Properties-ef0f548afddb4efc84ee3b06094a92fb) for more information |

### Returns

A Promise which resolves a string. The string value depends on the response of the underlying core API.
