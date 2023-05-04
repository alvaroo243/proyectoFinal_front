import { useEffect, useState } from 'react'
import { request } from '../../utils/request'
import Entrada from '../../components/Inputs/Entrada'
import EntradaPassword from '../../components/Inputs/EntradaPassword'
import BotonAccion from '../../components/Buttons/BotonAccion'
import { validadorEmail } from '../../utils/utils'
const ENV = import.meta.env

export default function Login({
  titulo = "Login",
  onFinish = (_usuario) => {
    return window.location = '/'
  }
}) {

  const [login, setLogin] = useState({})
  const [error, setError] = useState(null)

  const hacerLogin = async () => {
    if (!login.email || !login.password) return setError("Email o contraseña vacios")
    if (!validadorEmail.test(login.email)) return setError("Email no valido.")

    try {
      
      const getLogin = await request({
        url: '/login',
        method: 'POST',
        options: {
          email: login.email,
          password: login.password
        }
      })

      console.log( getLogin )

      if (getLogin && getLogin.token) {
        localStorage.setItem('token', getLogin.token)
        return onFinish(getLogin)
      } else {
        setError(getLogin.message)
      }

    } catch (error) {
      setError(error)      
    }
  }

  return (
    <>
    <h2>{titulo}</h2>
    <Entrada 
      label={"Email"}
      value={login.email}
      onChange={(valor) => {
        setLogin({...login, email: valor})
        setError(null)
      }}
    />
    <EntradaPassword 
      label={"Contraseña"}
      value={login.password}
      onChange={(valor) => {
        setLogin({...login, password: valor})
        setError(null)
      }}
    />
    <BotonAccion
      text='Enviar'
      onClick={() => hacerLogin()}
    />
    {error && <p className='red'>❗ Login incorrecto: ({error})</p>}
    </>
  )
}
