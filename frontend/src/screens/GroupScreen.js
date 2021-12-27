import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch  } from "react-redux"
import logo from "../actual_logo.png"
import axios from "axios"

import Button from "react-bootstrap/Button"

import { getGroupList } from "../actions/groupActions"
import { createGroupURL } from "../actions/globalActions"

export default function GroupScreen({ history }) {


    const dispatch = useDispatch()


    const { groups, loading } = useSelector(state=>state.groups)
    const [sent, setSent] = useState(false)

    const groupModal = useSelector(state=>state.groupModal)

    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username } = userInfo

    const [groupSearchInput, setGroupSearchInput] = useState("")
    const [filteredGroups, setFilteredGroups] = useState([])
    const [blankSend, setBlankSend] = useState(false)

    const getFilteredGroups = React.useCallback(()=>{
        let url;
        if (groupSearchInput == ""){
            url = '/api/groups'
            setBlankSend(true)
        }else{
            url = `/api/groups?group=${groupSearchInput}`
            setBlankSend(false)
        }
        axios.get(url)
        .then(res=>setFilteredGroups(res.data))
        .catch(err=>console.log('Error catching filtered groups', err.response))
       
    }, [groupSearchInput])

    useEffect(()=>{
        // This useEffect is only to reload components
        // when a user's grouplist changes
    if ( username && !loading && !sent ){
            dispatch(getGroupList(username))
            setSent(true)
        }
    }, [dispatch, username, groups, groupModal, loading, sent])

    useEffect(()=>{
        // This only 'listen's for searchInput changes
        // and will re render component
        let thisSent = false
        let countDown;
        if(groupSearchInput !== ""){
            countDown = setTimeout(()=>{
                getFilteredGroups()
            }, 500)
        }else{
            if (!thisSent){
                getFilteredGroups()
            }
            
        }
        return ()=>countDown && clearTimeout(countDown) // if time is set, clear on state change        
    }, [dispatch, groupSearchInput, getFilteredGroups, blankSend, groups])



    return (
        <div className="toRight">
            <div className="innerMain p-100">
                <h2>Group  Explorer</h2>
                <div className="organizationWrapper">
                    { token ? 
                    <Fragment>
                        { groups.map((group, ix)=>
                            <div key={ix} className="organizationDiv" onClick={()=>history.push(`/groups/${createGroupURL(group.name)}`)}>
                            { !group.flag &&<img className="defaultFlag" src={logo} /> }
                                <p>{group.name}</p></div>)
                            }
                            { groups.length < 2 && 
                        <div className="organizationDiv" onClick={()=>dispatch({type:"GROUP_MODAL_SHOW", payload:true})}>
                            <i className="fas fa-users fa-2x"></i>
                            <p>Create a group</p>
                        </div>
                     }
                     </Fragment>:
                     <div> 
                         <p>Sign in to add yourself a group or start your own!</p>
                         <Button onClick={()=>history.push("/login")}> Login</Button>
                         </div>
                        }
                </div>                    
            </div>

            <hr />
            <div>
                <label> Search for Groups
                <input onChange={e=>setGroupSearchInput(e.target.value)} />
                </label>
                <div className="organizationWrapper">
                    { filteredGroups.map((group, ix)=>
                        <div key={ix} className="organizationDiv" onClick={()=>history.push(`/groups/${group.name}`)}>
                           { !group.flag &&<img className="defaultFlag" src={logo} /> }
                            <p>{group.name}</p></div>   
                    )}
                </div>
            </div>           
        </div>
    )
}

