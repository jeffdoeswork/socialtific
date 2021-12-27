/** Actions.js

Actions are functions that run intuitive logic on each dispatch call. Once an action is dipsatched, the 
logic in the action will then dispatch the type and action value to the reducer


HOMESCREEN.js
 ...
 dispatch(logout()) # logout is defined in userActions, calls inside of the aciton(function) runs dispatch (yes, again) to 
                    # send out the type:<REDUCER_CASE>, action:<any additional data> 
...


*/

import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from "../constants/userConstants"
import axios from "axios"

export const login = (username, password) => async(dispatch) =>{
    try{
        dispatch({type:USER_LOGIN_REQUEST}) // 'dispatches'  a call to the application, (call is recieved by reducers), type will match switch 
                                            // statment inside reducer, therefore, action.type == USER_LOGIN_REQUEST
        
        const { data } = await axios.post('api/users/login/', {username:username, password:password})
        
        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    }
    catch(error){ 
        dispatch({type:"MESSAGE_UPDATE", payload:"Incorrect credentails"})

    }
}

export const logout = () => async(dispatch)=>{
    dispatch({type:USER_LOGOUT})
}

export const changePassword = (userInfo, password) => async(dispatch) =>{

    try{
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.post('/api/auth/change-password',{password:password} , config )

    }catch(err){
        console.log('Error changing password', err.response)
    }
}

export const retrieveUserDetails = (username)=>async(dispatch)=>{
    // This is for page refresh, although the token is loaded
    // into state we wont want to put in sensitive in the browser
    // so we load the application state with user details
    try{
        const { data } = await axios.get(`/api/users/profile/${username}`)
        dispatch({type:"USER_LOGIN_SUCCESS", payload:data}) // technically the user is logging again, were just refetching some details
    }catch(err){
        console.log('error retriveing user details')
    }
}