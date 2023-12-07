import React, { useState, Fragment } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

export const ApplianceField = ({ appliance, i, fetchAppliances }) => {
  const warrantyCheck = (purchaseDate, warrantyLength) => {
    if (purchaseDate === "") {
      return "--";
    }

    const today = new Date();
    const pDate = new Date(purchaseDate);

    const warrantyExpireDate = new Date(pDate);
    warrantyExpireDate.setFullYear(
      warrantyExpireDate.getFullYear() + warrantyLength
    );

    if (today < warrantyExpireDate) {
      return "No";
    } else {
      return "Yes";
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const handleDeleteAppliance = async (propertyApplianceID) => {
    const response = await axios.delete(`/api/deleteAppliance`, {
      data: {
        propertyApplianceID,
      },
    });
    fetchAppliances();
    handleClose();
  };

  return (
    <>
      <Row className="my-3 table-input" key={i}>
        <Col lg={1}>{appliance.applianceType}</Col>
        <Col lg={2}>{appliance.manufacturer}</Col>
        <Col lg={2}>{appliance.model}</Col>
        <Col lg={2}>{appliance.serialNumber}</Col>
        <Col lg={2}>{appliance.purchaseDate.substring(0, 10)}</Col>
        <Col lg={1}>{appliance.warrantyLength}</Col>
        <Col lg={1}>
          {warrantyCheck(appliance.purchaseDate, appliance.warrantyLength)}
        </Col>
        <Col lg={1}>
          <Button className="blue-button" onClick={handleOpen}>
            -
          </Button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} key={"modal" + i}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">Delete Appliance</Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">
          Are you sure you want to delete this appliance?
        </Modal.Body>
        <Modal.Footer>
          <Button className="blue-button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="green-button"
            onClick={() => handleDeleteAppliance(appliance.propertyApplianceID)}
          >
            Delete Appliance
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
