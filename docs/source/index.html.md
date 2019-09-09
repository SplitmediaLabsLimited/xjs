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

| Parameter | Type         | Required | Default                  | Description                                       |
| --------- | ------------ | -------- | ------------------------ | ------------------------------------------------- |
| config    | [XjsTypes]() | false    | { type: XjsTypes.Local } | Set the default configuration of the Xjs instance |

### Returns

A Xjs instance

## getView

> Get a specific view

```javascript
xjs.getView(0).then(view => {
  return view.getScenes();
});
```

Get an instance of a [View]() based on the index.

<aside class="notice">
Note that the usual "main" view that is used by both the stream and the XSplit Broadcaster Stage is `0`
</aside>

### Parameters

| Parameter | Type   | Required | Default | Description                                                                                                                                      |
| --------- | ------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| index     | number | true     | null    | The index of the View. The main view is always 0, which is what you see by default in the main stage, and is also used when you record or stream |

### Returns

A [View]() instance
