import React, { useState } from 'react'
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"

import { useDispatch } from "react-redux"
import axios from "axios";


export default function SignUpScreen({history}) {

    const [username, setUsername] = useState('') 
    const [firstName, setFirstName] = useState('') 
    const [lastName, setLastName] = useState('') 
    const [email, setEmail] = useState('') 
    const [password, setPassword] = useState('') 
    const [passwordTwo, setPasswordTwo] = useState('') 
    const [profilePic, setProfilePic] = useState('')

    const [formError, setFormError] = useState([])

    const dispatch =  useDispatch()
    
    function handleClick(){
        let formData = {
            username:username,
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
            passwordTwo:passwordTwo,
            profilePic:profilePic,
        }
        if (password !== passwordTwo){
            setFormError(prev=>{
            return([
                ...prev,
                {type: "password",
                message:'Passswords do not match'
                }
            ])
             })
        }else{
            axios.post('api/users/signup/', formData)
            .then(res=>{
                    dispatch({type:"MESSAGE_UPDATE", payload:"Please check your email to complete registraion"})
                    history.push('/login')})
            .catch(err=>setFormError(prev=>([...prev,{ ...err.response.data}])))
    
        }

    }

    function handlePasswordChange(e, num){
        if (num===1){
            setPassword(e.target.value)
        }else{
            setPasswordTwo(e.target.value)

        }
        setFormError([])
    }

    function handleNameChange(e){
        setUsername(e.target.value)
        setFormError([])
    }

    return (
            <Container className="mt-4 bg-white">
                <Row className="mt-2">
                    <div className="col-12 col-md-10">
                        <div className="shadow rounded p-4">
                            <h4 className="mb-4">SIGN UP</h4>
                            { formError.length > 0 && formError.map((error, ix)=>
                                (<div key= {ix} style={{color:"red"}}>{error.message}</div>
                            ))}
                            <div>
                                <Form.Group>
                                    <Form.Label>Username</Form.Label>
                                <Form.Control value={username} onChange={handleNameChange}/>
                                </Form.Group>
                                
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>

                                    <Form.Control value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                                </Form.Group>
                                
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Password </Form.Label>
                                    <Form.Control type="password" value={password} onChange = {(e)=>handlePasswordChange(e, 1)}/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" value={passwordTwo} onChange={(e)=>handlePasswordChange(e, 2)}/>
                                </Form.Group>
                                
                                <Form.Group>
                                    <Form.Label>Profile Pic</Form.Label>
                                    <div>
                                        <Form.Control type="file" value={profilePic} onChange={(e)=>setProfilePic(e.target.value)}/>
                                    </div>
                                </Form.Group>
                                
                                <div className="text-right">  
                                
                                    <button className="btn btn-info" type="button" onClick={handleClick}>SIGN UP</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
    )
}

