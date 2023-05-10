import { useState } from 'react'
import { request } from '../../utils/request'
import Entrada from '../../components/Inputs/Entrada'
import EntradaPassword from '../../components/Inputs/EntradaPassword'
import BotonAccion from '../../components/Buttons/BotonAccion'
import { validadorEmail } from '../../utils/utils'
import { useUsuarioContext } from '../../context/UsuarioContext'
import '../../styles/login.scss'
import { Link } from 'react-router-dom'

// Vista de login
export default function Login({
  titulo = "LOGIN",
  onFinish = (_usuario) => {
    // Por defecto se enviara a '/' cuando se finalice el login
    return window.location = '/'
  }
}) {

  // Creamos los estados
  const [login, setLogin] = useState({})
  const [error, setError] = useState(null)

  const validacion = () => {
    if (!login.email || !login.password) {
      setError("Email o contraseña vacios")
      return false
    }
    if (!validadorEmail.test(login.email)) {
      setError("Email no valido.")
      return false
    }
    if (login.email !== "admin@gmail.com" && login.password.length < 6) {
      setError("La contraseña tiene que ser mayor a 6 caracteres")
      return false
    }
    return true
  }

  // Al pulsar el boton de Enviar se realizara esta función
  const hacerLogin = async () => {
    // Hacemos las validaciones previas
    if (!validacion()) return
    // Intentamos hacer la llamada al back para realizar el loggeo y la creación del token, en el cual le pasamos el email y la contraseña
    try {

      const getLogin = await request({
        url: '/login',
        method: 'POST',
        options: {
          email: login.email,
          password: login.password
        }
      })

      // Si se ha recogido y creado bien toda la informacion guardamos el token en localStorage y realizamos la funcion onFinish pasandole la información
      if (getLogin && getLogin.token) {
        localStorage.setItem('minijuegostoken', getLogin.token)
        return onFinish(getLogin)
      } else {
        return setError(getLogin.message)
      }

    } catch (error) {
      return setError(error)
    }
  }

  // Esta funcion lo que hara es borrar el token y borrar el usuario guardado como Context
  const hacerLogout = () => {
    localStorage.removeItem('minijuegostoken')
    const [usuario, setUsuario] = useUsuarioContext()
    return setUsuario(null)
  }

  // Si la path lleva la palabra logout se realizara la funcion hacerLogout
  if (window.location.search.includes('logout')) hacerLogout()

  return (
    <div id='contLogin' className='fdc jcc aic vh100'>
      <div id='login' className='bg-white fdc'>
        <h2 className='purple'>{titulo}<Link to={'/registro'}><p id='registrate' className='flr blue'>¡REGISTRATE!</p></Link></h2>
        <Entrada
          className='mb2'
          label={"Email"}
          value={login.email}
          onChange={(valor) => {
            if (!valor) {
              delete login.email
              return setLogin({ ...login })
            }

            setLogin({ ...login, email: valor })
            return setError(null)
          }}
          onKeyDown={async (ev) => {
            if (ev.key !== "Enter") return
            return await hacerLogin()
          }}
        />
        <EntradaPassword
          className='mb2'
          label={"Contraseña"}
          value={login.password}
          onChange={(valor) => {
            if (!valor) {
              delete login.password
              return setLogin({ ...login })
            }

            setLogin({ ...login, password: valor })
            return setError(null)
          }}
          onKeyDown={async (ev) => {
            if (ev.key !== "Enter") return
            return await hacerLogin()
          }}
        />
        <BotonAccion
          className='asc w30'
          text='Iniciar sesión'
          onClick={async () => await hacerLogin()}
        />
        {error && <p className='red'>❗ Login incorrecto: ({error})</p>}
      </div>
    </div>
  )
}
