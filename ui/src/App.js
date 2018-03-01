import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-client-preset'
import { branch, compose, renderComponent } from 'recompose'
import * as R from 'ramda'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { catchSubmissionError, graphqlErrorMessages } from './util'
import { connect } from 'react-redux'
import { logout } from './state/modules/auth'

const CurrentUserFragment = gql`
  fragment CurrentUser on CurrentUserNode {
    id
    username
    email
    firstName
    lastName
  }
`

const CurrentUserQuery = gql`
  query {
    currentUser {
      ...CurrentUser
    }
  }
  ${CurrentUserFragment}
`

const LoginMutation = gql`
  mutation($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      user {
        ...CurrentUser
      }
      token
      success
      error
    }
  }
  ${CurrentUserFragment}
`

const required = value => (value ? undefined : 'Required')

const TextField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error && <span style={{ color: 'red' }}>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)

const FormError = ({ error }) =>
  error ? (
    <div style={{ color: 'red' }}>
      Error:{' '}
      {Array.isArray(error) ? (
        <div style={{ whiteSpace: 'pre' }}>{error.join('\n')}</div>
      ) : (
        error
      )}
    </div>
  ) : null

const CurrentUser = compose(
  connect(null, { logout }),
  graphql(CurrentUserQuery, {
    props: ({ data: { currentUser, loading, error } }) => ({
      currentUser,
      currentUserLoading: loading,
      currentUserError: error
    })
  }),
  branch(
    R.prop('currentUserLoading'),
    renderComponent(() => <p>Loading...</p>)
  ),
  branch(
    R.prop('currentUserError'),
    renderComponent(({ currentUserError }) => (
      <p style={{ color: 'red' }}>
        Error: {graphqlErrorMessages(currentUserError)}
      </p>
    ))
  ),
  graphql(LoginMutation, {
    props: ({ ownProps: { mutation, cookies }, mutate }) => ({
      onSubmit: values =>
        mutate({
          variables: values,
          update: (proxy, { data: { login: { user } } }) => {
            const data = proxy.readQuery({ query: CurrentUserQuery })
            data.currentUser = user
            proxy.writeQuery({ query: CurrentUserQuery, data })
          }
        })
          .then(({ data: { login: { success, error, token } } }) => {
            if (!success) {
              throw new SubmissionError({ _error: error })
            }
            localStorage.setItem('token', token)
          })
          .catch(catchSubmissionError)
    })
  }),
  reduxForm({
    form: 'login'
  })
)(
  ({ currentUser, handleSubmit, error, loading, logout }) =>
    currentUser ? (
      <p>
        Hello, {currentUser.username} <button onClick={logout}>Log out</button>
      </p>
    ) : (
      <form onSubmit={handleSubmit}>
        <Field component={TextField} name='username' validate={required} />
        <Field
          component={TextField}
          type='password'
          name='password'
          validate={required}
        />
        <FormError error={error} />
        <div>
          <button type='submit' disabled={loading}>
            Log in
          </button>
        </div>
      </form>
    )
)

class App extends Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <div className='App-intro'>
          <CurrentUser />
        </div>
      </div>
    )
  }
}

export default App
