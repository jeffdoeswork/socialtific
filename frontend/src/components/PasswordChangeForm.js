import React, { useState }from 'react'
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import axios from "axios"

export default function PasswordChangeForm(props) {

    const [password, setPassword] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')


    function handlePasswordChange(e, num){
        if (num===1){
            setPassword(e.target.value)
        }else{
            setPasswordTwo(e.target.value)

        }
    }


    function handleClick(){
        axios.post('/api/users/change-password/', {password:password, user:props.user})
        .then(res=>{
            alert('success')
            props.history.push('/login')
        })
    }

    return (
        <Col style={{margin:"0"}} xs={10}>

            <div className="col-12 col-md-10">
                <div className="shadow rounded p-4">
                    <h4 className="mb-4">{props.title}</h4>
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
    )
}

