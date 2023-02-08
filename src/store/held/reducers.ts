import { TActionHeld, SET_HELDEN, ADD_HELD, REMOVE_HELD, IHeld } from './types';

export const reduceHelden = (
    state: IHeld[] = [],
    action: TActionHeld
): IHeld[] => {
    switch (action.type) {
        case ADD_HELD:
            return [
                ...state,
                action.payload
            ]
        case REMOVE_HELD:
            const helden = [...state];
            helden.splice(action.payload, 1);
            return helden;
        case SET_HELDEN:
            return action.payload;
        default:
            return state;
    }
};

