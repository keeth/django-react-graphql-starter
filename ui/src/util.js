import * as R from 'ramda'
import { SubmissionError } from 'redux-form'

export function graphqlErrorMessages (err) {
  return R.map(
    R.prop('message'),
    R.concat(
      R.when(R.isNil, R.always([]), R.path(['graphQLErrors'], err)),
      R.when(
        R.isNil,
        R.always([]),
        R.path(['networkError', 'result', 'errors'], err)
      )
    )
  )
}

export function catchSubmissionError (err) {
  if (err instanceof SubmissionError) {
    throw err
  }
  throw new SubmissionError({
    _error: graphqlErrorMessages(err)
  })
}
