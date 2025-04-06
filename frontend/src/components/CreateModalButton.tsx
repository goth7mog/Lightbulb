// components/CreateModalButton.tsx
import { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

interface CreateModalButtonProps {
    buttonText: string;
    modalTitle: string;
    children: React.ReactNode;
    onSubmit: () => void;
    onClose?: () => void;
    showError?: string;
    submitButtonText?: string;
    variant?: string;
}

const CreateModalButton: React.FC<CreateModalButtonProps> = ({
    buttonText,
    modalTitle,
    children,
    onSubmit,
    onClose,
    showError,
    submitButtonText = 'Create',
    variant = 'primary'
}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        onClose?.();
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant={variant} onClick={handleShow}>
                {buttonText}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showError && <Alert variant="danger">{showError}</Alert>}
                    <Form>{children}</Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        {submitButtonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateModalButton;
