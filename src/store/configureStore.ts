import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunkMiddleware from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';
import { reduceHelden } from './held';

import loggerMiddleware from './middleware/logger';

const rootReducer = combineReducers({
    helden: reduceHelden
});

export const configureStore = () => {
    const middlewares = [
        loggerMiddleware,
        thunkMiddleware,
        save({
            namespace: 'helden',
            states: ['helden']
        })
    ];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools({
        actionsBlacklist: []
    });

    const store = createStore(
        rootReducer,
        load({
            namespace: 'helden',
            states: ['helden']
        }),
        composedEnhancers(middlewareEnhancer)
    );

    return store;
};
