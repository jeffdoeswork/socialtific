import React, { useState, useEffect, Fragment } from 'react'


import { useDispatch } from "react-redux"
import axios from "axios"

export default function ValidateRegistrationScreen({history, match}) {
    const dispatch = useDispatch()
    const { search } = history.location
    const token = search.split("=")[1]

    const [validationProcess, setValidationProcess] = useState({
        loading:true,
        success:false,
        complete:false
    })

    const setValidationStatus = React.useCallback((props)=>{
            setValidationProcess(prev=>({...prev, ...props}))
 
    }, [])


    const redirectToLogin = React.useCallback(()=>{
        setTimeout(()=>{
            dispatch({type:"MESSAGE_UPDATE", payload:"Thanks for completing registration! Please login below"})
            history.push("/login")}, 5000)
    }, [])

    useEffect(()=>{
        if(!token){
            
            dispatch({type:"MESSAGE_UPDATE", payload:"There was an error confirming your account"})
        }else{
            setValidationStatus({loading:false})
            axios.get(`/api/users/validate-registration?token=${token}`)
            .then(res=>{
                setValidationStatus({complete:true, success:true })
                redirectToLogin()
            })
            .catch(err=>setValidationStatus({complete:true}))
            
        }
        
    }, [ dispatch, setValidationStatus, token, redirectToLogin])


    return (
        <Fragment>
        {
            (validationProcess.loading || !validationProcess.complete) ?  
            <div>
                One moment.. We are validating your account
                
            </div> : 
                validationProcess.complete && validationProcess.success ? <p>Please wait while we redirect you to your account</p>: validationProcess.complete && <p>There was an error validating your account</p> 
            


        }
        </Fragment>
    )
}


