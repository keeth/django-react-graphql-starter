import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducers, sagas } from './modules'
import * as a from './actionTypes'
import createSagaMiddleware from 'redux-saga'
import { fork, all } from 'redux-saga/effects'
import * as R from 'ramda'

let devtools = f => f

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__()
}

const appReducer = combineReducers({
  ...reducers,
  form: formReducer
})

const sagaMiddleware = createSagaMiddleware()

function * rootSaga () {
  yield all(R.map(fork, R.values(sagas)))
}

const rootReducer = (state, action) => {
  if (action.type === a.LOGOUT) {
    state = undefined
  }

  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  {},
  R.compose(applyMiddleware(sagaMiddleware), devtools)
)

sagaMiddleware.run(rootSaga)

export default store
