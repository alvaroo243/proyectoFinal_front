import React, { useEffect, useState } from 'react'
import { request } from '../../utils/request'

export default function Login() {

  const [list, setList] = useState()

  useEffect(() => {
    (async () => {
      const {ok, list} = await request({
        url: "/prueba"
      })
      setList(list)
    })()  
  }, [])

  return (
    <>
    {list}
    </>
  )
}
