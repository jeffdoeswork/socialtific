/** Header module

Modal logic is stored here. useSelector retrieves state values to determine how
the header/top navbar should be displayed.
 * 
*/

import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useHistory, useRouteMatch } from "react-router-dom"
import axios from "axios"

import SideLinks from "../components/SideLinks"
import ObservationHeader from './ObservationHeader'
import GroupCreateModal from './GroupCreateModal'
import { submitSocialMethod } from '../actions/socialMethodActions'
import { initialSocialMethod } from "../constants/socialMethodConstants"
import { truncateWords } from "../actions/globalActions"
import FauxDropDown from './FauxDropDown'


import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"



function parseUrl(index){
    // Use index to param from URL
    if (window.location.pathname.length >= index){
           return window.location.pathname.split("/")[index]
    }else {
        return null
    }
    
}

export default function Header() {

    const history = useHistory()

    const conclusionId = parseUrl(4), //match.params does not work here 
        observationId = parseUrl(3)


    const path = history.location.pathname


    const initialState = {
        links:"normal",
        observationHeader:false,
        newSocialMethod:false,
        zIndex:"0"
    }

    const dispatch = useDispatch() // assign function to variable that when called, will update 'state' of application by sending information  to reducers
    const bodyRef = React.useRef() // create an 'immutatble' refernce  to a DOM node *used for closing the modal*

    const [headerState, setHeaderState] = useState(initialState)

    const userInfo = useSelector(state=>state.userInfo)
    const { token, username, profilePicLink, groups:userGroups } = userInfo

    const userSocialMethods = useSelector(state=>state.userSocialMethods)
    const { methods } = userSocialMethods

    const observationData = useSelector(state=>state.observationData)
    const {conclusion: conclusionList} = observationData.data

    const socialMethod = useSelector(state=>state.newSocialMethod)
    const { title, autosave, updateReplace, conclusionId:socialMethodId, data, draft } = socialMethod

    const reduxPreviewModal = useSelector(state=>state.previewModal.display)

    const [currentIndex, setCurrentIndex] =useState(-1)

    const [tempTitle, setTempTitle] = useState("")
    const [showPreviewModal, setShowPreviewModal] = useState(false)

    //Groups
    const groupModal = useSelector(state=>state.groupModal)


    function getLastSave(){
        // Auto save feature
        let result="Last save was "
        let value=""
        let now = Date.now(); 
        if (autosave){
            let diff = new Date(now - autosave)
            if (diff.getMinutes() > 0){
                let min = diff.getMinutes()
                if (min === 1){
                    value = "minute"
                }else{
                    value = "minutes"
                }
                result += `${min} ${value} ago`
            }else{
                let sec = diff.getSeconds()
                if (sec === 0){
                    result = "Just saved"
                }else if (sec === 1){
                    value="second"
                }else{
                    value="seconds"
                }

                if (value !==""){
                    result += `${sec} ${value} ago`
                }
               
            }
        }else{ result = "" }
        return result
        
    }
    const modifyHeader = React.useCallback(()=>{
        // Determines how to display the header
        //whether 'fixed' or 'absolute' based on retrived state information
        const org = window.location.pathname.includes('organizations')

        let tmpState = { ...initialState}
        if (!observationId && !conclusionId || org){
             tmpState.links = "absolute"
        }else if (observationId && !conclusionId){
            tmpState.observationHeader = true
            tmpState.links = "fixed"
            tmpState.newSocialMethod = false
            tmpState.zIndex = "9999"

        }else if(conclusionId){
            tmpState.observationHeader = true
            tmpState.links = "fixed"
            tmpState.newSocialMethod = true
            tmpState.zIndex = "9999"
        }
        setHeaderState(prev=>({
            ...prev, 
            ...tmpState}))

    }, [path])


    function onPublish(){
        // Used by the Method Maker/Social Method Screen
        if (title !== "" && data.length !==0){
            socialMethod.draft = false
            dispatch(submitSocialMethod(observationId, socialMethod, token))
        
            dispatch({type:"SOCIAL_METHOD_RESET"})

            history.push(`/newsfeed/observations/${observationId}`)
        }
    }

    function handleClear(){
        let replacement = initialSocialMethod
        replacement['conclusionId'] = conclusionId
        dispatch({type:"SOCIAL_METHOD_REPLACE", payload:replacement })
        setTempTitle("") // Always clear title
        let el = document.querySelector('.fauxHeaderText')
        el.innerHTML = "" // Setting 'value' like this on an input-like component
    }


    function editPastSocialMethod(id){
       

        if (id === 'clear'){
            // We want the old ID back in the store incase
            // user wants to submit, so we dont jsut want to _RESET. 
            // This way avoids creating another case statement to simply update the id
            handleClear()
            
        }else if (id !==""){
            //Fetch past social method, load to redux state
            axios.get(`/api/conclusion/${id}/`)
            .then(res=>{
                dispatch({type:"SOCIAL_METHOD_REPLACE", payload:res.data})})
            .catch(err=>console.log('Error editing past social method', err.response))

    }}


    function handleTextChange(e){
        // each time text is change on input, set text to title and send to state
        setTempTitle(e.target.value)
        dispatch({type:"SOCIAL_METHOD_UPDATE", payload:e.target.value, label:"title"})
    }

    function handleClickArrow(option){
        let dispatchIndex;

        if (option === 'next' && currentIndex < conclusionList.length-1){
            setCurrentIndex(prev=>{
                dispatchIndex = prev+=1
                dispatch({type:"SOCIAL_METHOD_REPLACE", payload:conclusionList[dispatchIndex]})
                return dispatchIndex
                })
        }else if(option === 'prev'){
            if (currentIndex > 0){
                setCurrentIndex(prev=>{
                dispatchIndex = prev-=1
                dispatch({type:"SOCIAL_METHOD_REPLACE", payload:conclusionList[dispatchIndex]})
                return dispatchIndex
                })
            }
        }
    }

    function saveDraft(){
        if (title === ""){
                socialMethod.title = `Draft-${socialMethodId}`
            }
        dispatch(submitSocialMethod(observationId, socialMethod, token))
    }


    function closeModal(e){
        // Ensure modal only closes if clicked outside the regerenced body
        if (!bodyRef.current || bodyRef.current.contains(e.target)){
            return
        }
        else{
        dispatch({type:"MODAL_HIDE"})

        }
    }


    function addGroupToArtifacts(group){
        dispatch({type:"OBSERVATION_ADD_GROUP", payload:group})
    }

    useEffect(()=>{

        modifyHeader()
        if (token && observationId){
            if(!updateReplace){
                dispatch({type:"SOCIAL_METHOD_UPDATE", label:"conclusionId", payload:conclusionId})
            }
        }
        if(title){
            setTempTitle(title)
        }
        
        if(socialMethodId && conclusionList){
            setCurrentIndex(conclusionList.findIndex(methd=>methd.conclusionId === socialMethodId))
        }
        
    }, [modifyHeader, path, dispatch, title, updateReplace, socialMethodId, conclusionId, 
        conclusionList, token, groupModal])

    useEffect(()=>{
        // this will run only when path changes
        return ()=>setTempTitle("")
    },[path])

    return (
        <Fragment>
            { (showPreviewModal || reduxPreviewModal) && 
                <div   className="previewModal" onClick={()=>setShowPreviewModal(false)}>
                    <div  onClick={closeModal} className="modalBody">
                        <div ref={bodyRef} className="innerModalBody">
                            { reduxPreviewModal &&  
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                <i className={`fas fa-arrow-circle-left fa-2x icon ${currentIndex === 0 && "hidden"}`} onClick={()=>handleClickArrow('prev')}></i>
                                <i className={`fas fa-arrow-circle-right fa-2x icon ${currentIndex === conclusionList.length-1 && 'hidden'}`} onClick={()=>handleClickArrow('next')}></i>
                                </div>} 

                            <p style={{fontWeight:"bold", textAlign:"center"}}>{title}</p>
                            <div className="artifactDiv" style={{border:"1px solid blue"}}>
                                
                                <p style={{fontWeight:"bold"}}>Data</p>
                                {socialMethod.data.map((artifact, ix)=>(
                                <p key={ix} style={{border:"1px solid blue", padding:"10px", borderRadius:"10px", marginLeft:"15px"}}>{ artifact.description}</p>
                            ))}
                            </div>
                            <div className="artifactDiv" style={{border:"1px solid purple"}}>

                                <p style={{fontWeight:"bold"}}>Hypothesis</p>  
                                { socialMethod.hypothesis.map((hypoArtifact, ix)=>
                                <p key={ix} className="previewModalText">{hypoArtifact.description}</p> )} 
                          
                            </div>  
                            <div className="artifactDiv" style={{border:"1px solid red"}}>

                                <p style={{fontWeight:"bold"}}>Experiment</p>
                                {  socialMethod.experiment.map((artifact, ix)=>
                                    <p key={ix} className="previewModalText">{artifact.description}</p>
                                )}
                            </div>
                            <div className="artifactDiv" style={{border:"1px solid green"}}>

                                <p style={{fontWeight:"bold"}}>Conclusion</p>
                                { 
                                <p className="previewModalText">{socialMethod.conclusion}</p>
                                }
                            </div>
                                                   
                        </div>
                    </div>
                </div>
            }{/*End Preview Modal*/}
        
            <div style={{position: headerState.links, width:"100%", backgroundColor:"white", zIndex:headerState.zIndex}}>
                <p style={{fontWeight:"900", fontSize:"25px"}}>SOCIAL METHOD</p>
                { profilePicLink ? <img className="avatar" src={profilePicLink}/>: <i className="fas fa-atom fa-2x"></i> }
                <span style={{fontWeight:"bold"}}>&nbsp;{
                    username? username :"guest"
                }</span>
                <Row style={{width:"100%"}}>

                <Col xs={2}>
                    <SideLinks />
                </Col>
                { headerState.observationHeader && token &&
                    <Col xs={7}>
                    
                        <ObservationHeader />
                            
                    </Col>
                }
                { headerState.newSocialMethod && token && 
                    <Col xs={2}>
                        <div style={{display:"flex", justifyContent:"end"}}>
                            <div>
                                <p style={{marginBottom:"0"}}>My Socialtific Methods</p>
                                <FauxDropDown data={methods} onChange={editPastSocialMethod}/>

                                <Button variant="success" onClick={handleClear}>Clear</Button>
                            </div>

                        </div>

                    </Col>
                }
                </Row>
                { headerState.newSocialMethod && token && 
                <Fragment>
                    <Row>
                        
                    { autosave !== "" &&
                        <p style={{display:"inline"}}><b>Auto Save:</b> <span><em> { getLastSave()}</em></span></p>}

                    { draft && <p style={{ color:"red", fontWeight:"bold", display:"inline", fontSize:"1.2em" }}>DRAFT</p> }
                        
                    </Row>

                    <Row>
                        <div style={{width:"75%", display:"inline-flex"}}>
                            <textarea style={{width:"100%"}} placeholder="Enter a title" onChange={handleTextChange} value={tempTitle}/>
                            <Button onClick={onPublish} disabled={title ==="" || data.length === 0}>Publish</Button>
                            <Button variant="warning" disabled={!title} onClick={()=>setShowPreviewModal(true)}>Preview</Button>
                            <Button variant="danger" onClick={saveDraft} >Save as Draft</Button>
                            <div>
                                <p>Associate to a group?</p>
                                <select onChange={e=>addGroupToArtifacts(e.target.value)}>
                                    <option></option>
                                    {
                                    userGroups.map((group, ix)=>
                                     <option key={ix} value={group}>{group}</option>
                                    )}
                                   
                                </select>
                            </div>
                            
                        </div>
                    </Row>
                </Fragment>
                    }

            </div>
            { groupModal &&
            <GroupCreateModal />
                }
        </Fragment>      
    )
}


