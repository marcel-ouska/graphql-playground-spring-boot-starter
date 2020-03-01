import * as React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { connect, Provider } from 'react-redux'
import { store } from './GraphQLBinApp'
import PlaygroundWrapper from './PlaygroundWrapper'
import Keycloak = require('keycloak-js')

export default class Root extends React.Component<{}, {}> {
  public static keycloak = Keycloak()

  private interval: any

  componentDidMount() {
    this.setupKeycloak()
  }

  setupKeycloak() {
    Root.keycloak
      .init({ onLoad: 'login-required' })
      .success(() => {
        this.onKeycloakResponse()
      })
      .error(() => alert('failed to authenticate'))
  }

  onKeycloakResponse = () => {
    Root.keycloak.loadUserProfile().success(() => {
      Root.keycloak.loadUserInfo().success(() => this.forceUpdate())
      this.interval = setInterval(() => this.refreshToken(), 30000)
    })
  }

  refreshToken = () => {
    Root.keycloak
      .updateToken(70)
      .success(() => {
        clearInterval(this.interval)
        this.onKeycloakResponse()
      })
      .error(() => alert('failed to refresh'))
  }
  render() {
    // return (
    //   <BrowserRouter>
    //     <Switch>
    //       <Route path="/v2/:id" component={GraphQLBinApp} />
    //       <Redirect
    //         exact={true}
    //         from="/"
    //         to="/v2/new"
    //         component={GraphQLBinApp}
    //       />
    //       <Route path="*" component={RedirectToOldPlayground} />
    //     </Switch>
    //   </BrowserRouter>
    // )

    return (
      <div>
        {Root.keycloak.authenticated ? (
          <Provider store={store}>
            <PlaygroundWrapper
              endpoint={'/graphql'}
              headers={{}}
              subscriptionEndpoint={'/graphql'}
            />
          </Provider>
        ) : null}
      </div>
    )
  }
}

const RedirectToOldPlayground = props => {
  location.href = `https://legacy.graphqlbin.com${location.pathname}${
    location.search
  }`
  return null
}
