import { DatePicker } from "antd"
import dayjs from "dayjs"

const { RangePicker } = DatePicker

// Componente el cual utilizaremos para elegir un rango de fechas
// Creamos el componente
export default function EntradaRangoFechas({
    label,
    values,
    // Estos son los parametros que se le pasará, normalmente son ['$gt', '$lt'] o ['$gte', '$lte']
    params = ['$gt', '$lt'],
    // Indicamos si se puede borrar con un boton que aparecerá a la derecha del campo
    allowClear = true,
    onChange = (values) => console.log( "EntradaRangoFechas", values )
}) {

    // Cogemos la fecha actual
    const ahora = dayjs()
    // Creamos unos rangos los cuales aparecera al clicar en el campo. Es como una forma rapida de elegir un
    // rango de fechas
    const rangos = [
        {
            // Nombre que tendrá el rango
            label: 'Hoy',
            // Valores del rango
            value: [
                // Desde
                ahora,
                // Hasta
                ahora
            ]
        },
        {
            label: 'Ayer',
            value: [
                ahora.subtract(1, 'day'),
                ahora.subtract(1, 'day')
            ]
        },
        {
            label: 'Esta semana',
            value: [
                ahora.startOf('week'),
                ahora
            ]
        },
        {
            label: 'Mes en curso',
            value: [
                ahora.startOf('month'),
                ahora
            ]
        },
        {
            label: 'Mes anterior',
            value: [
                ahora.subtract(1, 'month').startOf('month'),
                ahora.subtract(1, 'month').endOf('month')
            ]
        },
        {
            label: 'Año en curso',
            value: [
                ahora.startOf('year'),
                ahora
            ]
        },
        {
            label: 'Últimos 7 días',
            value: [
                ahora.subtract(7, 'day'),
                ahora.endOf('day')
            ]
        },
        {
            label: 'Últimos 30 días',
            value: [
                ahora.subtract(30, 'day'),
                ahora.endOf('day')
            ]
        },
        {
            label: 'Últimos 365 días',
            value: [
                ahora.subtract(365, 'day'),
                ahora.endOf('day')
            ]
        },
    ];

    // Devolvemos un label y un RangePicker, el cual es el que utilizaremos para seleccionar el rango de fechas
  return (
    <>
        <label className="labelEntradas">{label}</label>
        <RangePicker 
            allowClear={allowClear}
            className="w100 mb2"
            value={ values && [
                        // Multiplicamos por 1000 porque las fechas estan guardadas en formato ts pero sin los milisegundos
                        // por lo tanto lo mostramos aplicandole los milisegundos
                        dayjs(values[params[0]] * 1000),
                        dayjs(values[params[1]] * 1000)
                    ]
            }
            onChange={(e) => {
                if (!e) return onChange(null)

                const [inicia, termina] = e
                return onChange({
                    // Devolvemos en el onChange: 
                    // $gt o $gte : el comienzo del dia seleccionado en formato ts
                    [params[0]]: (inicia.startOf('day').unix()),
                    // $lt o $lte : el final del dia seleccionado en formato ts
                    [params[1]]: (termina.endOf('day').unix())
                })
            }}
            // Le indicamos los rangos predefinidos
            presets={rangos}
        />
    </>
  )
}
