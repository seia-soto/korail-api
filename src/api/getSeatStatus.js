import qs from 'qs'

import {
  getDate,
  getTime
} from '../utils'
import ajv from '../ajv'
import * as constants from '../constants'
import instance from '../instance'

const schema = {
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
const validate = ajv.compile(schema)

export default (options = {}) => {
  if (!validate(options)) {
    throw new Error(validate.errors)
  }

  const data = {}

  // NOTE: adult-only passengers
  data.txtPsgFlg_1 = options.passengers.adult || 0
  // NOTE: child + infant passengers
  data.txtPsgFlg_2 = (options.passengers.child || 0) + (options.passengers.infant || 0)
  // NOTE: elder passengers
  data.txtPsgFlg_3 = options.passengers.elder || 0
  // NOTE: severely-disabled passengers
  data.txtPsgFlg_4 = options.passengers.severelyDisabled || 0
  // NOTE: midly-disabled passengers
  data.txtPsgFlg_5 = options.passengers.midlyDisabled || 0

  // NOTE: Check total count of passengers
  const passengerTypes = Object.keys(data)
  let total

  for (let i = 0, l = passengerTypes.length; i < l; i++) {
    const type = passengerTypes[i]
    const count = data[type] || 0

    // NOTE: Add padding to the count
    data[type] = String(count).padStart(2, '0')
    // NOTE: Add current passenger count into total counter
    total += count
  }

  if (total < 0 || total > 9) {
    throw new Error('You cannot set the sum of passenger count 1 to 9.')
  }

  // NOTE: Set device type to iPhone
  data.Device = 'IP'

  // NOTE: Set time related values
  data.txtGoAbrdDt = getDate(options.time)
  data.txtGoHour = getTime(options.time)

  // NOTE: Set station data
  data.txtGoStart = options.station.source
  data.txtGoEnd = options.station.destination

  // NOTE: Set transfer, 1 for direct, 2 for transfer
  data.radJobId = String(Number(options.transfer || false) + 1)

  // NOTE: Set type of seat
  const seatTypes = {
    normal: '015',
    'with-child': '019',
    wheelchair: '021',
    'auto-wheelchair': '028',
    'second-floor': '018',
    bicycle: '032'
  }

  data.txtSeatAttCd_4 = seatTypes[options.seat || 'normal']

  // NOTE: Set type of train
  const trainTypes = {
    all: '109',
    ktx: '100',
    saemaeul: '101',
    mugunghwa: '102',
    itx: '104',
    commute: '103'
  }

  data.selGoTrain = trainTypes[options.train || 'all']
  data.txtTrnGpCd = data.selGoTrain

  // NOTE: Set if round trip required
  data.rtYn = ['N', 'Y'][Number(options.roundTrip || false)]

  // NOTE: Set unknown values
  data.ebizCrossCheck = 'Y'
  data.adjStnScdlOfrFlg = 'Y'
  data.srtCheckYn = 'Y'
  data.txtSeatAttCd_2 = '000'
  data.txtSeatAttCd_3 = '000'

  // NOTE: Set fixed values
  data.key = constants.key
  data.Version = constants.version
  data.txtMenuId = '11'

  return instance('classes/com.korail.mobile.seatMovie.ScheduleView?' + qs.stringify(data), {
    method: 'POST',
    header: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    json: data
  })
}
