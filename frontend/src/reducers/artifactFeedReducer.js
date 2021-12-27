export const artifactFeedReducer = (state={artifacts:[]}, action) =>{
    switch(action.type){
        case "ARTIFACT_FEED_REQUEST":
            return { artifacts:[], loading:true }
        case "ARTIFACT_FEED_SUCCESS":
            return { loading:false, artifacts:action.payload }
        case "ARTIFACT_FEED_UPDATE":
            let prevArtifacts = state.artifacts.filter(obs=>obs.id !== action.payload.id)
            return {loading:false, artifacts:[ ...prevArtifacts, action.payload] }

        case "ARTIFACT_FEED_ERROR":
            return {artifacts:[], loading:false, error:action.payload}
        case "ARTIFACT_FEED_RESET":
            return { artifacts: []}
        default:
            return state
    }
}