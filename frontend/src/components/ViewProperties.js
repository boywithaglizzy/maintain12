import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const maxProperties = 3;

export function DisplayProperties({properties}){
    
    const navigate = useNavigate();
    const addProperty = () => navigate('/addProperty');
    const viewProperty = (id) => navigate('/taskList/' + id);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    
    return(
        <Container className="container main">
            <Row xs={1} md={2} className="g-4">
                {properties.map(property => {
                    return(
                        <Col key={property.id}>
                            <Card className="m-5 text-center blue-border">
                                <Card.Body className="align-items-center">
                                    <Card.Title className="blue-header">{property.address}</Card.Title>
                                    <Card.Text className="blue-secondary-header">
                                        {property.city}
                                    </Card.Text>
                                    <Card.Text className="blue-secondary-header">
                                        {property.province}
                                    </Card.Text>
                                    <Button type="submit" className="mx-2 green-button" onClick={() => viewProperty(property.id)}>
                                        View Property
                                    </Button>
                                    <Button type="submit" className="mx-2 green-button" onClick={handleOpen} >
                                        Delete Property
                                    </Button>
                                </Card.Body>
                            </Card>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title className="blue-text">Delete Property</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="blue-text">Are you sure you want to delete this property?</Modal.Body>
                                <Modal.Footer>
                                <Button className="blue-button"  onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button className="green-button" onClick={handleClose}>
                                    Delete Property
                                </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    )
                })}
                <Col>
                    <Card className="m-5 text-center green-border">
                        <Card.Body className="align-items-center">
                            <Card.Title className="blue-header">{(maxProperties - properties.length) + " Properties Remaining"}</Card.Title>
                            <Button type="submit" className="mx-2 green-button" onClick={addProperty} >
                                Add a Property
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}