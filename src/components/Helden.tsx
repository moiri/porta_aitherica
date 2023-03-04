import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    Card,
    Form,
    Table,
    Alert,
    Modal,
    Button,
    ListGroup,
    Dropdown
} from 'react-bootstrap';
import { NewHeld } from './NewHeld';
import {
    ITalent,
    IHeld,
    IEigenschaft,
    IMetaAttr,
    IAttrBase,
    IAttrExt,
    heldActions
} from '../store/held';
import { TRootStore } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import {
    Plugin,
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export const Helden: React.FC = () => {
    const dispatch = useDispatch();
    const helden = useSelector((store: TRootStore) => store.helden);
    const [held, setHeld] = useState<IHeld>();
    const [show, setShow] = useState(false);
    let error = '';
    if (held && helden.find((item) => item['@_key'] === held['@_key'])) {
        error = 'Doppelter Eintrag, dieser Held existiert bereits';
    }
    const getEigenschaftValue = (
        eigenschaft: IEigenschaft,
        attrs: IAttrBase,
        key: string
    ) => {
        if ('@_startwert' in eigenschaft) {
            return Number(eigenschaft['@_value']);
        }
        if (key === 'LE') {
            return Math.round(
                (attrs.KO.value + attrs.KO.value + attrs.KK.value) / 2 +
                    Number(eigenschaft['@_value']) +
                    Number(eigenschaft['@_mod'])
            );
        }
        if (key === 'AU') {
            return Math.round(
                (attrs.MU.value + attrs.GE.value + attrs.KO.value) / 2 +
                    Number(eigenschaft['@_value']) +
                    Number(eigenschaft['@_mod'])
            );
        }
        if (key === 'MR') {
            return Math.round(
                (attrs.MU.value + attrs.KL.value + attrs.KO.value) / 5 +
                    Number(eigenschaft['@_value']) +
                    Number(eigenschaft['@_mod']) +
                    Number(eigenschaft['@_mrmod'] ?? 0)
            );
        }
        if (key === 'AE' && Number(eigenschaft['@_mod']) !== 0) {
            return Math.round(
                (attrs.MU.value + attrs.IN.value + attrs.CH.value) / 2 +
                    Number(eigenschaft['@_value']) +
                    Number(eigenschaft['@_mod']) +
                    Number(eigenschaft['@_grossemeditation'] ?? 0)
            );
        }
        if (key === 'KE') {
            return (
                Number(eigenschaft['@_value']) +
                Number(eigenschaft['@_mod']) +
                Number(eigenschaft['@_karmalqueste'] ?? 0)
            );
        }

        return 0;
    };
    const getMetaAttr = (
        eigenschaften: IEigenschaft[],
        key: string
    ): IMetaAttr => {
        const eigenschaft = eigenschaften.find(
            (item) => item['@_name'] === key
        );
        if (eigenschaft) {
            return {
                value: Number(eigenschaft['@_value']),
                mod: 0,
                base: eigenschaft
            };
        } else {
            return {
                value: 0,
                mod: 0,
                base: {
                    '@_name': key,
                    '@_value': '0',
                    '@_mod': '0'
                }
            };
        }
    };
    const updateMetaAttrExt = (
        attrExt: IAttrExt,
        baseAttr: IAttrBase
    ): void => {
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
            <Modal
                backdrop="static"
                size="xl"
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header>
                    <Modal.Title>Neuen Held Hochladen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error !== '' && <Alert variant="danger">{error}</Alert>}
                    <NewHeld held={held} onChange={setHeld} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShow(false)}>
                        Abbruch
                    </Button>
                    <Button
                        disabled={held === undefined || error !== ''}
                        variant="primary"
                        onClick={() => {
                            if (held) {
                                held.meta = {
                                    state: 'new',
                                    attrBase: {
                                        MU: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Mut'
                                        ),
                                        KL: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Klugheit'
                                        ),
                                        IN: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Intuition'
                                        ),
                                        CH: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Charisma'
                                        ),
                                        FF: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Fingerfertigkeit'
                                        ),
                                        GE: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Gewandtheit'
                                        ),
                                        KO: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Konstitution'
                                        ),
                                        KK: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Körperkraft'
                                        ),
                                        SO: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Sozialstatus'
                                        )
                                    },
                                    attrExt: {
                                        MR: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Magieresistenz'
                                        ),
                                        LE: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Lebensenergie'
                                        ),
                                        AU: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Ausdauer'
                                        ),
                                        AE: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Astralenergie'
                                        ),
                                        KE: getMetaAttr(
                                            held.eigenschaften.eigenschaft,
                                            'Karmaenergie'
                                        )
                                    }
                                };
                                updateMetaAttrExt(
                                    held.meta.attrExt,
                                    held.meta.attrBase
                                );
                                dispatch(heldActions.addHeld(held));
                                setHeld(undefined);
                            }
                            setShow(false);
                        }}
                    >
                        Speichern
                    </Button>
                </Modal.Footer>
            </Modal>
            <ListGroup className="mt-3">
                {helden.map((item, idx) => (
                    <LinkContainer key={idx} to={`/helden/${idx}`}>
                        <ListGroup.Item
                            action
                            active={false}
                            className="d-flex align-items-center"
                        >
                            {item['@_name']}
                            {` | `}
                            {item.basis.ausbildungen.ausbildung['@_string']}
                            <Button
                                size="sm"
                                className="ms-auto"
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(
                                        heldActions.removeHeld(item['@_key'])
                                    );
                                }}
                            >
                                <FontAwesomeIcon
                                    title="Den Helden löschen"
                                    icon="trash"
                                />
                            </Button>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
            </ListGroup>
        </Fragment>
    );
};

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
                    {Object.keys(props.helden[0].meta.attrBase).map(
                        (head, idx) => (
                            <th key={idx}>{head}</th>
                        )
                    )}
                    {Object.keys(props.helden[0].meta.attrExt).map(
                        (head, idx) => (
                            <th key={idx}>{head}</th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {props.helden.map((held, idx_held) => (
                    <tr key={idx_held}>
                        <td>{held['@_name']}</td>
                        {Object.keys(held.meta.attrBase).map((key, idx) => (
                            <td key={idx}>
                                {
                                    held.meta.attrBase[key as keyof IAttrBase]
                                        .value
                                }
                            </td>
                        ))}
                        {Object.keys(held.meta.attrExt).map((key, idx) => (
                            <td key={idx}>
                                {held.meta.attrExt[key as keyof IAttrExt].value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

interface ITalentSearchProps {
    helden: IHeld[];
    onSelect: (item: string) => void;
}

export const TalentSearch: React.FC<ITalentSearchProps> = (props) => {
    const [search, setSearch] = useState('');
    const [activeIdx, setActiveIdx] = useState<number>();
    const talente = props.helden
        .map((held) =>
            held.talentliste.talent.map((talent) => talent['@_name'])
        )
        .reduce((prev, next) => prev.concat(next), []);
    const list = Array.from(
        new Set(
            talente.filter(
                (talent) =>
                    search.length > 1 &&
                    talent.toLowerCase().includes(search.toLowerCase())
            )
        )
    );
    const selectItem = (item: string) => {
        props.onSelect(item);
        setActiveIdx(undefined);
        setSearch('');
    };
    return (
        <Fragment>
            <div className="mb-3">
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
                    } else {
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
                            selectItem('');
                        }
                    }
                }}
                value={search}
                type="text"
                placeholder="Talent Suche"
                onChange={(e) => setSearch(e.target.value)}
            />
            <Dropdown show={list.length > 0} focusFirstItemOnShow="keyboard">
                <Dropdown.Menu className="mt-1">
                    {list.map((item, idx) => (
                        <Dropdown.Item
                            key={idx}
                            active={idx === activeIdx}
                            eventKey={item}
                            onClick={() => selectItem(item)}
                        >
                            {item}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Fragment>
    );
};

interface ISearchPresetProps {
    item: string;
    onSelect: (item: string) => void;
}

const SearchPreset: React.FC<ISearchPresetProps> = (props) => {
    return (
        <div className="mb-1">
            <Button
                className="w-100"
                variant="dark"
                onClick={() => props.onSelect(props.item)}
            >
                {props.item}
            </Button>
        </div>
    );
};

interface ITalentHeldSelectorProps {
    handler: () => void;
    style: any;
    children: React.ReactNode;
}

const TalentHeldSelector: React.FC<ITalentHeldSelectorProps> = (props) => {
    return (
        <Button
            size="sm"
            className="me-1"
            style={props.style}
            onClick={() => props.handler()}
        >
            {props.children}
        </Button>
    );
};

interface ITalentProbabilitiesProps {
    helden: IHeld[];
    className?: string;
}

export const TalentProbabilities: React.FC<ITalentProbabilitiesProps> = (
    props
) => {
    const [show, setShow] = useState<boolean[]>([
        ...props.helden.map((item) => true),
        true,
        true
    ]);
    useEffect(() => {
        setShow([...props.helden.map((item) => true), true, true]);
    }, [props.helden]);
    const [talent, setTalent] = useState('');
    const compute_prob = (e1: number, e2: number, e3: number, pool: number) => {
        var possible = 0;
        if (pool < 0) {
            e1 += pool;
            e2 += pool;
            e3 += pool;
            pool = 0;
        }
        var required;
        for (let i = 1; i <= 20; i++) {
            for (let j = 1; j <= 20; j++) {
                for (let k = 1; k <= 20; k++) {
                    if (
                        (i === 20 && j === 20) ||
                        (i === 20 && k === 20) ||
                        (j === 20 && k === 20)
                    )
                        continue;
                    if (
                        (i === 1 && j === 1) ||
                        (i === 1 && k === 1) ||
                        (j === 1 && k === 1)
                    ) {
                        possible++;
                        continue;
                    }
                    required = 0;
                    if (i > e1) required += i - e1;
                    if (j > e2) required += j - e2;
                    if (k > e3) required += k - e3;
                    if (required <= pool) possible++;
                }
            }
        }
        return (100 * possible) / 8000;
    };

    const compute_prob_arr = (
        value: number,
        e1: number,
        e2: number,
        e3: number,
        mod: number,
        tap: number,
        max: number
    ) => {
        var prob = [];
        if (tap === 1) {
            tap = 0;
        }
        for (let i = -max; i <= max; i++) {
            const mod_var = mod + i;
            const taw = value - mod_var;
            const taw_open = mod_var > 0 ? value - mod_var : value;
            if (tap > 0 && taw_open < tap) prob.push(0);
            else prob.push(compute_prob(e1, e2, e3, taw - tap));
        }
        return prob;
    };
    const compute_prob_from_talent = (
        talent: ITalent,
        base: IAttrBase,
        max: number
    ) => {
        const eigs = talent['@_probe'].match(/\((..)\/(..)\/(..)\)/);
        if (eigs && eigs[1] in base && eigs[2] in base && eigs[3] in base) {
            return compute_prob_arr(
                Number(talent['@_value']),
                base[eigs[1] as keyof IAttrBase].value,
                base[eigs[2] as keyof IAttrBase].value,
                base[eigs[3] as keyof IAttrBase].value,
                0,
                0,
                max
            );
        }
        return 0;
    };

    const colors = [
        '#fd7f6f',
        '#7eb0d5',
        '#b2e061',
        '#bd7ebe',
        '#ffb55a',
        '#ffee65',
        '#beb9db',
        '#fdcce5',
        '#8bd3c7'
    ];

    const items = props.helden.map((held, idx) => ({
        talent: held.talentliste.talent.find(
            (item) => item['@_name'] === talent
        ),
        base: held.meta.attrBase,
        name: held['@_name'],
        color: colors[idx % colors.length]
    }));

    const max = 10;

    // const colors = [ '#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600' ];

    const getStyle = (idx: number, color: string) => {
        if (show[idx]) {
            return {
                backgroundColor: color,
                borderColor: color
            };
        } else {
            return {
                backgroundColor: 'transparent',
                borderColor: color,
                color: color
            };
        }
    };

    const pointRadius = [...Array(2 * max + 1)].map(
        (item, idx) => ((max - Math.abs(idx - max)) / max) * 5 + 2
    );

    const datasets = items
        .filter((item, idx) => item.talent !== undefined && show[idx])
        .map((item, idx) => ({
            label: item.name,
            data: compute_prob_from_talent(
                item.talent as ITalent,
                item.base,
                max
            ) as number[],
            borderColor: item.color,
            backgroundColor: item.color,
            fill: false,
            pointRadius: pointRadius
        }));

    const allFail = datasets.reduce(
        (prev, val) =>
            prev.map((item, idx) => item * (1 - val.data[idx] / 100)),
        Array<number>(2 * max + 1).fill(1)
    );
    const allSucceed = datasets.reduce(
        (prev, val) => prev.map((item, idx) => (item * val.data[idx]) / 100),
        Array<number>(2 * max + 1).fill(1)
    );

    if (show[items.length]) {
        datasets.push({
            label: 'alle Helden',
            data: allSucceed.map((item) => item * 100),
            borderColor: 'black',
            backgroundColor: 'black',
            fill: false,
            pointRadius: pointRadius
        });
    }

    if (show[items.length + 1]) {
        datasets.push({
            label: 'mind 1 Held',
            data: allFail.map((item) => (1 - item) * 100),
            borderColor: 'black',
            backgroundColor: 'black',
            fill: false,
            pointRadius: pointRadius
        });
    }

    const handler = (idx: number) => {
        const newShow = [...show];
        newShow[idx] = !show[idx];
        setShow(newShow);
    };

    return (
        <Row className={props.className}>
            <Col sm="auto">
                <TalentSearch
                    helden={props.helden}
                    onSelect={(item) => setTalent(item)}
                />
            </Col>
            {talent === '' && (
                <Col>
                    <Alert className="mb-0" variant="dark">
                        Wähle ein Talent
                    </Alert>
                </Col>
            )}
            {talent !== '' && (
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="mb-0">{talent}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Line
                                className="mt-3"
                                options={{
                                    scales: {
                                        y: {
                                            min: 0,
                                            max: 100
                                        }
                                    }
                                }}
                                data={{
                                    labels: [...Array(2 * max + 1)].map(
                                        (item, idx) =>
                                            `${idx > max ? '+' : ''}${
                                                -max + idx
                                            }`
                                    ),
                                    datasets: datasets
                                }}
                            />
                        </Card.Body>
                    </Card>
                    <div className="mt-1">
                        <TalentHeldSelector
                            handler={() => handler(items.length + 1)}
                            style={getStyle(items.length + 1, 'black')}
                        >
                            Mindestens ein Held
                        </TalentHeldSelector>
                        {items.map((item, idx) => (
                            <TalentHeldSelector
                                key={idx}
                                handler={() => handler(idx)}
                                style={getStyle(idx, item.color)}
                            >
                                {item.name}
                            </TalentHeldSelector>
                        ))}
                        <TalentHeldSelector
                            handler={() => handler(items.length)}
                            style={getStyle(items.length, 'black')}
                        >
                            Alle Helden
                        </TalentHeldSelector>
                    </div>
                </Col>
            )}
        </Row>
    );
};
