import { useState } from 'react'
import { request } from '../../utils/request'
import Entrada from '../../components/Inputs/Entrada'
import EntradaPassword from '../../components/Inputs/EntradaPassword'
import BotonAccion from '../../components/Buttons/BotonAccion'
import { validadorEmail } from '../../utils/utils'
import { useUsuarioContext } from '../../context/UsuarioContext'
import '../../styles/login.scss'

// Vista de login
export default function Login({
  titulo = "Login",
  onFinish = (_usuario) => {
    // Por defecto se enviara a '/' cuando se finalice el login
    return window.location = '/'
  }
}) {

  // Creamos los estados
  const [login, setLogin] = useState({})
  const [error, setError] = useState(null)

  // Al pulsar el boton de Enviar se realizara esta función
  const hacerLogin = async () => {
    // Hacemos las validaciones previas
    if (!login.email || !login.password) return setError("Email o contraseña vacios")
    if (!validadorEmail.test(login.email)) return setError("Email no valido.")

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
        setError(getLogin.message)
      }

    } catch (error) {
      setError(error)      
    }
  }

  // Esta funcion lo que hara es borrar el token y borrar el usuario guardado como Context
  const hacerLogout = () => {
    console.log( "LOGOUT" );
    localStorage.removeItem('minijuegostoken')
    const [usuario, setUsuario] = useUsuarioContext()
    return setUsuario(null)
  }

  // Si la path lleva la palabra logout se realizara la funcion hacerLogout
  if(window.location.search.includes('logout')) hacerLogout()

  return (
    <div id='contLogin' className='fdc jcc aic h100'>
    <div id='login'>
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
    </div>
    </div>
  )
}
