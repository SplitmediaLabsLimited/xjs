XSplit JS Framework

[![Build Status](https://travis-ci.org/xjsframework/xjs.svg?branch=master)](https://travis-ci.org/xjsframework/xjs)

The XSplit JS Framework allows developers to create plugins for XSplit Broadcaster.

Please visit [the official website](http://xjsframework.github.io/) for documentation and more information.

## Local XSplit CEF regression

Serve the examples and regression extension on port `3999`:

```sh
npm run examples
```

When the extension page is already attached in XSplit Broadcaster, run:

```sh
npm run test:xsplit:cdp
```

When CDP is reachable on `127.0.0.1:9222` but the extension page is not the active target, run:

```sh
npm run test:xsplit:cdp:attached
```

That wrapper navigates an existing XSplit CEF target to `http://localhost:3999/xsplit-extension/index.html`. Each run writes timestamped artifacts under `artifacts/xsplit-cdp/` and updates `artifacts/xsplit-cdp/latest-summary.json` with the latest result path, pass/fail state, browser metadata, and screenshot path.

If you wish to contribute, check the [issue list](https://github.com/xjsframework/xjs/issues)! Drop a comment if you need more information before you start working on a pull request. Information on our deliverable roadmap is posted on [the wiki](https://github.com/xjsframework/xjs/wiki).
