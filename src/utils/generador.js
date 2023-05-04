import dayjs from "dayjs";

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
