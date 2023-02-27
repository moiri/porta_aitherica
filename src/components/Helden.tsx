import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Table, Alert, Modal, Button, ListGroup, Dropdown } from 'react-bootstrap';
import { NewHeld } from './NewHeld';
import { ITalent, IHeld, IEigenschaft, IMetaAttr, IAttrBase, IAttrExt, heldActions } from '../store/held';
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

interface ITalentSearchProps {
    helden: IHeld[];
    onSelect: (item: string) => void;
}

export const TalentSearch: React.FC<ITalentSearchProps> = (props) => {
    const [search, setSearch] = useState("");
    const [activeIdx, setActiveIdx] = useState<number>();
    const talente = props.helden
        .map(held => held.talentliste.talent.map(talent => talent['@_name']))
        .reduce((prev, next) => prev.concat(next), []);
    const list = Array.from(new Set(talente.filter(talent => search.length > 1 && talent.toLowerCase().includes(search.toLowerCase()))));
    const selectItem = (item: string) => {
        props.onSelect(item);
        setActiveIdx(undefined);
        setSearch("");
    };
    return (
        <Fragment>
            <div className="mb-3 d-flex justify-content-between">
                <SearchPreset
                    item="Sinnenschärfe"
                    onSelect={(item) => props.onSelect(item)}
                />
                <SearchPreset
                    item="Schleichen"
                    onSelect={(item) => props.onSelect(item)}
                />
                <SearchPreset
                    item="Sich verstecken"
                    onSelect={(item) => props.onSelect(item)}
                />
                <SearchPreset
                    item="Klettern"
                    onSelect={(item) => props.onSelect(item)}
                />
                <SearchPreset
                    item="Selbstbeherrschung"
                    onSelect={(item) => props.onSelect(item)}
                />
                <SearchPreset
                    item="Körperbeherrschung"
                    onSelect={(item) => props.onSelect(item)}
                />
            </div>
            <Form.Control
                onKeyDown={(e) => {
                    if (activeIdx === undefined) {
                        setActiveIdx(0);
                    }
                    else
                    {
                        if (e.keyCode === 40) {
                            if (activeIdx < list.length - 1) {
                                setActiveIdx(activeIdx + 1);
                            }
                        } else if (e.keyCode === 38) {
                            if (activeIdx > 0) {
                                setActiveIdx(activeIdx - 1);
                            }
                        } else if (e.keyCode === 13) {
                            selectItem(list[activeIdx]);
                        } else if (e.keyCode === 27) {
                            selectItem("");
                        }
                    }
                }}
                value={search}
                type="text"
                placeholder="Talent Suche"
                onChange={(e) => setSearch(e.target.value)
            }/>
            <Dropdown
                show={list.length > 0}
                focusFirstItemOnShow="keyboard"
            >
                <Dropdown.Menu className="mt-1">
                    {list.map((item, idx) =>
                        <Dropdown.Item
                            key={idx}
                            active={idx === activeIdx}
                            eventKey={item}
                            onClick={() => selectItem(item)}
                        >{item}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </Fragment>
    );
}

interface ISearchPresetProps {
    item: string;
    onSelect: (item: string) => void;
}

const SearchPreset: React.FC<ISearchPresetProps> = (props) => {
    return (
        <Button variant="dark" onClick={() => props.onSelect(props.item)}>
            {props.item}
        </Button>
    );
}

interface ITalentProbabilitiesProps {
    helden: IHeld[];
    talent: string;
}

export const TalentProbabilities: React.FC<ITalentProbabilitiesProps> = (props) => {
    const compute_prob = (e1: number, e2: number, e3: number, pool: number) => {
        var possible = 0;
        if(pool < 0)
        {
            e1 += pool;
            e2 += pool;
            e3 += pool;
            pool = 0;
        }
        var required;
        for(var i=1; i<=20; i++) {
            for(var j=1; j<=20; j++) {
                for(var k=1; k<=20; k++) {
                    if((i == 20 && j == 20)
                        || (i == 20 && k == 20)
                        || (j == 20 && k == 20))
                        continue;
                    if((i == 1 && j == 1)
                        || (i == 1 && k == 1)
                        || (j == 1 && k == 1))
                    {
                        possible++;
                        continue;
                    }
                    required = 0;
                    if(i > e1)
                        required += (i - e1);
                    if(j > e2)
                        required += (j - e2);
                    if(k > e3)
                        required += (k - e3);
                    if(required <= pool)
                        possible++;
                }
            }
        }
        return 100*possible/8000;
    }
    const compute_prob_from_talent = (talent: ITalent, base: IAttrBase) => {
        const eigs = talent['@_probe'].match(/\((..)\/(..)\/(..)\)/);
        if (eigs && eigs[1] in base && eigs[2] in base && eigs[3] in base) {
            return compute_prob(
                base[eigs[1] as keyof IAttrBase].value,
                base[eigs[2] as keyof IAttrBase].value,
                base[eigs[3] as keyof IAttrBase].value,
                Number(talent['@_value']))
        }
        return 0;
    };
    const items = props.helden
        .map(held => ({
            talent: held.talentliste.talent.find(talent => talent['@_name'] === props.talent),
            base: held.meta.attrBase
        }))

    return (
        <Card>
            <Card.Body>
                {items.map((item, idx) =>
                    (item.talent && <div key={idx}>{compute_prob_from_talent(item.talent, item.base)}</div>)
                )}
            </Card.Body>
        </Card>
    );
}
