/* Slider.js 

This is the 'control' module for the data and the numbered selection underneath of the data

*/
import React, { useEffect, useState } from 'react'

import { useSelector } from "react-redux"

import { truncateWords } from '../actions/globalActions'

export default function Slider(props) { // used in Socaitific Method

    const { data, label, disabled, showData } = props
    const [cursorIndex, setCursorIndex] = useState(0) // cursor relates to which index the user has clicked to view
    const [sliderIndex, setSliderIndex] = useState(0)

    const editSocialMethod = useSelector(state=>state.newSocialMethod)

    function handleClick(ix){
        // inital click on number under 'slider'
        // matches value to index of artifact in artifact list
        if (disabled){
            setCursorIndex(ix)
        }
        showData(data[ix])

    }


    function handleArrowClick(option){
        // Takes in a 'direction' and sets the node translate value
        if (option == 'next'){
            if (sliderIndex < 0){
                setSliderIndex(prev=>prev+ 100)
            }
        }else{
            if(!(-sliderIndex/100 >= Math.ceil(data.length / 4)-1)){
                    setSliderIndex(prev=>prev+ -100)

            }
        }

    }




    useEffect(()=>{
        // Showdata is only called if props changes, do not add 'Showdata' to dependency array
        if (data && Object.keys(data).length > 0){
            showData(data[0])

        }
    }, [data])
    
    return (
            <div className={`${disabled && 'selectedForm' }`} style={{ display:"inline-block",border:"1px solid lightgrey", width:"330px"}}>
                <div className="slideShow" style={{marginTop:"40px"}}>
                    <div className="sliderWrapper" style={{transform: `translate(-${cursorIndex}00%)`, transition:"transform 1s"}}>
                        
                        { data && data.length > 0 ? data.map((data, ix)=>
                        <div key={ix} className="slide">
                            <p> {data.author.username}</p>                            
                            <p>{ data.description && truncateWords(data.description, 6)}</p>                        
                        </div>
                        ): <p className="slide" style={{padding:"15px"}}><em>No data to display! Be the first!</em></p> }

                    </div>
                </div>

                <div style={{display:"inline-flex", width:"100%"}}>{/*Slider Controls eg. 1,2 3, 4.. */}
                    <i className={`fas fa-long-arrow-alt-left fa-2x arrows ${ sliderIndex === 0 && "hiddenArrow"}`} onClick={handleArrowClick}></i>
        
                    <div className="selectorWrapper" >
                        <div style={{textAlign:"center", marginTop:"30px", transform:`translate(${sliderIndex}%)`, transition:"1s"}}>
                            {data && Object.keys(data).length > 0 && data.map((artifact, ix)=>(
                            <p key={ix} className={`slideSelector ${ix === cursorIndex && "selected"} 
                                ${editSocialMethod[label] && editSocialMethod[label].find(obj=>obj.id === artifact.id)  && "borrowSelected"}`} style={{display:"inline-block",border:"1px solid black", marginRight:"1em",padding:"5px"}}
                            onClick={()=>handleClick(ix)}>{ix+1}</p>
                        ))} 
                    
                        </div>
                    </div>
                    <i className={`fas fa-long-arrow-alt-right icon fa-2x arrows ${data && -sliderIndex/100 >= Math.ceil(data.length / 4) -1 && "hiddenArrow"}`} onClick={()=>handleArrowClick('next')}></i>
                </div>
            </div>

    )
}

