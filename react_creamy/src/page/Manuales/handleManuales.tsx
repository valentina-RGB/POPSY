import { useState } from "react"
// import React from "react";



export const useManuales = () => {

    const [manuales, setmanuales] = useState("")

    const handleManuales = (texto: string) => {
        setmanuales(texto)
    }

    const urlManuales= () => {
        console.log( manuales)
        return  window.open(manuales,"_blank")
         
    }

    return { handleManuales, urlManuales }
}