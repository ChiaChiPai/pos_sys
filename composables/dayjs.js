import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const useFormatDateTime = (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export const useFormatDate = (date) => dayjs(date).format('YYYY-MM-DD')

export const useStartOfDay = () => dayjs().startOf('day').utc().format()

export const useEndOfDay = () => dayjs().endOf('day').utc().format()

export const useCurrentTime = () => dayjs().utc().format()

export const useFormatTime = (date) => dayjs(date).utc().format()