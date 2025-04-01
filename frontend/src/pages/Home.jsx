import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Nav, Navbar } from "rsuite";
import useAuth from "../hooks/useAuth";
import { Button, ButtonToolbar, Placeholder, Form, Input } from "rsuite";

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Secure Blockchain Voting
          </h1>
          <div className="text-xl max-w-3xl mx-auto mb-8">
            <p>
              Experience transparent, tamper-proof elections with our
              cutting-edge blockchain technology. Every vote is securely
              recorded on the blockchain, ensuring complete integrity.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Navbar appearance="subtle" className="bg-transparent">
              <Nav className="flex gap-4 items-center">
                {isAuthenticated ? (
                  <Button
                    as={NavLink}
                    className="px-8 py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors no-underline"
                    style={{ padding: "12px 32px" }}
                    to="/vote"
                    appearance="default"
                  >
                    Cast Your Vote
                  </Button>
                ) : (
                  // <Nav.Item

                  //   className="px-8 py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors no-underline"
                  //   style={{ padding: "12px 32px" }}
                  // >
                  //   Cast Your Vote
                  // </Nav.Item>
                  <Button
                    as={NavLink}
                    className="px-8 py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors no-underline"
                    style={{ padding: "12px 32px" }}
                    to="/"
                    appearance="default"
                  >
                    Connect Wallet to Vote
                  </Button>
                  // <Nav.Item
                  //   as={NavLink}
                  //   to="/"
                  //   className="px-8 py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors no-underline"
                  //   style={{ padding: "12px 32px" }}
                  // >
                  //   Connect Wallet to Vote
                  // </Nav.Item>
                )}
                <Button
                  as={NavLink}
                  to="/results"
                  className="px-8 py-3 rounded-md font-medium border-2 border-white text-white bg-white/10 hover:bg-white hover:text-indigo-700 transition-colors no-underline"
                  style={{ padding: "12px 32px" }}
                  appearance="default"
                >
                  View Results
                </Button>
                {/* <Nav.Item
                  as={NavLink}
                  to="/results"
                  className="px-8 py-3 rounded-md font-medium border-2 border-white text-white bg-white/10 hover:bg-white hover:text-indigo-700 transition-colors no-underline"
                  style={{ padding: "12px 32px" }}
                >
                  View Results
                </Nav.Item> */}
              </Nav>
            </Navbar>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Blockchain Voting?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Unmatched Security</h3>
              <p className="text-gray-600">
                Votes are cryptographically secured on the blockchain, making
                them immutable and tamper-proof.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Complete Transparency
              </h3>
              <p className="text-gray-600">
                Anyone can verify the election results on the blockchain,
                ensuring a fair and transparent process.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Results</h3>
              <p className="text-gray-600">
                See election results in real-time as votes are recorded on the
                blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience Secure Voting?
          </h2>
          <div className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <p>
              Connect your wallet and participate in a new era of secure,
              transparent elections.
            </p>
          </div>
          <Button
            as={NavLink}
            to={isAuthenticated ? "/vote" : "/"}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium shadow-lg hover:bg-indigo-700 transition-colors"
            style={{ padding: "12px 32px" }}
            appearance="default"
          >
            {isAuthenticated ? "Vote Now" : "Get Started"}
          </Button>

          {/* <Link href={isAuthenticated ? "/vote" : "/"}>
            <a className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium shadow-lg hover:bg-indigo-700 transition-colors">
              {isAuthenticated ? "Vote Now" : "Get Started"}
            </a>
          </Link> */}
        </div>
      </section>
    </div>
  );
};

export default Home;
