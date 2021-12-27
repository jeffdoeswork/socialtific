import React, { useState, useEffect }from 'react'
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../actions/userActions"

export default function LoginScreen({history}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userInfo =  useSelector(state=>state.userInfo)
    const { email  } = userInfo

 
    function handleSubmit(e){
        e.preventDefault()
        dispatch(login(username, password))

    }

    useEffect(()=>{
        if (email){
            history.push('/newsfeed')
        }
    }, [email, history])

    return (
        <Container fluid className="mt-4">
            <div style={{height:"10vh"}}></div>
            <Row>
                <div className="col-12 col-md-7 text-center">
                    <img className="img-fluid"  alt="Social Method" />

                    <h5 className="mt-3 mb-1 font-weight-bold">
                        <p>A Healthy Place for Deep and Meaningful Thoughts</p>
                    </h5>

                    <img  alt="Social Method" width="35%" />
                </div>
                <Col md={3} className="mb-5">
                    <div className="shadow rounded bg-white p-4" style={{marginTop:"15%"}}>
                        <div className="text-center mb-4">
                            <h2 className="card-header-title font-weight-bold">USER SIGN IN</h2>
                        </div>

                        <form  onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="id_username">Username</label>
                                <div>
                                    <input type="text" name="username" 
                                        className="form-control" required value={username}
                                        onChange={e=>setUsername(e.target.value)}placeholder="username" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="id_password">Password</label>
                                <div>
                                    <input type="password" 
                                        name="password" className="form-control" required value={password}
                                        onChange = {e=>setPassword(e.target.value)} placeholder="2j3tUyj5Ss" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button  className="btn btn-success btn-block" type="submit">
                                    <b>SIGN IN</b>
                                </button>
                            </div>

                        </form>

                        <div className="text-center">
                            <a href="/forgotPassword">Forgot password? Click here</a>
                            <br />
                            <a href="/signup">Don't have an account? Create one here</a>
                        </div>

                    </div>
                </Col>
            
            </Row>
        </Container>
    )
}


