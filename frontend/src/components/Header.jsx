import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
  const {
    wallet,
    loginHandler,
    registerHandler,
    connectWallet,
    isAuthenticated,
    logoutHandler,
    isAdmin,
  } = useAuth();
  const [username, setUsername] = useState("");

  const connectWalletHandler = async () => {
    const { account, signer } = await connectWallet(); // Get wallet immediately
    try {
      if (!account) {
        console.error("Wallet not connected! Please try again.");
        return;
      }
      await loginHandler(account, signer); // Pass wallet directly
      handleClose();
    } catch (error) {
      const deleteNonce = await fetch(
        `http://localhost:5000/api/users/del_nonce/${account}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(await deleteNonce.json());

      console.error("Error in connectWalletHandler:", error);
    }
  };
  const handleSubmit = async () => {
    // e.preventDefault();
    if (!wallet) {
      alert("Please connect wallet first");
      return;
    }
    await registerHandler(username);
    handleRegSection();
  };
  return (
    <Navbar>
      <Nav>
        <Nav.Item as={NavLink} to="/">
          Home
        </Nav.Item>
        {isAuthenticated && !isAdmin && (
          <>
            <Nav.Item as={NavLink} to="/election">
              Election
            </Nav.Item>
            <Nav.Item as={NavLink} to="/voting">
              Voting
            </Nav.Item>
          </>
        )}
        {isAdmin && (
          <>
            <Nav.Item as={NavLink} to="/newElection">
              New Elections
            </Nav.Item>
            <Nav.Item as={NavLink} to="/manageElection">
              Manage Elections
            </Nav.Item>
            <Nav.Item as={NavLink} to="/admin">
              Admin
            </Nav.Item>
          </>
        )}
        {/* <Nav.Menu title="About">
          <Nav.Item>Company</Nav.Item>
          <Nav.Item>Team</Nav.Item>
          <Nav.Menu title="Contact">
            <Nav.Item>Via email</Nav.Item>
            <Nav.Item>Via telephone</Nav.Item>
          </Nav.Menu>
        </Nav.Menu> */}
      </Nav>
      <Nav pullRight className="m-2 flex">
        {(isAuthenticated && wallet) && (
          <div className="pl-4 pr-6 my-auto ">
            <p>{`${wallet.toString().slice(0, 6)}......${wallet
              .toString()
              .slice(-4)}`}</p>
          </div>
        )}
        <ButtonToolbar>
          {!isAuthenticated ? (
            <Button onClick={handleOpen}> Connect Wallet</Button>
          ) : (
            <Button onClick={logoutHandler}> Disconnect Wallet</Button>
          )}
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
              <Button appearance="default" onClick={connectWalletHandler}>
                Connect Wallet
              </Button>
              <Button appearance="primary" onClick={handleRegSection}>
                New User?
              </Button>
            </div>
            {/* <Button appearance="default">Connect Wallet</Button>
            <Button appearance="primary" onClick={handleRegSection}>
            New User?
            </Button> */}
            {regSection && (
              <Form className="p-6 h-20rem" onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.ControlLabel>Username</Form.ControlLabel>
                  <Form.Control
                    name="username"
                    onChange={(value) => {
                      setUsername(value);
                    }}
                    required
                  />
                  <Form.HelpText>Username is required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="wallet">
                  {!wallet ? (
                    <Button
                      color="cyan"
                      appearance="primary"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <Button
                      color="cyan"
                      appearance="secondery"
                      onClick={connectWallet}
                    >
                      {wallet.slice(0, 6)}......{wallet.slice(-4)}
                    </Button>
                  )}
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <Button appearance="primary" type="submit">
                      Submit
                    </Button>
                    <Button appearance="default" onClick={handleRegSection}>
                      Cancel
                    </Button>
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
