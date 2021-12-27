import React, { useState } from 'react'
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import axios from "axios"

import ForgotPasswordSent from './ForgotPasswordSent'

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState()

    const [sent, setSent] = useState()

    function handleClick(){
        axios.post('/api/users/password-recovery', {email:email})
        .then(res=>{
            alert('success')
            setSent(true)
        })
        .catch(err=>console.log(err.response))
    }

    return (
        <Col style={{margin:"0"}} xs={10}>
            { !sent ? (

            <div className="col-12 col-md-10">
                <div className="shadow rounded p-4">
                    <h4 className="mb-4"> Forgot Password</h4>
                    <Form.Group>
                        <Form.Label>Email </Form.Label>
                        <Form.Control type="email" value={email} onChange = {(e)=>setEmail(e.target.value)}/>
                    </Form.Group>

                    <div className="text-right">  
                        <button className="btn btn-info" type="button" onClick={handleClick}> Send Link</button>
                    </div>
                </div>
            </div> ) :
            <ForgotPasswordSent />}
        </Col>

    )
}

