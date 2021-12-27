import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"

import ArtifactFeedComponent from '../components/ArtifactFeed'

import { createGroupURL } from "../actions/globalActions"
import { retrieveUserDetails } from '../actions/userActions'
import { getGroupList } from '../actions/groupActions'
import { getArtifactFeed } from "../actions/artifactFeedActions"

import Button from "react-bootstrap/Button"
import logo from "../actual_logo.png"


export default  function ProfileScreen({history, match}) {

    const dispatch = useDispatch()
    const { username } = match.params
    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username:authUser, profilePicLink, friends } = userInfo

    const { groups, loading, error} = useSelector(state=>state.groups)

    const [userData, setUserData]= useState({
        image:""
    })

    const [tempImage, setTempImage] = useState(null)
    const [useHostData, setUseHostData] = useState({})

    function checkIfFollowing(){
        let isFollowing;
        if (friends){
            isFollowing = friends.isFollowing.find(friend=>friend === username)
            if (isFollowing){
                return true
            }else{
                return false
            }
        }

    }

    function checkIfAFollower(){
        let isAFollower;
        if (friends){
            isAFollower = friends.followers.find(friend=>friend === username)
            if (isAFollower){
                return true
            }else{
                return false
            }
        }

    }


    function handleImageChange(e){
        // Takes a target file sets the value as the image to be
        //sent to the backend and creates a temp object to be display
        // immediately
        const image = e.target.files[0]
        setUserData(prev=>({
            ...prev,
            image:image // data send to be further process then sent to backend
        }))
        setTempImage(URL.createObjectURL(image))
    }

    function startFollowing(){
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }
        axios.post('/api/users/friends/', {friend:username}, config)
        .then(res=>{
            dispatch(retrieveUserDetails(authUser))
        })
    }

    function unFollow(){
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }
        axios.delete(`/api/users/friends/${username}`, config)
        .then(res=>{
            dispatch(retrieveUserDetails(authUser))
        })
    }

    function submitData(){
        // the to send images, or multi-part form data (images
        // and text combined) is by using a FormData object
        // this is where the image will be further preprared for submission
        let formData = new FormData()
        
        userData.image && formData.append('image', userData.image, userData.image.name)

        axios.patch(`/api/users/profile/${authUser}/`, formData)
        .then(res=>{
             dispatch(retrieveUserDetails(authUser)) // this should eventualy be changed to token
            dispatch({type:"MESSAGE_UPDATE", payload:"Succesfully Updated Profile"})
           
        })
    }

    useEffect(()=>{
        // This useEffect is only to reload components
        // when a user's grouplist changes
        
        if ( username){
            dispatch(getGroupList(username))
        }else{
            dispatch(getGroupList(authUser))

        }
        dispatch(getArtifactFeed({user:username ? username : authUser}))

        if (!token){
            history.push("/newsfeed")
        }
    }, [dispatch, authUser, username, token])

    return (
        <div className="toRight profileMyScreen">
            <div className="innerMain">
                <div className="profileSectionTop">
                    <div className="userMeta">
                        <h1>{username ? username: authUser}</h1>
                        <div className="imageGroupWrapper">
                            { tempImage || profilePicLink ? <img className="mainAvatar" src={ profilePicLink ? profilePicLink: tempImage} /> : <i className="fas fa-atom fa-4x"></i> }

                        </div>
                        
                    </div>
                    <div>
                        {/* <Button variant="success" onClick={submitData}>Update</Button> */}
                        {!username ?
                        <Fragment>
                            <label className="upload">Edit profile pic <input type="file" onChange={handleImageChange}/></label>
                            <p>Edit my bio</p>
                            <p>Friends List</p>
                            <Link className="clickable" to="/changePassword">Change Password</Link>
                        </Fragment> : checkIfFollowing() ? 
                        <Button onClick={unFollow} variant="secondary">Unfollow { username } </Button>:
                            token && <Button onClick={startFollowing}>Follow { username } </Button>
                        }

                        { checkIfAFollower() && 
                        <Button disabled={true} className="follower">{username} is Following you</Button>
                        }
                    </div>

                </div>

                <div className="profileSectionBottom">
                    <div className="groupSection"> 
                        <h2> { !username ? "Your" : `${username}'s`}  Groups</h2>
                                           { loading ? <div>Loading Groups</div> : error ? <></>: groups.map((group, ix)=>
                        <div key={ix} className="organizationDiv" onClick={()=>history.push(`/groups/${createGroupURL(group.name)}`)}>
                           { !group.flag &&<img className="defaultFlag" src={logo} /> }
                            <p>{group.name}</p></div>)
                        }
                    </div>
                    <div>
                        <h2>Artifact Feed</h2>
                        <ArtifactFeedComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}

