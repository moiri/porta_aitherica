import { ADD_HELD, REMOVE_HELD, SET_HELDEN, IHeld, TActionHeld } from '.';

export const heldActions = {
    addHeld,
    removeHeld,
    setHelden
};

function addHeld(
    held: IHeld
): TActionHeld {
    return {
        type: ADD_HELD,
        payload: held
    };
}

function removeHeld(
    idx: number
): TActionHeld {
    return {
        type: REMOVE_HELD,
        payload: idx
    };
}

function setHelden(
    helden: IHeld[]
): TActionHeld {
    return {
        type: SET_HELDEN,
        payload: helden
    };
}
