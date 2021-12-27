/*Store .js

Redux 'store' where all application's reducers are combined and give the 
application access to the state

*/


import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"; // allows the browsers dev tools to access application state
import { userloginReducer } from "./reducers/userReducers";
import { newSocialMethodReducer, observationDataReducer, userSocialMethodsReducer, previewModalReducer, observationListReducer } from "./reducers/socialMethodReducers"
import { alertReducer } from "./reducers/alertReducers";
import { groupDetailReducer, groupListReducer, groupModalReducer } from "./reducers/groupReducers";
import { artifactFeedReducer } from "./reducers/artifactFeedReducer";
import { fauxDropReducer} from "./reducers/fauxDropReducer"

const middleware = [thunk]

const reducer = combineReducers({
    userInfo: userloginReducer,
    observationList: observationListReducer,
    observationData: observationDataReducer,
    userSocialMethods:userSocialMethodsReducer,
    newSocialMethod: newSocialMethodReducer,
    previewModal: previewModalReducer,
    alerts:alertReducer,
    groupDetail: groupDetailReducer,
    groups: groupListReducer,
    groupModal:groupModalReducer,
    artifactFeed: artifactFeedReducer,
    fauxDrop: fauxDropReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? // the store is created on page load, when we switch pages inside of the react app
    JSON.parse(localStorage.getItem('userInfo')) : {} // the store is already loaded, this logic here is saying, on full page reload (cTRL + R, or entering applicaton from outside domain)
                                                        // check localstorage for the value assigned to this key 'userInfo' or set state to an empty object
                                                        // without this on page refresh, userInfo (returned from userLoginReducer) would return an empty object 

const store = createStore(reducer, {userInfo: userInfoFromStorage}, composeWithDevTools(applyMiddleware(...middleware)))

export default store