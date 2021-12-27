/**Due to the fact <option> elements cannot be styled 
 * A fake dropdown (select) html element needs to be created
 */

import { truncateWords } from "../actions/globalActions"

import React , { useState, Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function FauxDropDown({data, onChange}) {

    const dispatch = useDispatch()
    const showDrop = useSelector(state=>state.fauxDrop)
    const [item, setItem] = useState({
        value:"",
        text:""
    })

    function handleClick(id, text){
        setItem({value:id,text:text})
        dispatch({type:"FAUX_DROP_SHOW", payload:false})
        onChange(id)
    }
    return (
        <div className="fauxDropWrapper icon">
            <div onClick={()=>dispatch({type:"FAUX_DROP_SHOW", payload:!showDrop})} className="fauxDropHeader"><span className="fauxHeaderText">{item.text}</span><i className="fas fa-chevron-down dropIcon"></i></div>
            { showDrop && 
            <ul className="fauxDrop">
                    { data.map((method, ix)=>
                <li key={ix} value={method.conclusionId} className="fauxDropItem">
                    { method.draft ? <p className="fauxDropData" onClick={()=>handleClick(method.conclusionId, truncateWords(method.title, 3))}>
                        <b>Draft: </b>{truncateWords(method.title, 3)}</p>:
                    <p className="fauxDropData" onClick={()=>handleClick(method.conclusionId, truncateWords(method.title, 5))}>{ truncateWords(method.title, 5)} </p> }
                </li>
                    )}
            </ul>
            }
        </div>
    )
}

