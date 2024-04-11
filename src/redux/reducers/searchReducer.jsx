import ACTIONS from '../actions/'

const search = []

const searchReducer = (state = search, action) => {
    switch(action.type){
        case ACTIONS.GET_SEARCH:
            return action.payload
        case ACTIONS.GET_SEARCH_PAGE:
            return action.payload
        default:
            return state
    }
}

export default searchReducer