import React, { useState, useEffect, Fragment } from "react" 
import { useSelector, useDispatch } from "react-redux"

import SocialMethodInput from "./SocialMethodInput"
import Slider from "../Slider"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

import axios from "axios" 


export default function SocialtificMethod(props) {
    // Each Method data 'state' is controll individually
    
    const { label } = props
    const disabled = props.form[label]
    

    const dispatch = useDispatch()
    const observationData = useSelector(state=>state.observationData.data) // For sliders

    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username } = userInfo


    const [showPreview, setShowPreview] = useState(false)
    const [selectedPreview, setShowSelectedPreview] = useState()
    const [borrowedList, setBorrowedList] = useState([])
    const [dataList, setDataList] = useState([]) // Combined with observation data for sliders

    const editSocialMethod = useSelector(state=>state.newSocialMethod) // this will be an editable method tracked in the redux
    const { updateReplace } = editSocialMethod
    const [sent, setSent] = useState(false)

    const [artifactInput, setArtifactInput] = useState()
    const [createdArtifacts, setCreatedArtifacts] = useState(0)

    function handleTextChange(value, ix){
        let obj = {
            id: `${label}-${ix}`,
            author: {
                username:username
            },
            description:value
        }
        
        setArtifactInput(obj)
        
    }

    function usePreview(data){ // shows preview under corresponding method
        setShowSelectedPreview(data)
    }


    function handleButton(option){
        const obj = option
        props.setForm(prev=>({
            ...prev,
            [obj]:!prev[obj]
        }))

    }

    function handleShowPreview(e){
        e.preventDefault()
        setShowPreview(prev=>!prev)
    }

    function handleTakeData(option){
        let tmpList = editSocialMethod[label].length === 0 ? []:  editSocialMethod[label].length > 0 && editSocialMethod[label]  
        if (option ==='add'){
            setBorrowedList([...borrowedList, selectedPreview.id ])
            tmpList.push(selectedPreview)
        }else{
            setBorrowedList(borrowedList.filter(id=>id !== selectedPreview.id))
            tmpList.pop(selectedPreview)
        }
        
        dispatch({type:"SOCIAL_METHOD_UPDATE", payload:tmpList, label:label})   
     }

    function addArtifact(){
        let tmpList = editSocialMethod[label].length === 0 ? []:  editSocialMethod[label].length > 0 && editSocialMethod[label]  
        tmpList.push(artifactInput)
        
        setDataList([...dataList, artifactInput]) // sets dat for sliders
        props.setForm(prev=>({
        ...prev,
        [label]:!prev[label]
        }))
        setBorrowedList([...borrowedList, artifactInput.id ])
        dispatch({type:"SOCIAL_METHOD_UPDATE", payload:tmpList, label:label})   
        setCreatedArtifacts(prev=>prev+1)
        setArtifactInput({})
    }

    const getData = React.useCallback((id)=>{
        setSent(true)
        const config = {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        } 
        axios.get(`/api/${label}?observation=${id}`, config)
        .then(res=>{
            setDataList(res.data)
        })
    }, [])

    useEffect(()=>{
        if (!sent && observationData.id){
            getData(observationData.id)
        }
        if (updateReplace){
            setBorrowedList([ ...editSocialMethod[label].map(artifact=>artifact.id)])

        }
    }, [getData, sent, observationData.id, updateReplace, label])

    return(
        <Fragment>
            <Row style={{marginBottom:"20px"}}>
                <Col xs={5}>
                    { disabled && 
                    <Slider data={dataList} disabled={disabled}
                    buttonText={props.buttonText} showData={usePreview}
                    label={label}/>
                    }
                    { props.id <= props.step && 
                    <div style={{display:"inline-block", justifyContent:"space-between"}}>
                        { !disabled && 
                        <SocialMethodInput  onChange={handleTextChange} label={label} listIndex={createdArtifacts}/>
                        }
                         </div>
                    }
                </Col>
                <Col style={{position:"relative"}}>
                { props.id === props.step ?
                <div>
                    <Button className="myButton" style={{display:"block"}} onClick={()=>handleButton(label)}>{ disabled ?  `Use My ${props.buttonText}`:`Borrow ${props.buttonText}`}</Button>
                
                   { borrowedList.length > 0 && <Button className="myButton" variant="success" onClick={()=>props.handleStep("next")}>Next Step</Button> }
                    { disabled && 
                    selectedPreview && borrowedList.includes(selectedPreview.id)  ?
                        <div onClick={()=>handleTakeData('remove')} style={{paddingLeft:"10px"}}>{/**'Clear' data button */}
                            <i className="far fa-times-circle fa-2x icon" style={{color:"red"}}></i></div>
                    : disabled && selectedPreview &&
                    !borrowedList.includes(selectedPreview.id)  ?
                        <Button className="myButton bottomButton" style={{color:"white"}} 
                        onClick={()=>handleTakeData('add')} variant="warning">BORROW</Button> :
                    !disabled   &&                         
                        <Button className="myButton bottomButton" onClick={addArtifact} variant="danger">
                            Add
                        </Button>
                        }
                </div> 
                    : props.id < props.step && <Button className="myButton" variant="danger" onClick={()=>props.handleStep("prev")}>Edit</Button>  
                }
                    </Col>               

            </Row>
            <Row>
                <Col xs={12}>
                    <p className="fakeLink"  onClick={handleShowPreview}>
                    { showPreview ?  "Hide Preview" : "Show Preview"
                    }
                    </p>
                    {
                        props.newData[label][label] !== "" && <span className="circle completed miniCircle"></span>
                    }
                    {
                        showPreview && selectedPreview &&
                        <div>
                            {  props.newData[label].author.username === selectedPreview.author.username ? <p className="preview selectedPreview">Selected</p> 
                            : props.newData[label].author.username !== "" && <p className="preview notSelectedPreview">
                                    Not Selected </p>  

                    }
                            <p>Author: {selectedPreview.author.username}</p>
                            <p>{!selectedPreview.description ?   <em>No description available</em>:selectedPreview.description}</p>

                        </div> 
                    }
                </Col>
            </Row>
        </Fragment>
    )       
    }