// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { mergeReducers, initReducers, createReducers } from './reducers'
import { pluginMiddlewares } from '../core'

// enable redux devtools
/* istanbul ignore next */
const composeEnhancers =
 process.env.NODE_ENV !== 'production' && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   : compose

let store = null

export const getStore = () => store

// create store
export const createStore = (
  initialState: any = {},
  extraReducers: $reducers = {},
): any => {
  initReducers()
  const middlewares = applyMiddleware(...pluginMiddlewares)
  const hasExtraReducers = Object.keys(extraReducers).length > 0
  const rootReducer = hasExtraReducers ? mergeReducers(extraReducers) : state => state
  const enhancer = composeEnhancers(middlewares)
  store = _createStore(rootReducer, initialState, enhancer)
}

export const createReducersAndUpdateStore = (model: $model) : void => {
  store.replaceReducer(
    mergeReducers({
      [model.name]: createReducers(model),
    })
  )
}
