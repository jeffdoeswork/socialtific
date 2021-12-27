import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from "../constants/userConstants"

export const userloginReducer = (state={}, action)=>{
    switch(action.type){
        case USER_LOGIN_REQUEST:
            return {loading:true}
        case USER_LOGIN_SUCCESS:    
            return {loading:false, ...state,...action.payload}
        case USER_LOGOUT:
            localStorage.removeItem('userInfo')
            return {}
        default:
            return state
    }
}