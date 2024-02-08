[![Version npm](https://img.shields.io/npm/v/@strg/logging-winston.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@strg/logging-winston)
[![Renovate Status](https://img.shields.io/badge/renovate-enabled-brightgreen?logo=renovatebot&style=for-the-badge)](https://app.renovatebot.com/dashboard)
[![License](https://img.shields.io/github/license/strg-at/logging-winston?style=for-the-badge&color=brightgreen)](https://github.com/strg-at/logging-winston/blob/master/LICENSE)

# @strg/logging-winston
This library provides a preconfigured winston logger that can be used in any typescript or node project it is based on winston3.

## Getting Started

### Prerequisites
- [Node v10](https://nodejs.org) or greater, NPM v6.4.1
<br>
<br>

### Installing the library

```bash
npm install winston @strg/logging-winston
```

### Using the client library
```javascript
import {logger} from '@strg/logging-winston'

logger.info(`${'hello world'}`)

```
### Error "cause"
Аor all errors with a parent "cause", messages and stacktrace will be displayed hierarchically.
```javascript
const error = new Error('Child Error', { cause: new Error('Parent Error')})
logger.error(error) // will display stacktrace and original message for child and parent errors
```

### ENV

|    | Description | Default |
|:---|:------------|:--------|
| **NODE_LOG_FORMAT** | _`SIMPLE`_, _`JSON`_ | `JSON` |
| **NODE_LOG_LEVEL** | _`fatal`_,  _`error`_, _`warn`_, _`info`_, _`trace`_, _`debug`_ | `info` |
| **NODE_LOG_STACK_KEY** | the key of the stacktrace (require `NODE_LOG_FORMAT=JSON`) | `stack_trace` |

<br>
<br>

## Specification
This library aims to standarize the logging output in all node or typescript based applications.
<br>
<br>

## Development

### Testing
`#TBD`

### Coverage Report
`#TBD`

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.
<br>
<br>


## Authors
* **[Nils Müller](mailto:nils.mueller@strg.at)** - *implementation*
