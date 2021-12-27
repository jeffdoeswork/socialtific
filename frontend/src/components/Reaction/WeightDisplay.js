import React from "react"

export default function WeightDisplay({artifact}){
    // A poor name but display Weights and likes
    const { reactions } = artifact
    return(
        <div className="weightGroup">&nbsp;&nbsp;&nbsp;<b>Likes:&nbsp;</b>{reactions.length === 0 ? <span> &nbsp;&nbsp;&nbsp;</span>: reactions.length}&nbsp;|&nbsp;{artifact.borrowers.length === 0 ? "":<b>Borrowed:{ artifact.borrowers.length} </b> }</div>
    )
}