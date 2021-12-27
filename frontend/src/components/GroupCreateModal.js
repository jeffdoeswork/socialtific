import React, { useState, useEffect }from "react"
import { useSelector, useDispatch } from "react-redux"
import logo from "../actual_logo.png"

import axios from "axios"

import Button from "react-bootstrap/Button"

export default function GroupCreateModal(){
    // Group Create modal handles it's own state changes


    const [newGroup, setNewGroup] = useState({
        flag:"",
        name:"",
        admin:"", 
        bio:""
    })

    const dispatch = useDispatch()
    const userInfo =  useSelector(state=>state.userInfo)
    const { token, username, profilePicLink } = userInfo


    const [tempImage, setTempImage] = useState(null)
    const [groupCreationError, setGroupCreationError] = useState({
        name:false,
        bio:false
    })

    const { groups } = useSelector(state=>state.groups)
    
    function handleImageChange(e){
        // Takes a target file sets the value as the image to be
        //sent to the backend and creates a temp object to be display
        // immediately
        
        const image = e.target.files[0]
        setNewGroup(prev=>({
            ...prev,
            image:image // data send to be further process then sent to backend
        }))
        setTempImage(URL.createObjectURL(image))
    }


    function handleInputChange(e, label){
        setGroupCreationError(prev=>({...prev, [label]:false}))
        setNewGroup({...newGroup, admin:username, [label]:e.target.value})
    }
    function submitGroupData(e){
        e.preventDefault()
        if (!newGroup.name){// a name is required
            setGroupCreationError(prev=>({...prev, name:true}))
            return
        }
        if (!newGroup.bio){// a name is required
            setGroupCreationError(prev=>({...prev, bio:true}))
            return
        }



        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }
        let formData = new FormData()
        
        newGroup.image && formData.append('flag', newGroup.image, newGroup.image.name)
        formData.append('name', newGroup.name)
        formData.append('members', newGroup.members)
        formData.append('bio', newGroup.bio)
        axios.post('/api/groups/', formData, config)
        .then(res=>{
            dispatch({type:"GROUP_MODAL_SHOW", payload:false})

            setTimeout(() => {
            dispatch({type:"GROUP_LIST_SUCCESS", payload:[...groups, res.data]})
    
            }, 500);
        })
    }


        function closeModal(e){
            let clicked = e.target
            let modalBody = document.querySelector('.innerModalBody')
            if (modalBody.contains(clicked)){
                return
            }else{
                dispatch({type:"GROUP_MODAL_SHOW", payload:false})
            }
        }

        function handleButtonDisabled(){
            if (newGroup.name === "" || newGroup.bio === ""){
                return true
            }
            else if (newGroup.bio !== "" && newGroup.bio.length < 50){
                return true
            }else{
                return false
            }
        }



    return(
            <div className="previewModal" >
                <div className="modalBody" onClick={closeModal}>
                    <div className="innerModalBody createModal">
                        <form onSubmit={submitGroupData}>
                            <div>
                                <span>Group Flag</span>
                                <label className="fileLabel">
                                    <img className={`defaultFlag ${tempImage && "tempImage"}`} src={ tempImage? tempImage: logo} /> 
                                    <input type="file"  onChange={handleImageChange} /> 
                                    Change Image
                                </label>

                            </div>
                            <div className="formGroup">
                                { groupCreationError.name &&<p className="required">A Group name is required</p> } 
                                <label>Group Name<span className="required">*</span></label>
                                <input onChange={e=>handleInputChange(e, 'name')}/>

                            </div>

                            <div className="formGroup">
                                { groupCreationError.bio &&<p className="required">A short description is required</p> } 
                                <label style={{display:"block"}}>Group Bio<span className="required">*</span></label>
                                <textarea style={{width:"100%"}} onChange={e=>handleInputChange(e, 'bio')} rows="3"/>

                            </div>

                            <Button type="submit" disabled={handleButtonDisabled()}>Create Group</Button>

                        </form>
                    </div>
                </div>  
            </div>

    )
}