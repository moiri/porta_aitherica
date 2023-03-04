import { Middleware } from 'redux';
import { TRootStore } from '../store';

const logger: Middleware<{}, TRootStore> = (store) => (next) => (action) => {
    console.group(action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
};

export default logger;
