# Releasing a New Version

This document describes how to release a new version of XSplit JS Framework

1. **Make sure that tests are green**

  Before the release, make sure that all test cases are passed. Execute
`gulp test/unit` first to ensure that all test cases are passing.

2. **Prepare the release branch**

  Merge all branches to develop and then create the release branch. Execute
`gulp version --up --major|minor|patch` to transpile and bundle the project.

  This will update the version number in the `package.json` file and also
creates the bundled `xjs.js` file, along with the minified version and es2015
version.

  *NOTE:* In case you want to specify the version number, you can simply execute
  `gulp version --version 1.5.0`, which would set package.json, bower.json, and
  all the transpiled xjs files' version to 1.5.0.

3. **Prepare the website for release**

  Generate the API Docs by executing `gulp docs` and then copy the necessary files
to `xjsframework.github.io`'s repository and update the tutorials if needed.

4. **Release**

  - Merge release branch to master and add the version tag.
  - Draft a new release in Github
  - Publish to NPM
  - Upload the latest generated xjs files to CDN

5. **Update the Release Notes and/or send the Newsletter**

  - Update the Release Notes in the wiki page
  - Send the newsletter if necessary

6. **Cleanup**

  Verify all issues are closed, and clean outstanding branches.

7. **Done!**

  Release is complete! You may now party.
