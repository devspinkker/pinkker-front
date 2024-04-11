import ACTIONS from '../actions/'

const streamers = []

const streamersReducer = (state = streamers, action) => {
    switch(action.type){
        case ACTIONS.GET_ALL_STREAMERS_ONLINE:
            return action.payload
        default:
            return state
    }
}

export default streamersReducer