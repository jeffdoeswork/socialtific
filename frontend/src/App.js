import "./App.css"
import React, { Fragment } from "react"
import NewsFeed from "./screens/NewsFeed"
import Container from "react-bootstrap/Container"
import { BrowserRouter as Router, Route, useRouteMatch, Redirect, Switch } from 'react-router-dom'
import ObservationDetailScreen from "./screens/ObservationDetailScreen"

import Alert from "./components/Alert"
import SignUpScreen from "./screens/SignUpScreen"
import LoginScreen from "./screens/LoginScreen";
import SocialMethodScreen from "./screens/SocialMethodScreen"
import Header from "./components/Header"
import ArtifactFeed from "./components/ArtifactFeed"
import PasswordChangeScreen from "./screens/PasswordChangeScreen"
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen"
import ForgotPasswordConfirm from "./screens/ForgotPasswordConfirm"
import GroupScreen from"./screens/GroupScreen"
import GroupDetailScreen from "./screens/GroupDetailScreen"
import ValidateRegistrationScreen from "./screens/ValidateRegistrationScreen"
import ProfileScreen from "./screens/ProfileScreen"


function NewsFeedRoutes(props){
  const match = useRouteMatch();

  return(

      <Switch>
        <Route exact path={`${match.path}/new-social-method/:id/:conclusionId`} component={SocialMethodScreen} />
        <Route exact path={`${match.path}/observations/:id`} component={ObservationDetailScreen} />
        <Route exact path={match.path} component={NewsFeed} />
      </Switch>
  )
}

function Main(props){
  // A 'dispatch' to seperate Newsfeed routes from others
  // and allows Header to be rendered in one place

  return(
    <Fragment>
      <Header />
      <Switch>
        <Route exact path ="/user/:username" component={ProfileScreen} />
        <Route exact path="/artifactFeed" component={ArtifactFeed} />
        <Route exact path = "/groups" component={GroupScreen} />
        <Route exact path = "/groups/:name" component={GroupDetailScreen} />
        <Route exact path = "/myProfile" component={ProfileScreen} />
        <Route path = "/newsfeed" component={NewsFeedRoutes} />
      </Switch>
  </Fragment>)

}


function App() {
 // Main entry point for application

 return (
    <Router>
      <Route exact path="/"> 
        <Redirect to="/newsfeed" />
      </Route>
      <Container>
        <Alert />
        <Switch>
          <Route exact path="/signup" component={SignUpScreen} />
          <Route exact path="/login" component={LoginScreen} />
          <Route exact path= "/changePassword" component={PasswordChangeScreen} />
          <Route exact path ="/forgotPassword" component={ForgotPasswordScreen} />
          <Route exact path="/passwordRecoverConfirm" component={ForgotPasswordConfirm} />
          <Route exact path="/registration-confirm" component={ValidateRegistrationScreen} />
          <Route path = "/" component={Main} />

        </Switch>
        </Container>
        
    </Router>
    );
}

export default App;
