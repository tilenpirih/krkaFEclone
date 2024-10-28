import axiosWrapper from 'axios'

export async function axios(path: string, options: any = {}) {
  const token = process.client ? localStorage.getItem('access_token') : null
  const runtimeConfig = useRuntimeConfig()
  try {
    const response = await axiosWrapper({
      method: 'get',
      url: `${runtimeConfig.public.API_URL}${path}`,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
      ...options,
    })
    return response
  }
  catch (error: any) {
    console.error('Error fetching data:', error)
    return error.response || error
  }
}
