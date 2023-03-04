import {
    TActionHeld,
    SET_HELDEN,
    SET_HELD_STATE,
    ADD_HELD,
    REMOVE_HELD,
    IHeld
} from './types';

const sortHelden = (a: IHeld, b: IHeld): number => {
    if (a['@_name'] < b['@_name']) {
        return -1;
    }
    if (a['@_name'] > b['@_name']) {
        return 1;
    }
    return 0;
};

export const reduceHelden = (
    state: IHeld[] = [],
    action: TActionHeld
): IHeld[] => {
    let index;
    let helden;
    switch (action.type) {
        case ADD_HELD:
            return [...state, action.payload].sort(sortHelden);
        case REMOVE_HELD:
            return state.filter((item) => item['@_key'] !== action.payload);
        case SET_HELDEN:
            return action.payload;
        case SET_HELD_STATE:
            index = state.findIndex(
                (item) => item['@_key'] === action.payload.id
            );
            helden = [...state];
            helden[index].meta.state = action.payload.state;
            return helden;
        default:
            return state;
    }
};
