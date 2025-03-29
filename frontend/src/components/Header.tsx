import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Extra Credit Union</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated ? (
                        <>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/accounts">Accounts</Nav.Link>
                                <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
                                <Nav.Link as={Link} to="/businesses">Businesses</Nav.Link>
                            </Nav>
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
