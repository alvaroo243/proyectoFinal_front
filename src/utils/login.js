import { request } from "./request";

// Comprobamos que todo ha ido bien y que el usuario y el token estan guardados
export const compruebaToken = async (token) => {

    if ( token ) {

        const { user } = await request({
            url: "/usuario",
            method: "GET",
        })

        if ( user ) return { ok: true, user: user }
    }

    return { ok: false }
}