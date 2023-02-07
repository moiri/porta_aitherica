import React, { Fragment, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { NewHeld } from './NewHeld';

export const Helden: React.FC= () => {
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
                    <NewHeld />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Abbruch
                    </Button>
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Speichern
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}
