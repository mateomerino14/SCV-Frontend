const BASE_URL = import.meta.env.VITE_API_URL

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_corporativo: email, contrasenia: password })
  })
  return res.json()
}

export const checkEmail = async (email) => {
  const res = await fetch(`${BASE_URL}/usuario/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_corporativo: email })
  })
  return res.json()
}

export const sendCode = async (email) => {
  const res = await fetch(`${BASE_URL}/login/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_corporativo: email })
  })
  return res.json()
}

export const verifyCode = async (email, codigo) => {
  const res = await fetch(`${BASE_URL}/login/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_corporativo: email, codigo })
  })
  return res.json()
}