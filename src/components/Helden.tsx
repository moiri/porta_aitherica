import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Alert, Modal, Button, ListGroup } from 'react-bootstrap';
import { NewHeld } from './NewHeld';
import { IHeld, IEigenschaft, IMetaAttr, IAttrBase, IAttrExt, heldActions } from '../store/held';
import { TRootStore } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';

export const Helden: React.FC= () => {
    const dispatch = useDispatch();
    const helden = useSelector((store: TRootStore) => store.helden);
    const [held, setHeld] = useState<IHeld>();
    const [show, setShow] = useState(false);
    let error = '';
    if (held && helden.find(item => item['@_key'] === held['@_key'])) {
        error = 'Doppelter Eintrag, dieser Held existiert bereits';
    }
    const getEigenschaftValue = (eigenschaft: IEigenschaft, attrs: IAttrBase, key: string) => {
        if ('@_startwert' in eigenschaft) {
            return Number(eigenschaft['@_value']);
        }
        if (key === 'LE') {
            return Math.round((attrs.KO.value + attrs.KO.value + attrs.KK.value)/2 + Number(eigenschaft['@_value']) + Number(eigenschaft['@_mod']));
        }
        if (key === 'AU') {
            return Math.round((attrs.MU.value + attrs.GE.value + attrs.KO.value)/2 + Number(eigenschaft['@_value']) + Number(eigenschaft['@_mod']));
        }
        if (key === 'MR') {
            return Math.round((attrs.MU.value + attrs.KL.value + attrs.KO.value)/5 + Number(eigenschaft['@_value']) + Number(eigenschaft['@_mod']) + Number(eigenschaft['@_mrmod'] ?? 0));
        }
        if (key === 'AE' && Number(eigenschaft['@_mod']) !== 0) {
            return Math.round((attrs.MU.value + attrs.IN.value + attrs.CH.value)/2 + Number(eigenschaft['@_value']) + Number(eigenschaft['@_mod']) + Number(eigenschaft['@_grossemeditation'] ?? 0));
        }
        if (key === 'KE') {
            return Number(eigenschaft['@_value']) + Number(eigenschaft['@_mod']) + Number(eigenschaft['@_karmalqueste'] ?? 0);
        }

        return 0;
    };
    const getMetaAttr = (eigenschaften: IEigenschaft[], key: string): IMetaAttr => {
        const eigenschaft = eigenschaften.find(item => item['@_name'] === key);
        if (eigenschaft) {
            return {
                value: Number(eigenschaft['@_value']),
                mod: 0,
                base: eigenschaft
            }
        } else {
            return {
                value: 0,
                mod: 0,
                base: {
                    '@_name': key,
                    '@_value': '0',
                    '@_mod': '0'
                }
            }
        }
    };
    const updateMetaAttrExt = (attrExt: IAttrExt, baseAttr: IAttrBase): void => {
        Object.keys(attrExt).forEach((key) => {
            const attr = attrExt[key as keyof IAttrExt];
            attr.value = getEigenschaftValue(attr.base, baseAttr, key);
        });
    };
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
                    {error !== "" && <Alert variant="danger">{error}</Alert>}
                    <NewHeld held={held} onChange={setHeld} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShow(false)}>
                        Abbruch
                    </Button>
                    <Button disabled={held === undefined || error !== ''} variant="primary" onClick={() => {
                        if (held) {
                            held.meta = {
                                state: 'new',
                                attrBase: {
                                    MU: getMetaAttr(held.eigenschaften.eigenschaft, 'Mut'),
                                    KL: getMetaAttr(held.eigenschaften.eigenschaft, 'Klugheit'),
                                    IN: getMetaAttr(held.eigenschaften.eigenschaft, 'Intuition'),
                                    CH: getMetaAttr(held.eigenschaften.eigenschaft, 'Charisma'),
                                    FF: getMetaAttr(held.eigenschaften.eigenschaft, 'Fingerfertigkeit'),
                                    GE: getMetaAttr(held.eigenschaften.eigenschaft, 'Gewandtheit'),
                                    KO: getMetaAttr(held.eigenschaften.eigenschaft, 'Konstitution'),
                                    KK: getMetaAttr(held.eigenschaften.eigenschaft, 'Körperkraft'),
                                    SO: getMetaAttr(held.eigenschaften.eigenschaft, 'Sozialstatus')
                                },
                                attrExt: {
                                    MR: getMetaAttr(held.eigenschaften.eigenschaft, 'Magieresistenz'),
                                    LE: getMetaAttr(held.eigenschaften.eigenschaft, 'Lebensenergie'),
                                    AU: getMetaAttr(held.eigenschaften.eigenschaft, 'Ausdauer'),
                                    AE: getMetaAttr(held.eigenschaften.eigenschaft, 'Astralenergie'),
                                    KE: getMetaAttr(held.eigenschaften.eigenschaft, 'Karmaenergie'),
                                }
                            };
                            updateMetaAttrExt(held.meta.attrExt, held.meta.attrBase);
                            dispatch(heldActions.addHeld(held));
                            setHeld(undefined);
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
                        <ListGroup.Item action active={false} className="d-flex align-items-center">
                            {item['@_name']}
                            {` | `}
                            {item.basis.ausbildungen.ausbildung['@_string']}
                            <Button
                                size="sm"
                                className="ms-auto"
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(heldActions.removeHeld(item['@_key']))
                                }}
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

interface IHeldenSummaryProps {
    helden: IHeld[];
}

export const HeldenSummary: React.FC<IHeldenSummaryProps> = (props) => {
    if (props.helden.length === 0) {
        return null;
    }

    return (
        <Table striped>
            <thead>
                <tr>
                    <th>Name</th>
                    {Object.keys(props.helden[0].meta.attrBase).map((head, idx) =>
                        <th key={idx}>{head}</th>
                    )}
                    {Object.keys(props.helden[0].meta.attrExt).map((head, idx) =>
                        <th key={idx}>{head}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {props.helden.map((held, idx_held) =>
                    <tr key={idx_held}>
                        <td>{held['@_name']}</td>
                        {Object.keys(held.meta.attrBase).map((key, idx) =>
                            <td key={idx}>{held.meta.attrBase[key as keyof IAttrBase].value}</td>
                        )}
                        {Object.keys(held.meta.attrExt).map((key, idx) =>
                            <td key={idx}>{held.meta.attrExt[key as keyof IAttrExt].value}</td>
                        )}
                    </tr>
                )}
            </tbody>
        </Table>
    );
}
