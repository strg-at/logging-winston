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
