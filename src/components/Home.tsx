import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const Home: React.FC = () => {
    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <h1 className="mb-0 display-1">Helden Dash</h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 g-3">
                <Col>
                    <LinkContainer to="/helden">
                        <Card className="h-100">
                            <Card.Body>
                                Helden
                            </Card.Body>
                        </Card>
                    </LinkContainer>
                </Col>
                <Col>
                    <Card className="h-100">
                        <Card.Body>
                            Talente
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
