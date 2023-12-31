import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BackgroundImage } from "../components/BackgroundImage";

export function HomePage() {
  return (
    <Container className="main text-center">
      <BackgroundImage />
      <Row className="justify-content-md-center">
        <Col>
          <p className="m-2 blue-secondary-header">
            For homeowners, landlords, tenants or property managers
          </p>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <p className="mx-5 px-5 blue-secondary-header">
            Maintain keeps you up-to-date on all of the maintenance tasks a
            property needs. We store the important data about your property's
            features, including the appliances stored within, to generate a
            schedule that will make maintenance easy. We let you know what you
            need to do and when to do it. Maintain will help maximize the value
            and longevity of some of the most substantial investments most of us
            will make. Share properties with others to maintain your property
            with Maintain.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <p className="mx-5 px-5 blue-secondary-header">
            <a href="/loginPage" className="green-text">
              Login
            </a>{" "}
            or{" "}
            <a href="/signUpPage" className="green-text">
              register
            </a>{" "}
            to get started.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
