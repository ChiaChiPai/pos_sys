import { ElMessage } from 'element-plus'

export default function({ msg, error }) {
  ElMessage.error(msg)
  throw createError(error)
}