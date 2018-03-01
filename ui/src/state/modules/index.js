import * as R from 'ramda'

import { default as auth } from './auth'

const modules = {
  auth
}

export const reducers = R.reject(
  R.isNil,
  R.mapObjIndexed((v, k) => v.reducer, modules)
)

export const sagas = R.reject(
  R.isNil,
  R.mapObjIndexed((v, k) => v.saga, modules)
)
