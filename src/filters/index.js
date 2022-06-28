// 引入dayjs
import dayjs from 'dayjs'

export const formatDate = (time) => {
  return dayjs(time).format('YYYY-MM-DD')
}
