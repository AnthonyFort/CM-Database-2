export const setToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token)
}

export const getToken = (tokenName) => {
  return localStorage.getItem(tokenName)
}

export const tokenIsValid = (tokenName) => {
  
  const exp = getPayload(tokenName).exp
  const now = Date.now() / 1000
  return exp > now
}

export const getPayload = (tokenName) => {
  const token = getToken(tokenName)
  if (!token) return false
  return JSON.parse(atob(token.split('.')[1]))
}