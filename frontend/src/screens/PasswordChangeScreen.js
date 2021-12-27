import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import { logout } from "../actions/userActions"
import axios from "axios"


export default function PasswordChangeScreen({history}) {
    const [password, setPassword] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')

    // const [formError, setFormError] = useState([])
    const userInfo = useSelector(state=>state.userInfo)

    const { email } = userInfo

    const dispatch = useDispatch()


    function handleClick(){
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        axios.post('/api/users/change-password/', {password:password}, config)
        .then(res=>{
            alert('success')
            setPassword('')
            setPasswordTwo('')
        })
        .catch(err=>{
            const { status } = err.response
            if (status === 401){
                alert('Token Expired')
                dispatch(logout())
                history.push("/login")
            }
        })

    }

    function handlePasswordChange(e, num){
    if (num===1){
        setPassword(e.target.value)
    }else{
        setPasswordTwo(e.target.value)

    }
    // setFormError([])
}

    useEffect(()=>{
        if (!email){
            history.push("/login")
        }

    }, [email])
    return (
            <Container className="mt-4 bg-white">
                <Row className="mt-2">

                        <Col style={{margin:"0"}} xs={10}>

                            <div className="col-12 col-md-10">
                                <div className="shadow rounded p-4">
                                    <h4 className="mb-4"> Change Password</h4>
                                    <Form.Group>
                                        <Form.Label>Password </Form.Label>
                                        <Form.Control type="password" value={password} onChange = {(e)=>handlePasswordChange(e, 1)}/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type="password" value={passwordTwo} onChange={(e)=>handlePasswordChange(e, 2)}/>
                                    </Form.Group>            
                                    <div className="text-right">  
                                        <button className="btn btn-info" type="button" onClick={handleClick}> Change Password</button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        </Row>
                    </Container>
    )
}

