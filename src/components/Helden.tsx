import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { NewHeld } from './NewHeld';
import { IHeld, heldActions } from '../store/held';
import { TRootStore } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';

export const Helden: React.FC= () => {
    const dispatch = useDispatch();
    const helden = useSelector((store: TRootStore) => store.helden);
    const [held, setHeld] = useState<IHeld>();
    const [show, setShow] = useState(false);
    return (
        <Fragment>
            <Button variant="dark" onClick={() => setShow(true)}>
                Neuer Held
            </Button>
            <Modal backdrop="static" size="xl" show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Neuen Held Hochladen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewHeld held={held} onChange={setHeld} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Abbruch
                    </Button>
                    <Button disabled={held === undefined} variant="primary" onClick={() => {
                        if (held) {
                            dispatch(heldActions.addHeld(held));
                        }
                        setShow(false);
                    }}>
                        Speichern
                    </Button>
                </Modal.Footer>
            </Modal>
            <ListGroup className="mt-3">
                {helden.map((item, idx) =>
                    <LinkContainer key={idx} to={`/helden/${idx}`}>
                        <ListGroup.Item action className="d-flex align-items-center">
                            {item['@_name']}
                            {` | `}
                            {item.basis.ausbildungen.ausbildung['@_string']}
                            <Button
                                size="sm"
                                className="ms-auto"
                                variant="danger"
                                onClick={() => dispatch(heldActions.removeHeld(idx))}
                            >
                                <FontAwesomeIcon
                                    title="Den Helden löschen"
                                    icon="trash"
                                />
                            </Button>
                        </ListGroup.Item>
                    </LinkContainer>
                )}
            </ListGroup>
        </Fragment>
    );
}
