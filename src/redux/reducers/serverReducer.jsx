import ACTIONS from '../actions/'

const server = []

const serverReducer = (state = server, action) => {
    switch(action.type){
        case ACTIONS.GET_SERVER_INFO:
            return action.payload
        default:
            return state
    }
}

export default serverReducer