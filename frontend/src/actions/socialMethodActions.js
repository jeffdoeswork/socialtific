/** Actions.js

Actions are functions that run intuitive logic on each dispatch call. Once an action is dipsatched, the 
logic in the action will then dispatch the type and action value to the reducer

see userActions.js for example

*/

import axios from "axios"


export const getObservationList = () => async(dispatch) =>{
    // Load observations on page load

    dispatch({type:"OBSERVATION_LIST_REQUEST"})
    try{
        const { data } = await axios.get('/api/observations/') 
        dispatch({type:"OBSERVATION_LIST_SUCCESS", payload:data})
    }catch(error){
        console.log('Error Fetching Observations')
        dispatch({type:"OBSERVATION_LIST_FAIL"})
    }
        
   
}

export const getObservationData = (id, token)=>async(dispatch)=>{
    dispatch({type:"OBSERVATION_DATA_REQUEST"})
    try{
        const config = {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        }
        const { data } = await axios.get(`/api/observations/${id}/`,config)
        dispatch({type:"OBSERVATION_DATA_SUCCESS", payload:data})
    }catch(error){
        console.log('error retrieving observation detail', error.response)
        dispatch({type:"OBSERVATION_DATA_FAIL", payload:error.response})
    }
}

export const getUserSocialMethods = (user, id, draft) => async(dispatch)=>{
    dispatch({type:"USER_METHODS_REQUEST"})
    try{
        const { data } = await axios.get(`/api/conclusion?user=${user}&observation=${id}`)
        dispatch({type:"USER_METHODS_SUCCESS", payload:data})
    }catch(error){
        console.log('error getting user methods', error)
    }
}

  export const submitSocialMethod = (id, formData, token)=>async(dispatch)=>{
    try{
        const config = {
            headers:{
                "Authorization" : `Bearer ${token}`
            }
        }
        axios.post(`/api/new-social-method/${id}/`, formData,config )
        dispatch({type:"SOCIAL_METHOD_UPDATE", label:"autosave", payload:Date.now()})
    }catch(err){
        console.log('Error submitting observartion', err.response)
    }    
        
    }


    
export const sendReaction = ({action, type, labelObj, token, dispatchType })=>async(dispatch)=>{
        // action means add or remove 
        // type *default to Like*
        // labelObj must be objects {action:'add', type:'like', {observation:10}}
        
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }
        const artifact = Object.keys(labelObj)[0].toLowerCase()


        if (action=== 'add'){
           axios.get(`/api/react?artifact=${artifact}&id=${labelObj[artifact]}`, config)
           .then(res=>dispatch({type:dispatchType, payload:res.data})) 
           .catch(err=>console.log('Error updated reaction', err.response))
        }else{
            axios.delete(`/api/react?artifact=${artifact}&id=${labelObj[artifact]}/`, config)
            .then(res=>dispatch({type:dispatchType, payload:res.data})) 
            .catch(err=>console.log('Error deleting response', err.response))
        }

        
    }


    export function verifyReactions(reactions, username){
        // Helper function but ends global username
        let found = reactions.find(reaction=>reaction.user === username)
        return found
    }