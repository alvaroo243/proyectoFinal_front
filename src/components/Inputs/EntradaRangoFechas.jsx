import { DatePicker } from "antd"
import dayjs from "dayjs"

const { RangePicker } = DatePicker

export default function EntradaRangoFechas({
    label,
    values,
    params = ['$gt', '$lt'],
    allowClear = true,
    onChange = (values) => console.log( "EntradaRangoFechas", values )
}) {
    const ahora = dayjs()
    const rangos = [
        {
            label: 'Hoy',
            value: [
                ahora,
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

  return (
    <>
        <label className="labelEntradas">{label}</label>
        <RangePicker 
            allowClear={allowClear}
            className="w100 mb2"
            value={ values && [
                        dayjs(values[params[0]] * 1000),
                        dayjs(values[params[1]] * 1000)
                    ]
            }
            onChange={(e) => {
                if (!e) return onChange(null)

                const [inicia, termina] = e
                return onChange({
                    [params[0]]: (inicia.startOf('day').unix()),
                    [params[1]]: (termina.endOf('day').unix())
                })
            }}
            presets={rangos}
        />
    </>
  )
}
