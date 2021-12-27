import React from 'react'

import { useSelector, useDispatch } from "react-redux"

export default function Alert() {

    const dispatch = useDispatch()
    const alerts = useSelector(state=>state.alerts)


    const cleanUp = React.useCallback((ix)=>{
        setTimeout(()=>{
            alerts.pop(ix)
            let newList = alerts.length > 0 ? alerts : null
            dispatch({type:"MESSAGE_REPLACE", payload: newList})
        }, 15000)
        return true
    }, [])



    return (
        <div className="alerts">
            { alerts.map((alertItem, ix)=>
             cleanUp(ix)&&
            <p key={ix} className="showAlert" >{alertItem}</p>) }
        </div>
    )
}


