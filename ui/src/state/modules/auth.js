import * as a from '../actionTypes'
import { createAction } from 'redux-actions'
import { takeEvery, call } from 'redux-saga/effects'
import apolloClient from '../apolloClient'

export const logout = createAction(a.LOGOUT)

function * handleEvent (action) {
  switch (action.type) {
    case a.LOGOUT:
      yield call([localStorage, 'removeItem'], 'token')
      yield call([apolloClient, 'resetStore'])
      break
    default:
      break
  }
}

const saga = function * () {
  yield takeEvery(a.LOGOUT, handleEvent)
}

export default {
  saga
}
