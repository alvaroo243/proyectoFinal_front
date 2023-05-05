import axios from "axios";
import { generadorQuery } from "./generador";
const ENV = import.meta.env

export const request = async ({
    url: __url = `/live`,
    method = 'GET',
    options: __options = {},
    auth = true,
    responseBuffer = false,
    sendFile = false,
    baseUrl = ENV._BACK_URL,
    headers: __headers = {},
    baseResponse = false
})=>{
    
    const url = baseUrl + __url

    try {
        const headers = { headers: __headers }
        if ( auth ) headers.headers.Authorization = `Bearer ${localStorage.getItem('minijuegostoken')}`;
        if ( responseBuffer ) headers.responseType = 'arraybuffer';
        if ( sendFile ) headers.headers["Content-Type"] = 'multipart/form-data';
        
        let __request = null;
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

        if ( __request.data && baseResponse ) return __request.data;
        
        if ( __request.data && __request.data.ok !== false ) return __request.data;
        else return { ...__request.data, ok: false };

    } catch(err) {
        return { ok: false, mensaje: err }
    }


}
