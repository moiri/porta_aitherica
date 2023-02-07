import React, { Fragment } from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';

interface IHeldProps {
    held: any;
    className?: string;
}

export const Held: React.FC<IHeldProps> = props => {
    console.log(props.held);
    return (
        <Fragment>
            <Card className={props.className}>
                <Card.Body>
                    <h3 className="mb-0">
                        {props.held['@_name']}
                        <small className="text-muted ms-3">
                            {props.held.basis.ausbildungen.ausbildung['@_string']}
                        </small>
                    </h3>
                </Card.Body>
            </Card>
            <Row className="mt-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Mod</th>
                                        <th>Start</th>
                                        <th>Wert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.held.eigenschaften.eigenschaft
                                        .filter((item: any) => '@_startwert' in item)
                                        .map((item: any, idx: number) =>
                                        <tr key={idx}>
                                            <td>{item['@_name']}</td>
                                            <td>{item['@_mod']}</td>
                                            <td>{item['@_startwert']}</td>
                                            <td>{item['@_value']}</td>
                                        </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Mod</th>
                                        <th>Wert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.held.eigenschaften.eigenschaft
                                        .filter((item: any) => !('@_startwert' in item))
                                        .map((item: any, idx: number) =>
                                        <tr key={idx}>
                                            <td>{item['@_name']}</td>
                                            <td>{item['@_mod']}</td>
                                            <td>{item['@_value']}</td>
                                        </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}
