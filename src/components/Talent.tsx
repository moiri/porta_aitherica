import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, Card, Form, Alert, Button, Dropdown } from 'react-bootstrap';
import { ITalent, IHeld, IAttrBase } from '../store/held';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface ITalentSearchProps {
    helden: IHeld[];
    talent: string;
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
        <Card>
            {props.talent !== '' && (
                <Card.Header>
                    <h3 className="mb-0">{props.talent}</h3>
                </Card.Header>
            )}
            <Card.Body>
                <div className="mb-3">
                    <SearchPreset
                        talent={props.talent}
                        item="Sinnenschärfe"
                        onSelect={(item) => props.onSelect(item)}
                    />
                    <SearchPreset
                        talent={props.talent}
                        item="Schleichen"
                        onSelect={(item) => props.onSelect(item)}
                    />
                    <SearchPreset
                        talent={props.talent}
                        item="Sich verstecken"
                        onSelect={(item) => props.onSelect(item)}
                    />
                    <SearchPreset
                        talent={props.talent}
                        item="Klettern"
                        onSelect={(item) => props.onSelect(item)}
                    />
                    <SearchPreset
                        talent={props.talent}
                        item="Selbstbeherrschung"
                        onSelect={(item) => props.onSelect(item)}
                    />
                    <SearchPreset
                        talent={props.talent}
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
                <Dropdown
                    show={list.length > 0}
                    focusFirstItemOnShow="keyboard"
                >
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
            </Card.Body>
        </Card>
    );
};

interface ISearchPresetProps {
    item: string;
    onSelect: (item: string) => void;
    talent: string;
}

const SearchPreset: React.FC<ISearchPresetProps> = (props) => {
    return (
        <div className="mb-1">
            <Button
                active={props.talent === props.item}
                className="w-100"
                variant="outline-dark"
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
    const [showHelden, setShowHelden] = useState<boolean[]>([
        ...props.helden.map((item) => true)
    ]);
    const [showAtLeastOne, setShowAtleastOne] = useState<boolean>(true);
    const [showAll, setShowAll] = useState<boolean>(true);
    useEffect(() => {
        setShowHelden([...props.helden.map((item) => true)]);
    }, [props.helden]);
    useEffect(() => {
        const activeCount = showHelden.reduce(
            (prev, curr) => (curr ? prev + 1 : prev),
            0
        );
        if (activeCount > 1) {
            setShowAll(true);
            setShowAtleastOne(true);
        } else {
            setShowAll(false);
            setShowAtleastOne(false);
        }
    }, [showHelden]);
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
        return Math.round((100 * possible) / 8000);
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

    const getStyle = (isVisible: boolean, color: string) => {
        if (isVisible) {
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
        .filter((item, idx) => item.talent !== undefined && showHelden[idx])
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

    if (showAll) {
        datasets.push({
            label: 'alle Helden',
            data: allSucceed.map((item) => Math.round(item * 100)),
            borderColor: 'grey',
            backgroundColor: 'grey',
            fill: false,
            pointRadius: pointRadius
        });
    }

    if (showAtLeastOne) {
        datasets.push({
            label: 'mind 1 Held',
            data: allFail.map((item) => Math.round((1 - item) * 100)),
            borderColor: 'black',
            backgroundColor: 'black',
            fill: false,
            pointRadius: pointRadius
        });
    }

    const handler = (idx: number) => {
        const newShow = [...showHelden];
        newShow[idx] = !showHelden[idx];
        setShowHelden(newShow);
    };

    return (
        <Row className={props.className}>
            <Col sm="auto">
                <TalentSearch
                    talent={talent}
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
                        <Card.Body>
                            <Line
                                className="mt-3"
                                options={{
                                    interaction: {
                                        intersect: false,
                                        mode: 'index'
                                    },
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
                            handler={() => setShowAtleastOne(!showAtLeastOne)}
                            style={getStyle(showAtLeastOne, 'black')}
                        >
                            Mindestens ein Held
                        </TalentHeldSelector>
                        {items.map((item, idx) => (
                            <TalentHeldSelector
                                key={idx}
                                handler={() => handler(idx)}
                                style={getStyle(showHelden[idx], item.color)}
                            >
                                {item.name}
                            </TalentHeldSelector>
                        ))}
                        <TalentHeldSelector
                            handler={() => setShowAll(!showAll)}
                            style={getStyle(showAll, 'grey')}
                        >
                            Alle Helden
                        </TalentHeldSelector>
                    </div>
                </Col>
            )}
        </Row>
    );
};
