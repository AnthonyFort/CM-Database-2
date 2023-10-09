export const setToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token)
}

export const getToken = (tokenName) => {
  return localStorage.getItem(tokenName)
}

export const tokenIsValid = (tokenName) => {
  const token = getToken(tokenName)

  if (!token) return false

  const exp = JSON.parse(atob(token.split('.')[1])).exp
  const now = Date.now() / 1000
  
  return exp > now
}