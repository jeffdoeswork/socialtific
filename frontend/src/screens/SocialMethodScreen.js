import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import SocialtificMethod from '../components/SocialMethod/SocialtificMethod'

import { socialMethodSteps } from '../constants/socialMethodConstants'

import { getObservationData, getUserSocialMethods, submitSocialMethod } from "../actions/socialMethodActions"
import { logout } from "../actions/userActions"


export default function SocialMethodScreen({history, match}) {


    const { id, conclusionId } = match.params //observationId, conclusion

    const dispatch = useDispatch()
    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username } = userInfo

    const observationData = useSelector(state=>state.observationData)
    const {error} = observationData 

    const socialMethod = useSelector(state=>state.newSocialMethod) // May not be the best name, social method saved in  redux store is newly 
                                                                    // created method. Data used by header also, to create Conclusion title 

    const { title } = socialMethod


    const formData ={ 
        title:"",
        data:{
            author:{
                username:""
            },
            description:"",
            disabled:false
            },
        hypothesis:{
            author:{
                username:""
            },
            description:"",
            disabled:false

            },
        experiment:
            {
            author:{
                username:""
            },
            description:"",
            disabled:false
            },
        conclusion:"",
        observation:id,
        conclusionId:conclusionId,
        autosave:""
    }

    const [disableForm, setDisableForm] = useState({
        data:true,
        hypothesis:true,
        experiment:true
    })

    const [step, setStep] = useState(1)


    function handleConclusionChange(value){
        dispatch({type:"SOCIAL_METHOD_UPDATE", payload:value, label:"conclusion"})   

    }
    function handleSteps(option){
        if (option === "next"){
            setStep(prev=>prev + 1)
            if (title === ""){
                socialMethod.title = `Draft-${conclusionId}`
            }
            dispatch(submitSocialMethod(id, socialMethod, token))

        }else if (option === "prev"){
            setStep(prev=>prev-1)
        }
    }

    
    useEffect(()=>{
        if (!token || (error && error.status===401)){
            dispatch(logout())
            history.push("/newsfeed")
        }else{
            dispatch(getUserSocialMethods(username, id))
        }
        dispatch(getObservationData( id, token))
        return()=>dispatch({type:"USER_METHODS_RESET"})
    
    }, [dispatch, error, history, id, token, username])

    return (
        <div style={{paddingTop:"370px"}}>

            <Col>
                <h4 style={{margin:"30px 0", textAlign:"center"}}>Borrow or use your own artifacts* to complete the Socialtific Method! </h4>

            </Col>

            <Row style={{marginTop:"50px"}}>
                <Col xs={2}>
                    <div>
                        { socialMethodSteps.map((socialStep, ix)=>
                            <div key={ix} className={`stepperHeaderItem ${step > ix+1 && "completed"}`}>
                                <div className={`circle ${step >= ix+1 && "completed"}`}></div>

                                <p>{socialStep.step}</p>
                            </div>
                            )}
                    </div>
                </Col>
                <Col>
                        {
                        [{label:"data", buttonText:"Data"}, {label:"hypothesis", buttonText:"Hypothesis"}, {label:"experiment", 
                            buttonText:"Experiment" }].map((artifact, ix)=>(
                            <SocialtificMethod key={ix} id={ix+1} label={artifact.label} buttonText={artifact.buttonText} step={step} 
                            setForm={setDisableForm} form={disableForm} newData={formData}
                            handleStep={handleSteps} />
                            ))}
                    <Col style={{textAlign:"center", margin:"50px auto 0"}}>
                        <h3>My Conclusion</h3><br />
                        <textarea onChange={e=>handleConclusionChange(e.target.value)} rows="10" cols="100" style={{borderRadius:"5px"}}/><br/>
                    </Col>
                    <Col style={{textAlign:"center", margin:"50px auto 0"}}>
                    </Col>
    
            </Col>
            </Row>
        </div>
    )
}


