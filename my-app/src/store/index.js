import { createStore } from 'redux';

//import api from '../services/api';

const INITIAL_STATE = {
    projetos: [
        // Projetos retornados pela API
        'React Native',
        'ReactJS',
        'NodeJS'
    ]
};

function courses(state = INITIAL_STATE, action){
    switch (action.type) {
        case 'ADD_PROJETO':
            return { ...state, projetos: [ ...state.projetos, action.title ] };
        default:
            return state;
    }
}

const store = createStore(courses);

export default store;