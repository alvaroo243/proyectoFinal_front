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


export const generadorQuery = function (options){

	const keys = Object.keys(options)
	return keys.map(key => {
		let value  = options[key];
		
		if ( typeof options[key] === 'object') value = JSON.stringify(value);
		if ( typeof options[key] === 'undefined') return key;
		return `${key}=${value}`;

	}).join('&')

}