import axios  from "axios"

export const getArtifactFeed = ({ user, group} )=>async(dispatch)=>{
    // One Reducer will filter artifacts by Group and/or by user
    dispatch({type:"ARTIFACT_FEED_REQUEST"})
    let url;

    if (group){
        url = `/api/artifacts?group=${group}`
    }else if(user){
        url = `/api/artifacts?user=${user}`
    }
    try{
        const { data } = await axios.get(url)

        dispatch({type:"ARTIFACT_FEED_SUCCESS", payload:data})
    }catch(err){
        dispatch({type:"ARTIFACT_FEED_ERROR"})
        console.log('Error fetching artifacts')
    }
    
}