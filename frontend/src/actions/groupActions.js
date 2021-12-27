import  axios from "axios"

export const getGroupDetail = (name)=> async(dispatch)=>{
    dispatch({type:"GROUP_DETAIL_REQUEST"})
    try{
        const { data } = await axios.get(`/api/groups/${name}`)
        dispatch({type:"GROUP_DETAIL_SUCCESS", payload:data})
    }catch(err){
        dispatch({type:"GROUP_DETAIL_ERROR"})
    }
}


export const getGroupList=(username)=>async(dispatch)=>{
    dispatch({type:"GROUP_LIST_REQUEST"})
    let url;
    if (username){
        url = `/api/groups?user=${username}`
    } else{
        url = '/api/groups'
    }
    try{
    const { data }= await axios.get(url)
        dispatch({type:"GROUP_LIST_SUCCESS", payload:data})
    }
    catch(err){
        console.log('bad stuff', err.response)
        dispatch({type:"GROUP_LIST_ERROR"})
    }
}