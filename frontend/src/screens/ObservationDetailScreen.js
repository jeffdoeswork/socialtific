import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import Button from "react-bootstrap/Button"
import { getObservationData, verifyReactions } from "../actions/socialMethodActions"
import axios from "axios"

import { logout } from '../actions/userActions'
import {  truncateWords } from "../actions/globalActions"


import WeightDisplay from "../components/Reaction/WeightDisplay"


export default function ObservationDetailScreen({history, match}) {

    const { id } = match.params

    const observation = useSelector(state=>state.observationData.data)
    const {error} = observation

    const [loading, setLoading] = useState(true)

    const userInfo = useSelector(state=>state.userInfo)
    const { token, username } = userInfo

    const dispatch = useDispatch()

function handleCreateClick(){
    dispatch({type:"SOCIAL_METHOD_RESET"}) //remove any previous modal data

    let conclusionId;
    const config = {
        headers:{
            "Authorization" : `Bearer ${token}`
        }
        }
     axios.post(`/api/new-social-method/${id}/`,{}, config)
     .then(res=>{
            conclusionId = res.data.conclusion_id
            history.push(`/newsfeed/new-social-method/${id}/${conclusionId}`)
     })
}


    function showPreviewModal(socialMethod){
        dispatch({type:"SOCIAL_METHOD_REPLACE", payload:socialMethod})
        dispatch({type:"MODAL_SHOW"})

    }

    function checkIfBorrowed(artifact){
        let { borrowers } = artifact
        let borrowed = artifact.author.username !== username && !borrowers.includes(artifact.author.username)
        return borrowed
    }

    function handleClickReaction(artifact){
         // verify user in reaction
        let actionData = {}
        if (!verifyReactions(artifact.reactions)){
            actionData = {
                action: 'add',
                type:'like',
                labelObj:{ [artifact]:artifact.id }
            }
        }else{
            actionData = {
                action: 'remove',
                type:'like',
                labelObj: { [artifact]:artifact.id}
            }
        }
        actionData['token'] = token
        actionData['dispatchType'] = "OBSERVATION_DATA_UPDATE"

    }
    useEffect(()=>{
        
        if (!token || (error && error.status===401)){
            dispatch(logout())
        }else{
            dispatch({type:"OBSERVATION_DATA_RESET"}) //Ensure no observation data exists in state when page loads
            dispatch(getObservationData( id, token))

        }
        setLoading(false)

    }, [dispatch, id, token, error])


    return (
        <div className="mainScreen">
            <div>
            { loading ? <div style={{textAlign:"center"}}><h1>Loading</h1></div> :
                <Fragment> 
                    <div style={{textAlign:"center", margin:"15px"}}>
                        { token ? 
                        <Button  variant="info" 
                            onClick={handleCreateClick}>Create Social Method</Button>
                        :<Fragment>
                            <p><em>You'll need an account to add your own</em>&nbsp;<b>social method</b></p>
                            <Button onClick={()=>history.push('/login')}>Login</Button>
                        </Fragment>}
                    </div>
                    <Row>
                        <Fragment>

                        
                        {!observation.conclusion   || observation.conclusion.length == 0 ?
                        <h2>Be the first to create a social method</h2>
                        : observation.conclusion && observation.conclusion.map((conclusion, ix)=>(
                            <div key={ix}>
                                <p className="fakeLink f-2" onClick={()=>showPreviewModal(conclusion)}><b>{conclusion.title}</b></p>
                                <div  className="shadow rounded p-4 margin-bottom-xs">
                                    <Col>
                                        <Row>
                                            <Col>
                                            { conclusion.author.profilePicLink ? <img className="miniAvatar" src={conclusion.author.profilePicLink} />:
                                                <i className="fas fa-atom" />} 
                                            &nbsp;<Link to={`/user/${observation.author.username}`}>{observation.author.username}</Link>
                                            </Col>
                                            <Col xs="auto">
                                                <span>{conclusion.modified}</span>
                                            </Col>
                                        </Row>
                                        { conclusion.data.length > 0  && 
                                        <Row className="shadow rounded p-4 margin-bottom-xs">
                                            <Col>
                                                <h3>Data</h3>
                                                <ol>
                                                { conclusion.data.map(dataArtifact=>
                                                    <li key={dataArtifact.id}>{ truncateWords(dataArtifact.description, 10) } 
                                                        <span style={{fontWeight:"bold"}}>{ checkIfBorrowed(dataArtifact) && `Borrowed From ${dataArtifact.author.username}`} </span>
                                                        <div> &nbsp;&nbsp;&nbsp;&nbsp;<i className={`fas fa-check likeSymbol ${ verifyReactions(dataArtifact.reactions, username) && "success"}`} 
                                                                                onClick={()=>handleClickReaction(dataArtifact)}></i><WeightDisplay artifact={dataArtifact}/></div>                                                    
                                                    </li>
                                                )}
                                                </ol>
                                            </Col>
                                        </Row>
                                        }
                                        { conclusion.hypothesis.map((hypoArtifact, ix)=>
                                        <Row key={ix}className="shadow rounded p-4 margin-bottom-xs">
                                            <h3>Hypothesis</h3>
                                            <Col>
                                                <div>
                                                        { truncateWords(hypoArtifact.description, 10)} <p style={{fontWeight:"bold"}}>{checkIfBorrowed(hypoArtifact) && `Borrowed From ${hypoArtifact.author.username}`}</p>
                                                <div> &nbsp;&nbsp;&nbsp;&nbsp;<i className={`fas fa-check likeSymbol ${ verifyReactions(hypoArtifact.reactions, username) && "success"}`} 
                                                                                onClick={()=>handleClickReaction(hypoArtifact)}></i><WeightDisplay artifact={hypoArtifact}/></div>
                                                </div>
                                                
                                            </Col>
                                        </Row>
                                        )}
                                        { conclusion.experiment.length > 0 && 
                                        <Row className="shadow rounded p-4 margin-bottom-xs">
                                            <h3>Experiment</h3>
                                            <Col>
                                            <ol>
                                                { conclusion.experiment.map(expArtifact=>
                                                    <li key={expArtifact.id}>
                                                        { truncateWords(expArtifact.description, 10)} <span style={{fontWeight:"bold"}}>{checkIfBorrowed(expArtifact) && `Borrowed From ${expArtifact.author.username}`}</span>
                                                    <div> &nbsp;&nbsp;&nbsp;&nbsp;<i className={`fas fa-check likeSymbol ${ verifyReactions(expArtifact.reactions, username) && "success"}`} 
                                                                                onClick={()=>handleClickReaction(expArtifact)}></i><WeightDisplay artifact={expArtifact}/></div>

                                                    </li>
                                                )}
                                                </ol>                                            
                                            </Col>
                                        </Row>
                                            }

                                        { conclusion.conclusion &&
                                        <Row className="shadow rounded p-4 margin-bottom-xs">
                                            <Col>
                                            <h3>Conclusion</h3>
                                                <p>{conclusion.conclusion}</p>
                                            </Col>
                                        </Row>
                                        }
                                    </Col>
                                </div>
                            </div>
                        ))}
                        </Fragment>
                    </Row>
                    
                </Fragment> 
            }
            </div>
        </div> 
    )
}

