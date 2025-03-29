import React, { useState } from "react";
import { Navbar, Nav } from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import { Modal, Button, ButtonToolbar, Placeholder, Form, Input } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const [regSection, setRegSection] = useState(false);
  const [modelSize, setModelSize] = useState(40);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRegSection = () => {
    setModelSize();
    setRegSection(!regSection);
  };
  const { wallet, loginHandller, registerHandller, connectWallet, isAuthenticated} = useAuth();
  const connectWalletHandler = () => {
    console.log("called")
    connectWallet();
  }
  return (
    <Navbar>
      <Navbar.Brand href="#">RSUITE</Navbar.Brand>
      <Nav>
        <Nav.Item>Home</Nav.Item>
        <Nav.Item>News</Nav.Item>
        <Nav.Item>Products</Nav.Item>
        <Nav.Menu title="About">
          <Nav.Item>Company</Nav.Item>
          <Nav.Item>Team</Nav.Item>
          <Nav.Menu title="Contact">
            <Nav.Item>Via email</Nav.Item>
            <Nav.Item>Via telephone</Nav.Item>
          </Nav.Menu>
        </Nav.Menu>
      </Nav>
      <Nav pullRight className="m-2">
        <ButtonToolbar>
          <Button onClick={handleOpen}> Connect Wallet</Button>
        </ButtonToolbar>
        <Modal
          open={open}
          overflow={true}
          onClose={handleClose}
          className="h-[30rem]"
        >
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <div className="flex pl-20 pr-20 justify-around">
              <Button appearance="default" onClick={connectWalletHandler}>Connect Wallet</Button>
              <Button appearance="primary" onClick={handleRegSection}>
                New User?
              </Button>
            </div>
            {/* <Button appearance="default">Connect Wallet</Button>
            <Button appearance="primary" onClick={handleRegSection}>
            New User?
            </Button> */}
            {regSection && (
              <Form className="p-6 h-20rem">
                <Form.Group controlId="name">
                  <Form.ControlLabel>Username</Form.ControlLabel>
                  <Form.Control name="name" />
                  <Form.HelpText>Username is required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="wallet">
                  <Button
                    color="cyan"
                    appearance="primary"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </Button>
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <Button appearance="primary">Submit</Button>
                    <Button appearance="default">Cancel</Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            )}
            <Placeholder.Paragraph />
          </Modal.Body>
          {/* <Modal.Footer>
            <Button onClick={handleClose} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer> */}
        </Modal>
      </Nav>
    </Navbar>
  );
};

export default Header;
