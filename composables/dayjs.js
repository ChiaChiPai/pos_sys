import dayjs from 'dayjs'

export const useFormatDateTime = (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')