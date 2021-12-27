import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroupDetail } from '../actions/groupActions'
import { Link } from "react-router-dom"
import axios from "axios"

import Button from "react-bootstrap/Button"
import logo from "../actual_logo.png"

import { getArtifactFeed } from "../actions/artifactFeedActions"
import { ArtifactFeedComponent } from "../components/ArtifactFeed"
import { createGroupURL } from "../actions/globalActions"

function Groupmembersection({ members, admin, handleUser }){
    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username } = userInfo
    
    function teamMembers(){
        let count = members.length
        if (admin){
            count ++
        }
        return count
    }

    return(
        <div className="groupSideBar">
            <p>Number of users: {teamMembers() }</p>
            <div>
                <p style={{fontWeight:"bold", color:"red"}}>Admin: <Link to={`/user/${admin.username}`} >{ admin.username }</Link></p>
                <p>Members</p>
                {members.map((member, ix)=>
                <Fragment>
                    <Link to={`/user/${member.username}`}>{member.username}&nbsp;</Link>
                    { admin.username === username && <Button variant="danger" onClick={()=>handleUser(member.username)}> Remove User</Button> }
                </Fragment>)}
            </div>
        </div>
    )
}

function Groupbanner(){

    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username } = userInfo

    const groupDetail = useSelector(state=>state.groupDetail)
    const { loading, error, flag, bio, name, admin, banner_link } = groupDetail
    let slug = createGroupURL(name)

    const dispatch = useDispatch()
    const [style, setStyle] = useState(null)
    const [tempImage, setTempImage] = useState()
    // Bio
    const [editBio, setEditBio] = useState() // button state
    const [groupBio, setGroupBio] = useState(bio)

    function handleImageChange(e){
        let formData = new FormData()
        const image = e.target.files[0]
        // setGroupData(prev=>({ // leave just in case we want to allow a preview feature, before immediately sending to backend
        //     ...prev,
        //     image:image 
        // }))
        setStyle({
            backgroundImage:`url(${URL.createObjectURL(image)})`,
            backgroundSize:"cover"
    })
            
        formData.append('banner', image, image.name)

        axios.patch(`/api/groups/${slug}/`, formData)
        .then(res=>dispatch({type:"GROUP_DETAIL_SUCCESS", payload:res.data}))
    
    }

    function saveBio(){
        if (groupBio.length >= 50){
            const config = {
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            }
            axios.patch(`/api/groups/${slug}/`, {bio:bio}, config)
            .then(res=>{ 
                dispatch({type:"GROUP_DETAIL_SUCCESS", payload:res.data})
                setEditBio(false)
            })
        }

    }
    useEffect(()=>{
        if (banner_link){
            setStyle({
            backgroundImage:`url(${banner_link})`,
            backgroundSize:"cover"
            })
        }
        dispatch(getArtifactFeed({group:slug}))
    }, [banner_link, dispatch])

    return(
        <Fragment>
            <p style={{textAlign:"center", fontSize:"1.5em"}}><b>{ name }</b> </p>
            <div className="orgDetailBanner" style={ style }>
                <div className="bannerUpload">
                    <label className="icon"><i className="fas fa-image " style={{backgroundColor:"white"}}></i>
                        <input type="file" onChange={handleImageChange}/>
                    </label>
                </div>

                <div>
                    <img className={`defaultFlag ${flag && "tempImage"}`} src={ flag ? flag: logo} /> 
                </div>
            </div>
            <div className="bio">
                { editBio ? <Fragment><input style={{width:"50%"}} value={groupBio} onChange={e=>setGroupBio(e.target.value)}/>
                            <Button variant="secondary" onClick={()=>setEditBio(false)}>Cancel</Button>
                            <Button onClick={saveBio} disabled={groupBio.length < 50}>Save</Button></Fragment> : 
                
                groupBio }

                {  admin.username === username && !editBio && <i className="far fa-edit icon" style={{display:"inline-block", paddingLeft:"20px"}} onClick={()=>setEditBio(true)}></i> }
            </div>
        </Fragment>
    )
}

const GroupBanner = React.memo(Groupbanner)
const GroupMemberSection = React.memo(Groupmembersection)

export default function GroupDetailScreen({ history, match }) {


    const { name:slug } = match.params

    const dispatch = useDispatch()

    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username, groups } = userInfo


    const groupDetail = useSelector(state=>state.groupDetail)
    const { loading, error, flag, members, bio, name, admin, banner_link } = groupDetail


    const [groupData, setGroupData] = useState()


    //Artifacts
    const artifactFeed = useSelector(state=>state.artifactFeed)
    const { artifacts, loading:loadingArtifacts, error:errorArtifacts } = artifactFeed


    function handleUser(username, option){
        const config = {
            headers:{
                "Authorization" : `Bearer ${token}`
            }
        }
        let patchData;
        if (option === 'add'){
            patchData = {member:username}
        }else{
            patchData = {member:username, 
            remove:true}
        }
        axios.patch(`/api/groups/${slug}/`, patchData, config)
        .then(res=>dispatch({type:"GROUP_DETAIL_SUCCESS", payload:res.data}))
        .catch(err=>console.log("Error group action"))
    }

    useEffect(()=>{
        dispatch(getGroupDetail(slug))
        return()=> dispatch({type:"GROUP_DETAIL_RESET"})
    }, [dispatch, slug])
    return (
        <div>
        { loading || !name ? <div>Loading group data</div> : error ? <p>Error loading Group</p>:
        <div className="toRight " style={{paddingTop:"20px"}}>
            <div className="innerMain">
                < GroupBanner />

                <div className="orgDetailScreen">
                    <div style={{width:"100%"}}>
                        { admin && admin.username !== username && 
                        <div>
                            { members.find(member=>member.username === username) ?
                            <Button variant="secondary" onClick={()=>handleUser(username, 'leave')}> Leave group</Button>
                            : token && groups.length < 2 ? <Button variant="success" onClick={()=>handleUser(username, 'add')}> Join group</Button> :
                            token ? <div style={{color:"red"}}>Your assigned to 2 groups</div> : 
                            <Fragment><p>Sign in to join!</p><Button onClick={()=>history.push("/login")}>Login</Button>  </Fragment>
                        }
                        </div>
                            }
                    </div>
                    <GroupMemberSection members={members} admin={admin} handleUser={handleUser}/>
                    <ArtifactFeedComponent artifacts={artifacts} />

                </div>
            </div>         
        </div>
                    }
                    </div>
    )
}
