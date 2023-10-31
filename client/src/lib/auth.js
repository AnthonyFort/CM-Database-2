
// Stores access and refresh tokens in local storage
export const setToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token)
}

// Fetches tokens from local storage
export const getToken = (tokenName) => {
  return localStorage.getItem(tokenName)
}

// Retrieves payload of the JWT
export const getPayload = (tokenName) => {
  const token = getToken(tokenName)
  if (!token) return false
  return JSON.parse(atob(token.split('.')[1]))
}

// Checks the validity of tokens 
export const tokenIsValid = (tokenName) => {
  
  const exp = getPayload(tokenName).exp
  const now = Date.now() / 1000
  return exp > now
}

