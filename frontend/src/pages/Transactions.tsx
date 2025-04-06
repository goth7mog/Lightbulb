import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Alert,
} from "react-bootstrap";
import {
  getTransactions,
  getAccounts,
  createTransaction,
} from "../services/api";
import CreateModalButton from "../components/CreateModalButton";

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const [newTransaction, setNewTransaction] = useState({
    transaction_type: "payment",
    amount: "",
    from_account: "",
    to_account: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [transactionsData, accountsData] = await Promise.all([
          getTransactions(),
          getAccounts(),
        ]);
        setTransactions(transactionsData);
        setAccounts(accountsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTransaction = async () => {
    if (
      !newTransaction.transaction_type ||
      !newTransaction.amount ||
      !newTransaction.from_account
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await createTransaction(newTransaction);
      setTransactions([...transactions, response]);

      setNewTransaction({
        transaction_type: "payment",
        amount: "",
        from_account: "",
        to_account: "",
      });
      setFormError("");
    } catch (err) {
      console.error("Error creating transaction:", err);
      setFormError("Failed to create transaction. Please try again.");
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transaction_type
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Transactions</h1>
        <CreateModalButton
          buttonText="New Transaction"
          modalTitle="New Transaction"
          onSubmit={handleCreateTransaction}
          onClose={() => {
            setNewTransaction({
              transaction_type: "payment",
              amount: "",
              from_account: "",
              to_account: "",
            });
            setFormError("");
          }}
          showError={formError}
        >
          <Form.Group className="mb-3">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Select
              name="transaction_type"
              value={newTransaction.transaction_type}
              onChange={handleInputChange}
            >
              <option value="payment">Payment</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount (£)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={newTransaction.amount}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>From Account</Form.Label>
            <Form.Select
              name="from_account"
              value={newTransaction.from_account}
              onChange={handleInputChange}
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>To Account (for transfers)</Form.Label>
            <Form.Select
              name="to_account"
              value={newTransaction.to_account}
              onChange={handleInputChange}
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </CreateModalButton>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="mb-3">
            <Form.Control
              type="text"
              placeholder="Filter by transaction type..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <Alert variant="info">
              No transactions found. Create a new transaction to get started.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={index} className="transaction-row">
                      <td>{transaction.transaction_type}</td>
                      <td
                        className={
                          transaction.transaction_type === "deposit"
                            ? "deposit"
                            : ["payment", "withdrawal"].includes(
                                transaction.transaction_type
                              )
                            ? "withdrawal"
                            : ""
                        }
                      >
                        £{transaction.amount}
                      </td>
                      <td>{transaction.from_account}</td>
                      <td>{transaction.to_account || "N/A"}</td>
                      <td>
                        {new Date(
                          transaction.timestamp
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Transactions;
