const debounceRegister = {};
// Función la cual utilizaremos para crear un timeout para que se realice la función indicada
// Utilizamos esto para que no haya una sobrecarga de timeOuts
export const easyDebounce = (
    __debouncer,
    tiempo = 3000
) => {

    let fnc;
    let key;

    // Si el pasamos solo una función
    if ( typeof __debouncer  === "function" ){
        fnc = __debouncer;
    }

    // Si le pasamos un objeto con la key y la funcion
    if ( typeof __debouncer  === "object" ){
        if ( __debouncer.key ) key = __debouncer.key
        if ( __debouncer.fnc ) fnc = __debouncer.fnc
    }

    // Si no hay key hacemos que la key sea la función
    if ( !key ) key = String(fnc);
    // Si ya se ha guardado previamente lo limpiamos
    if ( !!debounceRegister[key] ) clearTimeout(debounceRegister[key])

    // Devolvemos una promesa en la que se ejecuta la función después del tiempo indicado
    return new Promise(( resolve, reject )=>{

        debounceRegister[key] = setTimeout(()=>{
            resolve( fnc() )
        }, tiempo)
    })

}