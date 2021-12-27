import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from "react-redux"
import axios from "axios";
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { logout } from "../actions/userActions"
import { getObservationList, sendReaction, verifyReactions } from '../actions/socialMethodActions';


export default function NewsFeed({history}) {
    
    const buttonStyle = {
        paddingLeft:"3.75rem",
        paddingRight: "3.75rem",
        paddingTop: ".775rem",
        paddingBottom:".775rem",
        borderRadius: "5px",
        fontWeight:"bold"
    }

    const dispatch = useDispatch()

    const [newObservation, setNewObservation] = useState('')

    const userInfo = useSelector(state=>state.userInfo)
    const { token, username } = userInfo

    const observationList = useSelector(state=>state.observationList)
    const { observations, loading, error } = observationList

   const [inputObservationError, setInputObservationError] = useState(false)


    function handleTextChange(e){
        setInputObservationError(false)
        setNewObservation(e.target.value)
    }


    function handleSubmit(){
        if (newObservation === ""){
            setInputObservationError(true)
            return
        }
        const config = {headers:{
            "Authorization" : `Bearer ${token}`
        }}

        const data = {description:newObservation}
        axios.post("api/observations/", data, config)
        .then(res=>{
            const  { data } = res
            history.push(`/newsfeed/observations/${data.id}`)    
        }
            )
        .catch(err=>{
            console.log('Unable to submit observations', err.response)
            if (err.response.status === 401){
                dispatch(logout())
            }
        })

    }

        function handleClickReaction( observation ){
         // verify user in reaction
        let actionData = {}
        if (!verifyReactions(observation.reactions, username)){
            actionData = {
                action: 'add',
                type:'like',
                labelObj:{ observation:observation.id }
            }
        }else{
            actionData = {
                action: 'remove',
                type:'like',
                labelObj: { observation:observation.id}
            }
        }
        actionData['token'] = token
        actionData['dispatchType'] = "OBSERVATION_LIST_UPDATE"
        dispatch(sendReaction(actionData))
    }




    useEffect(()=>{
        dispatch({type:"OBSERVATION_DATA_RESET"}) //Ensure no observation detail data exists in state when page loads
        dispatch(getObservationList())
        return ()=>dispatch({type:"OBSERVATION_LIST_RESET"})
    }, [dispatch])

    return (
        <div className="toRight">
        <Row className="innerMain">
            <Col>
            {  inputObservationError && <p style={{fontWeight:"bold", color:"red"}}>Please fill out the form</p>}
                <Card.Body style={{marginBottom:"1em"}}>
                    <form>
                        <Form.Control as="textarea" cols={40} disabled={!token} 
                        rows={10} onChange={handleTextChange} value={newObservation} placeholder="Enter an observation.."/>
                        <div style={{textAlign:"center", marginTop:"1.5em"}} >
                            {!token ? 
                            <Fragment>
                                <p><em>You'll need an account to add your own</em>&nbsp;<b>observation</b></p>
                                <Button onClick={()=>history.push('/login')}>Login</Button>
                            </Fragment>:

                            <Button style={buttonStyle} variant="info" onClick={handleSubmit} disabled={newObservation === ""}>Submit Observation</Button>
                            }
                        </div>
                    </form>             
                </Card.Body>
            </Col>
        </Row>

        { loading ? <Col><h1>Loading observations</h1></Col> : !error && observations.length > 0 ? observations.map((observation, ix)=>(
            <Row key={ix} className="shadow rounded p-4 margin-bottom-xs">
                    <Col xs>
                        { observation.author.profilePicLink? <img className="avatar" src={ observation.author.profilePicLink } alt="" /> : <i className="fas fa-atom fa-2x"></i>}
                        &nbsp;{ observation.author.username === username ?<Link to='/myProfile'>{observation.author.username}</Link> :
                            <Link to={`/user/${observation.author.username}`}>{observation.author.username}</Link>
                    }
                    </Col>
                    <Col xs style={{position:"relative"}}><b>Created: </b>{observation.created}</Col>
                    <Col xs >Likes: {observation.reactions.length }</Col>
                        
                    <Col xs={12} style={{textAlign:"center"}}> <p><Link to={`/newsfeed/observations/${observation.id}`}>{observation.description}</Link></p></Col>

                    { token && <i className={`fas fa-check likeSymbol ${ verifyReactions(observation.reactions, username) && "success"}`} onClick={()=>handleClickReaction(observation)}></i> }

                </Row>
        )):
        <Row>
            <Col style={{textAlign:"center"}}>
            <h2>No one has observed....<em>anything?</em></h2></Col>
            </Row>} 
        </div>   
    )
}


