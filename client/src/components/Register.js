import FormPage from './FormPage'
import axios from 'axios'

export default function Register() {
  const fields = [
    {
      type: 'text',
      name: 'Username',
    },
    {
      type: 'password',
      name: 'Password',
    },
    {
      type: 'password',
      name: 'Password Confirmation',
    }
  ]

  function register(formData){
    return axios.post('/api/register', formData)
  }

  return (
    <FormPage title="Register" request={register} fields={fields} redirect="/login" />
  )
}