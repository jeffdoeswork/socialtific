import React, { Fragment } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions"
import { Link } from "react-router-dom"

export default function SideLinks(props) {

    const dispatch = useDispatch()

    const userInfo =  useSelector(state=>state.userInfo)
    const { email  } = userInfo

    
    function handleClick(){
        dispatch(logout())
    }
    return (
        <div className="sideLinks">
            <div style={{ padding: "10px", background: "#446a86"}}>
                {email ?  (
                    <Fragment>
                    <Link className="myNavLink clickable" to="/artifactFeed">Artifact Feed</Link>                        
                    <Link className="myNavLink clickable" to="/newsfeed">Observation Feed</Link>
                    <Link className="myNavLink clickable" to="/myProfile">My Profile</Link>
                    <Link className="myNavLink clickable" to="/groups">Groups</Link>
                    <button style={{ padding: "0",border:"none", background:"transparent", color:"white"}} 
                        onClick={handleClick} type="button" ><span  className="clickable">Logout</span></button>
                </Fragment> ) : 
                <Fragment>
                    <Link className="myNavLink clickable" to="/newsfeed">Observation Feed</Link>
                    <Link className="myNavLink clickable" to="/groups">Groups</Link>
                    <Link className="myNavLink clickable" to="/login">Login</Link>
                </Fragment>
                        }
                
            </div>
        </div>

    )
}

