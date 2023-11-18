import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import users from './usersReducer'
import streamers from './streamersReducer'
import search from './searchReducer'
import server from './serverReducer'

export default combineReducers({
    auth,
    token,
    users,
    streamers,
    search,
    server
})