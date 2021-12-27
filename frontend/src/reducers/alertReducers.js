
export const alertReducer = (state=[], action)=>{
    switch (action.type){
        case "MESSAGE_UPDATE":
            return [...state, action.payload]
        case "MESSAGE_REPLACE":
            if (!action.payload){
                return []
            }
            return [action.payload]
        default:
            return state
    }
}