# React Demo Application
[![build status](http://git.ungolianth.de/ungolianth/react-test/badges/master/build.svg)](http://git.ungolianth.de/ungolianth/react-test/commits/master)
[![coverage report](http://git.ungolianth.de/ungolianth/react-test/badges/master/coverage.svg)](http://git.ungolianth.de/ungolianth/react-test/commits/master)

# Installation
1. `npm install`

# Development
1. Start SonarQube-Server
   * `vagrant up` will register an instance of SonarQube to `http://localhost:9001`
2. Configure Dev-Environment (`config/dev.ts`)
   * update `proxy` to point to the SonarQube-Server
   * update `project` for development on a specific Project _(use projectKey)_
4. `npm start` will start the dev-server on `http://localhost:8080`

# Production Build
`npm run build` will execute all available tests before building the project, which can be found in `/app`.

**TODO:** If ts-node transpilation fails webpack will carry on and the build will still succeed. This needs to be fixed! 

# Tests
Right now only unittests for the source code are available.

**TODO:** A second set integration tests on the transpiled code should be implemented.


## Unittests
 * `npm test` will run mocha.
 * `npm test:coverage` will also generate a coverage report (for files required by the tests)