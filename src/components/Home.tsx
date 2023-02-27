import React, { useState } from 'react';
import { Alert, Button, Container, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { TRootStore } from '../store/store';
import { heldActions } from '../store/held';
import { HeldenSummary, TalentSearch, TalentProbabilities } from './Helden';

export const Home: React.FC = () => {
    const dispatch = useDispatch();
    const helden = useSelector((store: TRootStore) => store.helden);
    const heldenActive = helden.filter(item => item.meta.state === 'active');
    const heldenInactive = helden.filter(item => item.meta.state !== 'active');
    const [selection, setSelection] = useState("");
    return (
        <Container fluid>
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <h1 className="mb-0 display-3">Helden Dash</h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            {helden.length === 0 && (
                                <Alert variant="warning" className="mb-0 d-flex align-items-center">
                                    Es wurden noch keine Helden gespeichert.
                                    <LinkContainer to="/helden">
                                        <Button variant="warning" className="ms-auto">
                                            Zu den Helden
                                        </Button>
                                    </LinkContainer>
                                </Alert>
                            )}
                            {helden.length > 0 && heldenActive.length === 0 && (
                                <Alert variant="dark" className="mb-0 d-flex align-items-center">
                                    Es wurden noch keine Helden aktiviert. Zum aktivieren, klicke auf einen Helden in der Liste <strong className="ms-1">Inaktive Helden</strong>.
                                </Alert>
                            )}
                            {heldenActive.length > 0 && (
                                <HeldenSummary helden={heldenActive} />
                            )}
                        </Card.Body>
                    </Card>
                    {heldenActive.length > 0 && (
                        <Card className="mt-3">
                            <Card.Body>
                                <TalentSearch
                                    helden={heldenActive}
                                    onSelect={(item) => setSelection(item)}
                                />
                                {selection !== "" && (<h1>{selection}</h1>)}
                                <TalentProbabilities helden={heldenActive} talent={selection} />
                            </Card.Body>
                        </Card>
                    )}
                </Col>
                {helden.length > 0 && (
                    <Col sm="auto">
                        {heldenActive.length > 0 && (
                            <Card bg="success" text="white" className="mb-3">
                                <Card.Header>
                                    Aktive Helden
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {heldenActive.map((item, idx) =>
                                        <ListGroup.Item key={idx} action onClick={() => {
                                            dispatch(heldActions.setHeldState(item['@_key'], 'inactive'));
                                        }}>
                                            {item['@_name']}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        )}
                        {heldenInactive.length > 0 && (
                            <Card>
                                <Card.Header>
                                    Inaktive Helden
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {heldenInactive.map((item, idx) =>
                                        <ListGroup.Item key={idx} active={item.meta.state === 'active'} action onClick={() => {
                                            dispatch(heldActions.setHeldState(item['@_key'], 'active'));
                                        }}>
                                            {item['@_name']}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        )}
                    </Col>
                )}
            </Row>
        </Container>
    );
}
