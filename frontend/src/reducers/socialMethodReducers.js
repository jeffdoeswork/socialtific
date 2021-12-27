/**Social Method Reducers
 * 
 Reducers are simply functions that use switch statements instead of if/else to return the application state

 The idea is when dispatch is called, the type will corrsepond to the 
case statement of the reducer. ie dispatch({type:"OBSERVATION_DATA_REQUEST"}), will 
traverse EVERY reducer but will only be accepted by the case statement that matches the action

To access the value the reducer returns, access the key in store.js (with useSelector).  
 */

import { initialSocialMethod } from "../constants/socialMethodConstants"

export const observationListReducer = (state={ observations:[]}, action)=>{
    switch(action.type){
        case "OBSERVATION_LIST_REQUEST":
            return  {observations:[], loading:true }
        case "OBSERVATION_LIST_SUCCESS":
            return {loading:false, observations:action.payload }
        case "OBSERVATION_LIST_RESET":
            return { observations:[] }
        case "OBSERVATION_LIST_UPDATE":
            let prevObservations = state.observations.filter(obs=>obs.id !== action.payload.id)
            return {loading:false, observations:[ ...prevObservations, action.payload] }
        case "OBSERVATION_LIST_ERROR":
            return {loading:false, error:action.payload}
        default:
            return state
    }
}
export const  observationDataReducer = (state={data:{}}, action)=> {
    switch(action.type){
        case "OBSERVATION_DATA_REQUEST":
            return {...state, loading:true}
        case "OBSERVATION_DATA_SUCCESS":
            return {loading:false, data:action.payload}
        case "OBSERVATION_DATA_FAIL":
            return {...state, error:action.payload}
        case "OBSERVATION_DATA_RESET":
            return {data:{}}
        case "OBSERVATION_DATA_UPDATE":
            return state // runs only when like occurs, to re render specific component, not fully-impleted 
        case "OBSERVATION_ADD_GROUP": 
            // once the entire group data is sent to the backend and applies the group to each artifact if the group 
            // property exists. Not required. 
            return { ...state, data:{ ...state.data, group:action.payload }}
        default:
            return state
    }
}

export const userSocialMethodsReducer = (state={methods:[]},action)=>{
    switch(action.type){
        case "USER_METHODS_REQUEST":
            return { ...state, loading:false }
        case "USER_METHODS_SUCCESS":
            return { loading:false, methods:action.payload }
        case "USER_METHODS_RESET":
            return { methods:[] }
        default:
            return state    
    }
}

export const newSocialMethodReducer = (state=initialSocialMethod, action) =>{
    switch(action.type){
        case "SOCIAL_METHOD_REQUEST":
            return {...state, loading:true}
        case "SOCIAL_METHOD_UPDATE":
            return {...state, [action.label]:action.payload}
        case "SOCIAL_METHOD_REPLACE":
            return {...action.payload, updateReplace:true}
        case "SOCIAL_METHOD_RESET":
            return {...initialSocialMethod}
        default:
            return state
    }
}

export const previewModalReducer = (state={}, action) =>{
    switch(action.type){
        case "MODAL_SHOW":
            return {display:true}
        case "MODAL_HIDE":
            return {display:false}
        default:
            return state
    }
}