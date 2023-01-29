import { ElLoading } from 'element-plus'

export async function useFullScreenLoading(callback) {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  for(const fn of callback) await fn()
  loading.close()
}