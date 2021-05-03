import got from 'got'

import * as constants from './constants'

export default got.extend({
  prefixUrl: 'https://smart.letskorail.com',
  responseType: 'json',
  headers: {
    'User-Agent': constants.agent,
    'Accept-Language': 'ko-KR;q=1, en-GB;q=0.9',
    Accept: 'application/json',
    'Cache-Control': 'no-cache'
  }
})
