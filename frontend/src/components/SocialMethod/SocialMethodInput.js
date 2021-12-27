import React from "react"

export default function SocialMethodInput(props){
    

    return(
        <div style={{marginTop:"10px", textAlign:"center"}}>
            <h3>Make your own {props.label}</h3>
            <textarea onChange={e=>props.onChange(e.target.value, props.listIndex)} value={props.value} className={`${!props.disabled && 'selectedForm'}`} disabled={props.disabled} style={{border:"1px solid lightgrey" }} rows="8" cols="40"/>
        </div>
    )
}
