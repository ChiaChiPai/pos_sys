import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export const useFormatDateTime = (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export const useFormatDate = (date) => dayjs(date).format('YYYY-MM-DD')

export const useStartOfDay = () => dayjs.tz(dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'), 'Asia/Taipei').format()

export const useEndOfDay = () => dayjs.tz(dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'), 'Asia/Taipei').format()

export const useCurrentTime = () => dayjs().utc().format()

export const useFormatTime = (date) => dayjs(date).utc().format()