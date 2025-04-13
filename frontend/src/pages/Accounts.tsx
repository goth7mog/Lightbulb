import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Alert, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccounts, createAccount } from "../services/api";
import CreateModalButton from "../components/CreateModalButton";

const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [newAccount, setNewAccount] = useState({
    name: "",
    starting_balance: "",
    postcode: "",
    round_up_enabled: false,
  });
  const [accountFormError, setAccountFormError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load accounts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateAccount = async () => {
    if (!newAccount.name || !newAccount.starting_balance) {
      setAccountFormError("Please fill in all required fields.");
      return;
    }

    try {
      const created = await createAccount(newAccount);
      setAccounts([...accounts, created]);

      setNewAccount({
        name: "",
        starting_balance: "",
        postcode: "",
        round_up_enabled: false,
      });
      setAccountFormError("");
    } catch (err) {
      console.error("Error creating account:", err);
      setAccountFormError("Failed to create account. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Your Accounts</h1>
        <CreateModalButton
          buttonText="Add New Account"
          modalTitle="Create Account"
          onSubmit={handleCreateAccount}
          onClose={() => {
            setNewAccount({
              name: "",
              starting_balance: "",
              postcode: "",
              round_up_enabled: false,
            });
            setAccountFormError("");
          }}
          showError={accountFormError}
        >
          <Form.Group className="mb-3">
            <Form.Label>Account Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newAccount.name}
              onChange={handleAccountInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Starting Balance (£)</Form.Label>
            <Form.Control
              type="number"
              name="starting_balance"
              value={newAccount.starting_balance}
              onChange={handleAccountInputChange}
              min="0"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Postcode (optional)</Form.Label>
            <Form.Control
              type="text"
              name="postcode"
              value={newAccount.postcode}
              onChange={handleAccountInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Enable Round Up"
              name="round_up_enabled"
              checked={newAccount.round_up_enabled}
              onChange={handleAccountInputChange}
            />
          </Form.Group>
        </CreateModalButton>
      </div>

      {accounts.length === 0 ? (
        <Alert variant="info">
          You don't have any accounts yet. Click the "Add New Account" button to
          create one.
        </Alert>
      ) : (
        <Row>
          {accounts.map((account) => (
            <Col key={account.id} md={6} lg={4} className="mb-4">
              <Card className="account-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between">
                    <span>{account.name}</span>
                    {account.round_up_enabled && (
                      <span className="badge bg-success">Round Up</span>
                    )}
                  </Card.Title>
                  <Card.Text>
                    <strong>Balance:</strong> £{account.starting_balance}
                  </Card.Text>
                  {account.postcode && (
                    <Card.Text>
                      <strong>Postcode:</strong> {account.postcode}
                    </Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <Link
                    to={`/accounts/${account.id}`}
                    className="btn btn-primary btn-sm w-100"
                  >
                    View Details
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Accounts;
