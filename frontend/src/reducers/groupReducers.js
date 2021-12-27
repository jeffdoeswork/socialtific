const initialState = {
    members:[] // Start with empty list, since we will be accessing
                // further attributes right on page load
}

export const groupDetailReducer=(state=initialState, action)=>{
    switch(action.type){
        case "GROUP_DETAIL_REQUEST":
            return {...state, loading:true}
        case "GROUP_DETAIL_SUCCESS":
            return {...action.payload, loading:false}
        case "GROUP_DETAIL_ERROR":
            return {...state, loading:false, error:action.payload}
        case "GROUP_DETAIL_RESET":
            return initialState    
        default:
            return state
        }
}

export const groupListReducer=(state={groups:[]}, action)=>{
    switch(action.type){
        case "GROUP_LIST_REQUEST":
            return {...state, loading:true}
        case "GROUP_LIST_SUCCESS":
            return {...state, groups:action.payload, loading:false}
        case "GROUP_LIST_RESET":
            return {groups:[]}
        default:
            return state
        }
}

export  const groupModalReducer = (state=false, action)=>{
    switch(action.type){
        case "GROUP_MODAL_SHOW":
            return action.payload
        default:
            return state
    }
}