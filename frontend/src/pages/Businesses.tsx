import { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Button, Alert } from 'react-bootstrap';
import { getBusinesses, updateBusinessSanction } from '../services/api';

const Businesses = () => {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                setIsLoading(true);
                const data = await getBusinesses();
                setBusinesses(data);
            } catch (err) {
                console.error('Error fetching businesses:', err);
                setError('Failed to load businesses. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    const handleToggleSanction = async (id: string, currentSanctioned: boolean) => {
        try {
            const updatedBusiness = await updateBusinessSanction(id, !currentSanctioned);

            // Update the businesses list
            setBusinesses(businesses.map(business =>
                business.id === id ? updatedBusiness : business
            ));

            setSuccessMessage(`Successfully ${updatedBusiness.sanctioned ? 'sanctioned' : 'unsanctioned'} ${updatedBusiness.name}.`);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error updating sanction status:', err);
            setError('Failed to update sanction status. Please try again.');

            // Clear error message after 3 seconds
            setTimeout(() => setError(''), 3000);
        }
    };

    const filteredBusinesses = businesses.filter(business => {
        if (!filter) return true;

        return (
            business.name.toLowerCase().includes(filter.toLowerCase()) ||
            business.category.toLowerCase().includes(filter.toLowerCase())
        );
    });

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading businesses...</p>
            </div>
        );
    }

    if (error && !successMessage) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Businesses</h1>
                <Button variant="primary">Add Business</Button>
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

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <div className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Filter by name or category..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    {filteredBusinesses.length === 0 ? (
                        <Alert variant="info">
                            No businesses found matching your filter.
                        </Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBusinesses.map((business) => (
                                        <tr key={business.id} className="transaction-row">
                                            <td>{business.id}</td>
                                            <td>{business.name}</td>
                                            <td>{business.category}</td>
                                            <td>
                                                <Badge bg={business.sanctioned ? 'danger' : 'success'}>
                                                    {business.sanctioned ? 'Sanctioned' : 'Active'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant={business.sanctioned ? 'outline-success' : 'outline-danger'}
                                                    size="sm"
                                                    onClick={() => handleToggleSanction(business.id, business.sanctioned)}
                                                >
                                                    {business.sanctioned ? 'Remove Sanction' : 'Apply Sanction'}
                                                </Button>
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

export default Businesses;
