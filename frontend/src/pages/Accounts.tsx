import { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAccounts } from '../services/api';

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                const data = await getAccounts();
                setAccounts(data);
            } catch (err) {
                console.error('Error fetching accounts:', err);
                setError('Failed to load accounts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

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
                <Button variant="primary">Add New Account</Button>
            </div>

            {accounts.length === 0 ? (
                <Alert variant="info">
                    You don't have any accounts yet. Click the "Add New Account" button to create one.
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
                                    <Link to={`/accounts/${account.id}`} className="btn btn-primary btn-sm w-100">
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
