import axios from "axios";
import { generadorQuery } from "./generador";
const ENV = import.meta.env

// Función que utilizaremos para hacer peticiones al back
export const request = async ({
    // Indicamos el endpoint de la llamada
    url: __url = `/prueba`,
    // Indicamos el method que utiliza la llamada
    method = 'GET',
    // Indicamos los atributos que pasaremos en la llamada
    options: __options = {},
    // Indicamos si se necesita autorización Bearer
    auth = true,
    // Indicamos si queremos que se guarde en el buffer
    responseBuffer = false,
    // Indicamos si se pasa un archivo
    sendFile = false,
    // Indicamos la url del back
    baseUrl = ENV._BACK_URL,
    // Indicamos los headers
    headers: __headers = {},
    baseResponse = false
})=>{
    
    // Creamos la url
    const url = baseUrl + __url

    try {
        // Creamos los headers segun condiciones
        const headers = { headers: __headers }
        if ( auth ) headers.headers.Authorization = `Bearer ${localStorage.getItem('minijuegostoken')}`;
        if ( responseBuffer ) headers.responseType = 'arraybuffer';
        if ( sendFile ) headers.headers["Content-Type"] = 'multipart/form-data';
        
        let __request = null;
        // Segun el method el request sera una llamada u otra
        // Utilizaremos para las llamadas axios
        // Si utilizamos los metodos POST y PUT la informacion que pasemos la meteremos en el body
        // Sin embargo si utilizamos DELETE o GET la información que pasemos la meteremos en el query
        switch (method.toUpperCase()) {
            case "POST":
                __request = await axios.post( url, __options, headers )
                break;
            case "PUT":
                __request = await axios.put( url, __options, headers )
                break;
            case "DELETE":
                __request = await axios.delete( url + '?'+generadorQuery(__options), headers )
                break;
            case "GET":
            default:
                __request = await axios.get( url + '?'+generadorQuery(__options), headers )
                break;
        }

        // Devolvemos data si es true o baseResponse es true y sinos devolevmos data con el error
        if ( __request.data && baseResponse ) return __request.data;
        
        if ( __request.data && __request.data.ok !== false ) return __request.data;
        else return { ...__request.data, ok: false };

    } catch(err) {
        return { ok: false, mensaje: err }
    }


}
