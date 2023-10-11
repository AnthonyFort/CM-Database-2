import axios from 'axios'
import { getToken, setToken, tokenIsValid } from './auth'
import jwtDecode from 'jwt-decode'


const axiosAuth = axios.create()

axiosAuth.interceptors.request.use(async (config) => {

  if (!tokenIsValid('access-token')){
 
    if (tokenIsValid('refresh-token')){

      const { data } = await axios.post('/api/auth/refresh/', {
        refresh: getToken('refresh-token'),
      })

      setToken('access-token', data.access)

    } else {
      throw new axios.Cancel('Session expired, please log in again.')
    }
  }


  config.headers.Authorization = `Bearer ${getToken('access-token')}`

  return config
})


export default axiosAuth