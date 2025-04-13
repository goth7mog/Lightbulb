import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Form,
  Button,
  Alert
} from "react-bootstrap";
import {
  getBusinesses,
  updateBusinessSanction,
  createBusiness
} from "../services/api";
import CreateModalButton from "../components/CreateModalButton";

const Businesses = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState("");

  const [newBusiness, setNewBusiness] = useState({
    name: "",
    category: "",
    sanctioned: false
  });
  const [businessFormError, setBusinessFormError] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError("Failed to load businesses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleBusinessInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewBusiness({
      ...newBusiness,
      [name]: value
    });
  };

  const handleCreateBusiness = async () => {
    if (!newBusiness.name || !newBusiness.category) {
      setBusinessFormError("Please fill in all required fields.");
      return;
    }

    try {
      const created = await createBusiness(newBusiness);
      setBusinesses([...businesses, created]);

      setNewBusiness({
        name: "",
        category: "",
        sanctioned: false
      });
      setBusinessFormError("");
    } catch (err) {
      console.error("Error creating business:", err);
      setBusinessFormError("Failed to create business. Please try again.");
    }
  };

  const handleToggleSanction = async (
    id: string,
    currentSanctioned: boolean
  ) => {
    try {
      const updatedBusiness = await updateBusinessSanction(
        id,
        !currentSanctioned
      );

      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? updatedBusiness : b))
      );

      setSuccessMessage(
        `Successfully ${
          updatedBusiness.sanctioned ? "sanctioned" : "unsanctioned"
        } ${updatedBusiness.name}.`
      );

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating sanction status:", err);
      setError("Failed to update sanction status. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const filteredBusinesses = businesses.filter((b) => {
    const query = filter.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
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
        <CreateModalButton
          buttonText="Add Business"
          modalTitle="New Business"
          onSubmit={handleCreateBusiness}
          onClose={() => {
            setNewBusiness({
              name: "",
              category: "",
              sanctioned: false
            });
            setBusinessFormError("");
          }}
          showError={businessFormError}
        >
          <Form.Group className="mb-3">
            <Form.Label>Business Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newBusiness.name}
              onChange={handleBusinessInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={newBusiness.category}
              onChange={handleBusinessInputChange}
            />
          </Form.Group>
        </CreateModalButton>
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
                    <tr key={business.id}>
                      <td>{business.id}</td>
                      <td>{business.name}</td>
                      <td>{business.category}</td>
                      <td>
                        <Badge bg={business.sanctioned ? "danger" : "success"}>
                          {business.sanctioned ? "Sanctioned" : "Active"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={
                            business.sanctioned
                              ? "outline-success"
                              : "outline-danger"
                          }
                          size="sm"
                          onClick={() =>
                            handleToggleSanction(
                              business.id,
                              business.sanctioned
                            )
                          }
                        >
                          {business.sanctioned
                            ? "Remove Sanction"
                            : "Apply Sanction"}
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
