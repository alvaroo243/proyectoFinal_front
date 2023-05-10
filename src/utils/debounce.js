const debounceRegister = {};
export const easyDebounce = (
    __debouncer,
    tiempo = 3000
) => {

    let fnc;
    let key;

    if ( typeof __debouncer  === "function" ){
        fnc = __debouncer;
    }

    if ( typeof __debouncer  === "object" ){
        if ( __debouncer.key ) key = __debouncer.key
        if ( __debouncer.fnc ) fnc = __debouncer.fnc
    }

    if ( !key ) key = String(fnc);
    if ( !!debounceRegister[key] ) clearTimeout(debounceRegister[key])

    return new Promise(( resolve, reject )=>{

        debounceRegister[key] = setTimeout(()=>{
            resolve( fnc() )
        }, tiempo)
    })

}