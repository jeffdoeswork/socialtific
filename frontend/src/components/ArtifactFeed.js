import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"


import { getArtifactFeed } from '../actions/artifactFeedActions'
import { capitalize } from '../actions/globalActions'
import { verifyReactions, sendReaction } from '../actions/socialMethodActions'

import WeightDisplay from './Reaction/WeightDisplay'


export function ArtifactFeedComponent({artifacts}){

    const userInfo = useSelector(state=>state.userInfo)
    const { token, username } = userInfo

    const colorMap = { experiment:"red", data:"darkblue", 
    observation:"lightblue", conclusion:"green", hypothesis:"purple"}


    const dispatch = useDispatch()

            function handleClickReaction( artifact ){
         // **this not DRY remove!!**
        let actionData = {}
        let res = verifyReactions(artifact.reactions, username)
        console.log('way min click', res)
        if (!res){
            console.log('click adding')
            actionData = {
                action: 'add',
                type:'like',
                labelObj:{ [artifact.type]:artifact.id }
            }
        }else{
            actionData = {
                action: 'remove',
                type:'like',
                labelObj: { [artifact.type]:artifact.id}
            }
        }
        actionData['token'] = token
        actionData['dispatchType'] = "ARTIFACT_FEED_UPDATE"
        dispatch(sendReaction(actionData))
    }

    return (
        <div>
        {
            artifacts.map((artifact, ix)=>
                <div key={ix} className="artifactDiv artifactFeedDiv" style={{border:`1px solid  ${colorMap[artifact.type]}`}}>
                    <div className="artifactHeader">
                        <div className="artifactAuthorInfo">
                            { artifact.author.profilePicLink? <img className="avatar" src={ artifact.author.profilePicLink } alt="" /> : <i className="fas fa-atom fa-2x"></i>}
                            <Link className="artifactAuthor" to={`/user/${artifact.author.username}`}> { artifact.author.username }</Link>
                        </div>
                        <p className="artifactType" style={{color:`${colorMap[artifact.type]}`}}><b>{capitalize(artifact.type)}</b></p>
                        <WeightDisplay artifact={artifact}/>
                    </div>
                    <p className="artifactDescription">&nbsp;{artifact.description}</p>
                        <i className={`fas fa-check likeSymbol ${ verifyReactions(artifact.reactions, username) && "success"}`} onClick={()=>handleClickReaction(artifact)}></i>

                </div>)
            }        
        </div>)

}

export default  function ArtifactFeed() {


    const dispatch = useDispatch()
    const artifactFeed = useSelector(state=>state.artifactFeed)
    const { artifacts, loading, error } = artifactFeed

    const userInfo = useSelector(state=>state.userInfo)
    const { email, username } = userInfo

    useEffect(() => {

        dispatch(getArtifactFeed({user:username})) // will run once, 

        return ()=> dispatch({type:"ARTIFACT_FEED_RESET"})
    }, [ dispatch])

    return (
        <div className="toRight">
            <div className="innerMain p-100">
            { loading ? <div>Loading Artifacts </div> : error ? <div> Oops, theres has been an error</div> :
                <ArtifactFeedComponent artifacts={artifacts}/>
             }
            </div>
        </div>
    )
}