import React, { FC } from 'react'
import { dateTimeToString } from '../../../../../functions/dateTimeUtils'
import { TimeTypes } from '../../../../../types/util/dateTimeTypes'

interface CountUpRelativeTimeProps {
  time: TimeTypes;
}

const CountUpRelativeTime: FC<CountUpRelativeTimeProps> = ({ time }) => {
  return (
    <>
      {dateTimeToString(
        time, {
          isAbsolute: false,
          countUpTime: true,
          conversion: {maxConvertTimeSizeUnit: "hours",
          minTruncateTimeSizeUnit: "minutes"},
          truncateNotReachDigit: false
      })}
    </>
  )
}

export default CountUpRelativeTime