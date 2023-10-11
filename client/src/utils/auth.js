import { useNavigate } from 'react-router-dom'

const tokenName = 'user-token '

export function setToken(token){
  localStorage.setItem(tokenName, token)
}

export function getToken(){
  return localStorage.getItem(tokenName)
}

export function removeToken(tokenNames = ['access-token', 'refresh-token']) {
  tokenNames.forEach(tokenName => localStorage.removeItem(tokenName))

}

export function isAuthenticated(){
  const token = getToken()
  if (!token) return false
  const payload = JSON.parse(window.atob(token.split('.')[1]))
  const payloadExpiry = payload.exp
  const now = Date.now() / 1000
  const userID = payload.sub
  if (payloadExpiry > now){
    return userID
  } else {
    removeToken()
    return false
  }
}