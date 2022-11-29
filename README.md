# ts-ucode

TypeScript tools for OpenWRT ucode.

---

## This is a WIP. It does work, but there is a lot to be done and a lot to improve. PR are welcome!

---

## Usage

### Install `ts2ucode` globally

```shell
npm install -g ts-ucode
```

### Initialize a project dir (for completion and npm scripts)

```shell
# within the directory to initialize
ts2ucode init
```

### Transform TypeScript sources into ucode:

If ran from a ts-ucode initialized directory:

```shell
ts2ucode
```

or from anywhere else:

```shell
ts2ucode <source-dir> <out-dir>
```

## Features

- [ ] compiler
  - [x] compile source dir to target dir
  - [ ] compile standalone source file
  - [ ] user friendly errors using TS diagnostics
- [ ] initialize project
  - [x] create a `package.json` (improvements needed)
  - [x] create a `tsconfig.json` (improvements needed)
  - [ ] ...
- [ ] Typings/IDE completions
  - [x] removed standard JS lib
  - [x] ucode core functions
  - [x] `uloop` (some fixes/improvements needed)
  - [x] `ubus` (some fixes/improvements needed)
  - [x] `fs` (incomplete?)
  - [x] `uci` (incomplete for packages)
  - [x] `math`
  - [ ] `nl80211`
  - [ ] `resolv`
  - [ ] `struct`
  - [ ] `rtnl`
- [ ] transformers
  - [x] default parameters
  - [x] `undefined` => `null`
  - [x] methods to functions
  - [x] arrow function compatibility
  - [x] exports grouped at the end
  - [x] `for (.. of ..)` => `for (.. in ..)`
  - [x] `throw`
  - [x] fixes `import` paths
  - [ ] destructuring arrays
  - [ ] destructuring objects
  - [x] classes
    - [x] `private/protected/public` members (static or not)
    - [x] `constructor` (as well as members in parameters)
    - [x] member initializers
    - [x] inheritance
    - [x] `super` keyword
  - [ ] decorators
    - [ ] functions
    - [ ] class
    - [x] class members
- [ ] test runner (WIP, not even in this repo but to be imported from private closed sources)
  - [ ] run on docker
  - [ ] run on specific device
