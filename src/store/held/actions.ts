import {
    ADD_HELD,
    REMOVE_HELD,
    SET_HELDEN,
    SET_HELD_STATE,
    IHeld,
    TActionHeld,
    THeldState
} from '.';

export const heldActions = {
    addHeld,
    removeHeld,
    setHelden,
    setHeldState
};

function addHeld(held: IHeld): TActionHeld {
    return {
        type: ADD_HELD,
        payload: held
    };
}

function removeHeld(idx: string): TActionHeld {
    return {
        type: REMOVE_HELD,
        payload: idx
    };
}

function setHelden(helden: IHeld[]): TActionHeld {
    return {
        type: SET_HELDEN,
        payload: helden
    };
}

function setHeldState(id: string, state: THeldState): TActionHeld {
    return {
        type: SET_HELD_STATE,
        payload: { id, state }
    };
}
