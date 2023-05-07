import { request } from "./request";

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