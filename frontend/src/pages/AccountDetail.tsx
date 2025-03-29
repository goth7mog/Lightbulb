import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Alert, Tab, Tabs } from 'react-bootstrap';
import { getAccount, getCurrentBalance, getAccountTransactions, getSpendingTrends, toggleRoundUp, reclaimRoundUp } from '../services/api';

const AccountDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [account, setAccount] = useState<any>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [spendingTrends, setSpendingTrends] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchAccountData = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const [accountData, balanceData, transactionsData, trendsData] = await Promise.all([
                    getAccount(id),
                    getCurrentBalance(id),
                    getAccountTransactions(id),
                    getSpendingTrends(id)
                ]);

                setAccount(accountData);
                setBalance(balanceData.current_balance);
                setTransactions(transactionsData);
                setSpendingTrends(trendsData);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to load account data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountData();
    }, [id]);

    const handleToggleRoundUp = async () => {
        if (!id) return;

        try {
            const response = await toggleRoundUp(id);
            setAccount({
                ...account,
                round_up_enabled: response.round_up_enabled
            });
            setSuccessMessage(`Round Up has been ${response.round_up_enabled ? 'enabled' : 'disabled'}.`);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error toggling round up:', err);
            setError('Failed to toggle Round Up. Please try again.');

            // Clear error message after 3 seconds
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleReclaimRoundUp = async () => {
        if (!id) return;

        try {
            const response = await reclaimRoundUp(id);
            setSuccessMessage(`Round Up reclaimed successfully: £${response.reclaim_amount}`);

            // Refresh balance
            const balanceData = await getCurrentBalance(id);
            setBalance(balanceData.current_balance);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error reclaiming round up:', err);
            setError('Failed to reclaim Round Up. Please try again.');

            // Clear error message after 3 seconds
            setTimeout(() => setError(''), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading account details...</p>
            </div>
        );
    }

    if (error && !account) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!account) {
        return <Alert variant="warning">Account not found.</Alert>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{account.name}</h1>
                <Link to="/accounts" className="btn btn-outline-primary">Back to Accounts</Link>
            </div>

            {successMessage && (
                <Alert variant="success" className="mb-4">
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={6} lg={4} className="mb-3">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="bg-primary text-white">Account Summary</Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <strong>Starting Balance:</strong> £{account.starting_balance}
                            </div>
                            <div className="mb-3">
                                <strong>Current Balance:</strong> £{balance !== null ? balance : 'Loading...'}
                            </div>
                            <div className="mb-3">
                                <strong>Round Up Status:</strong>{' '}
                                <Badge bg={account.round_up_enabled ? 'success' : 'secondary'}>
                                    {account.round_up_enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            {account.postcode && (
                                <div className="mb-3">
                                    <strong>Postcode:</strong> {account.postcode}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={8} className="mb-3">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="bg-primary text-white">Account Actions</Card.Header>
                        <Card.Body>
                            <div className="d-flex flex-wrap gap-2">
                                <Button variant="primary" onClick={handleToggleRoundUp}>
                                    {account.round_up_enabled ? 'Disable' : 'Enable'} Round Up
                                </Button>

                                <Button variant="success" onClick={handleReclaimRoundUp} disabled={!account.round_up_enabled}>
                                    Reclaim Round Up Savings
                                </Button>

                                <Button variant="outline-primary">
                                    Edit Account Details
                                </Button>

                                <Button variant="outline-danger">
                                    Close Account
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="transactions" className="mb-3">
                <Tab eventKey="transactions" title="Transactions">
                    <Card className="shadow-sm">
                        <Card.Header as="h5" className="bg-light">Recent Transactions</Card.Header>
                        <Card.Body>
                            {transactions.length === 0 ? (
                                <p className="text-muted">No transactions found for this account.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>To/From</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction, index) => (
                                                <tr key={index} className="transaction-row">
                                                    <td>
                                                        <Badge bg={
                                                            transaction.transaction_type === 'deposit' ? 'success' :
                                                                transaction.transaction_type === 'payment' ? 'danger' :
                                                                    transaction.transaction_type === 'withdrawal' ? 'warning' :
                                                                        'info'
                                                        }>
                                                            {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                                                        </Badge>
                                                    </td>
                                                    <td className={
                                                        transaction.transaction_type === 'deposit' ? 'deposit' :
                                                            transaction.transaction_type === 'payment' || transaction.transaction_type === 'withdrawal' ? 'withdrawal' : ''
                                                    }>
                                                        £{transaction.amount}
                                                    </td>
                                                    <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                                                    <td>{transaction.to_account || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="spending" title="Spending Trends">
                    <Card className="shadow-sm">
                        <Card.Header as="h5" className="bg-light">Spending Trends</Card.Header>
                        <Card.Body>
                            {spendingTrends.length === 0 ? (
                                <p className="text-muted">No spending trends data available.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Total Spent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {spendingTrends.map((trend, index) => (
                                                <tr key={index} className="transaction-row">
                                                    <td>{trend.to_account__name || 'Unknown'}</td>
                                                    <td>£{trend.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </>
    );
};

export default AccountDetail;
