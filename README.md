# Seia-Soto/Korail-API

The simple Korail iOS API client based on got instance.

> **Warning**
>
> This library comes without warrenty or any permissions! I never take responsibility to any side-effected caused by using this library.

## Table of Contents

- [Introduction](#introduction)
- [API](#api)
- [LICENSE](#license)

----

# Introduction

In this section, I describe actually `why` I choose stuffs.

## Debugging iOS application over Android

It's commonly harder to publish upgrade and apply application updates to end user on iOS.
In long-term usage, iOS application is better choice to debug.

# API

Currently, Korail-API supports following APIs.
To install, use following command:

```sh
yarn add git+https://github.com/Seia-Soto/korail-api#[version]
```

To import:

```js
// CJS
const { korail } = require('korail-api')

// ESM
import { korail } from 'korail-api'
```

Before using actual API, checkout what options available and required via viewing the source-code.
Every option will be checked with AJV, in other word, your option will be checked with JSON schema before actually getting things happened.

## getSeatStatus

This API returns `got` instance with ready to go to check the status of seat.

- Example usage:

```js
korail.getSeatStatus({
  time: 0, // NOTE: (optional) Date compatible integer, for example: Date.now()
  station: { // NOTE: (required) The name of stations
    source: '수원',
    destination: '서울'
  },
  passengers: { // NOTE: (required) 1~9 people at maximum
    adult: 1
  }
})
  .then(response => {
    console.log(response.body)
  })
```

- Option schema:

```js
{
  type: 'object',
  additionalProperties: false,
  required: [
    'station',
    'passengers'
  ],
  properties: {
    time: {
      type: 'integer'
    },
    station: {
      type: 'object',
      additionalProperties: false,
      minProperties: 2,
      properties: {
        source: {
          type: 'string',
          minLength: 1
        },
        destination: {
          type: 'string',
          minLength: 1
        }
      }
    },
    passengers: {
      type: 'object',
      additionalProperties: false,
      minProperties: 1,
      properties: {
        adult: {
          type: 'integer',
          minimum: 0,
          maximum: 9
        },
        child: {
          type: 'integer',
          minimum: 0,
          maximum: 9
        },
        infant: {
          type: 'integer',
          minimum: 0,
          maximum: 9
        },
        elder: {
          type: 'integer',
          minimum: 0,
          maximum: 9
        },
        severelyDisabled: {
          type: 'integer',
          minimum: 0,
          maximum: 9
        },
        midlyDisabled: {
          type: 'integer',
          minimum: 0,
          maximum: 9
        }
      }
    },
    transfer: {
      type: 'boolean'
    },
    seat: {
      type: 'string',
      enum: [
        'normal', // NOTE: 일반석
        'with-child', // NOTE: 유아동석
        'wheelchair', // NOTE: 휠체어
        'auto-wheelchair', // NOTE: 전동휠체어
        'second-floor', // NOTE: 2층석
        'bicycle' // NOTE: 자전거
      ]
    },
    train: {
      type: 'string',
      enum: [
        'all', // NOTE: 전체
        'ktx', // NOTE: KTX
        'saemaeul', // NOTE: 새마을
        'mugunghwa', // NOTE: 무궁화
        'itx', // NOTE: ITX-청춘
        'commute' // NOTE: 통근열차
      ]
    },
    roundTrip: { // NOTE: 편도 여부
      type: 'boolean'
    }
  }
}
```

# LICENSE

This project is distributed with [MIT license](/LICENSE) and doesn't include any warrenty or permission.
