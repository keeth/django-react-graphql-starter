import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import apolloClient from './state/apolloClient'
import reduxStore from './state/reduxStore'
import { CookiesProvider } from 'react-cookie'

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ReduxProvider store={reduxStore}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </ReduxProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
