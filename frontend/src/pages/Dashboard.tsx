import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAccounts, getTop10Spenders } from '../services/api';

const Dashboard = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [topSpenders, setTopSpenders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [accountsData, topSpendersData] = await Promise.all([
                    getAccounts(),
                    getTop10Spenders()
                ]);

                setAccounts(accountsData);
                setTopSpenders(topSpendersData);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <>
            <h1 className="mb-4">Dashboard</h1>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Your Accounts</Card.Header>
                        <Card.Body>
                            {accounts.length === 0 ? (
                                <p className="text-muted">No accounts found.</p>
                            ) : (
                                <Row>
                                    {accounts.slice(0, 3).map((account) => (
                                        <Col key={account.id} md={4} className="mb-3">
                                            <Card className="account-card h-100">
                                                <Card.Body>
                                                    <Card.Title>{account.name}</Card.Title>
                                                    <Card.Text>
                                                        Balance: £{account.starting_balance}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        Round Up: {account.round_up_enabled ? 'Enabled' : 'Disabled'}
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <Link to={`/accounts/${account.id}`} className="btn btn-sm btn-primary">
                                                        View Details
                                                    </Link>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            <div className="mt-3">
                                <Link to="/accounts" className="btn btn-outline-primary">
                                    View All Accounts
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Top Spenders</Card.Header>
                        <Card.Body>
                            {topSpenders.length === 0 ? (
                                <p className="text-muted">No spending data available.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Account</th>
                                                <th>Total Spent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topSpenders.slice(0, 5).map((spender, index) => (
                                                <tr key={index} className="transaction-row">
                                                    <td>{spender.to_account__name || 'Unknown'}</td>
                                                    <td>£{spender.total_spent}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Quick Actions</Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                <Link to="/transactions" className="btn btn-primary">
                                    View Transactions
                                </Link>
                                <Link to="/accounts" className="btn btn-outline-primary">
                                    Manage Accounts
                                </Link>
                                <Link to="/businesses" className="btn btn-outline-primary">
                                    View Businesses
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;
