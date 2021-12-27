export const fauxDropReducer = (state=false, action)=>{
    switch(action.type){
        case "FAUX_DROP_SHOW":
            return action.payload
        default:
            return state

    }
}