import dayjs from "dayjs";

/**
 * @typedef ObjCuando
 * @property {number} ts Timestamp en segundos
 * @property {string} str Fecha en formato "DD/MM/YYYY HH:mm" || "DD/MM/YYYY HH:mm:ss"
*/

/**
 * Genera un objeto genérico de fecha
 * @param {*} fecha Fecha compatible con dayjs.
 * @param {bool} segundos Booleano que determina si se devolvera el formato en con segundos incluidos con :ss
 * @returns {ObjCuando | null} Objeto de historico {ts, str}. (ts = timestamp segundos, str = "DD/MM/YYYY HH:mm")
 * @example
 * const cuando = generadorCuando(dayjs("2021-01-01"));
 * {
 * 	ts: 1577836800,
 * 	str: "01/01/2021 00:00"
 * }
*/
export const generadorCuando = function (fecha, format = "DD/MM/YYYY HH:mm") {

	if (!fecha) fecha = dayjs();
	
	fecha = dayjs(fecha);
	if (! fecha.isValid()) return null;
	
	
	const ts = Math.ceil(fecha.valueOf() / 1000);
	
	if (Number.isNaN(ts)) return {
		ts: null,
		str: null,		
	};
	
	const str = fecha.format(format);
	return {
		ts: ts,
		str: str,
	};
	
};


/**
 * @typedef ObjQuien
 * @property {number} id 
 * @property {string} username
 * @property {number} role
*/

/**
 * Genera un objeto genérico de `quien`
 * @param {*} objUsuario {}
 * @returns {ObjQuien} Objeto de quien {id, username, role}.
*/

export const generadorQuien = function (objUsuario = {}) {
	
	const {
		id = "no_id",
		username = "Desconocido",
		name = "Desconocido",
		role = "no_role",
	} = objUsuario;
	
	return {
		id,
		username,
		name,
		role,
	};
	
};


/**
 * Devuelve una query apartir de un object
 * @param {Object} options 
 * @returns {string}
 */
export const generadorQuery = function (options){

	const keys = Object.keys(options)
	return keys.map(key => {
		let value  = options[key];
		
		if ( typeof options[key] === 'object') value = JSON.stringify(value);
		if ( typeof options[key] === 'undefined') return key;
		return `${key}=${value}`;

	}).join('&')

}


export const generadorColor = (hashtag = true)=>{
	const color = Math.floor(Math.random()*16777215).toString(16);
	if ( hashtag ) return '#' + color
	return color
}


export const stringifyJson = (element)=>{
	try { return JSON.stringify(element) }
    catch (error) { return element }
}

export const parseJson = (element)=>{
    try { return JSON.parse(element) }
    catch (error) { return element }
}

export const shadeGenerator = ({
	color = generadorColor(),
	intensity = 1
}) => {
	const decimalColor = parseInt( color.replace(`#`, ``), 16)
	const darken = (10 * intensity)

	let red = (decimalColor >> 16) - darken
	let blue = (decimalColor & 0x0000ff) - darken
	let green = ((decimalColor >> 8) & 0x00ff) - darken

	if ( red < 0 ) red = 0;
	if ( blue < 0 ) blue = 0;
	if ( green < 0 ) green = 0;

	return {
		light: color,
		dark:`#${(blue | (green << 8) | (red << 16)).toString(16)}`
	};

};
