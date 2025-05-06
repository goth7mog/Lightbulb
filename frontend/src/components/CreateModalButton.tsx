// components/CreateModalButton.tsx
import { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';

interface CreateModalButtonProps {
    buttonText: string;
    modalTitle: string;
    children: React.ReactNode;
    onSubmit: () => Promise<void>;
    onClose?: () => void;
    showError?: string;
    showSuccess?: boolean;
    successMessage?: string;
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
    showSuccess = false,
    successMessage = "Success!",
    submitButtonText = 'Create',
    variant = 'primary'
}) => {
    const [show, setShow] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localSuccess, setLocalSuccess] = useState(false);

    const handleClose = () => {
        // Only reset success state after the modal is fully closed
        // to prevent flickering of the previous state
        setTimeout(() => {
            setLocalSuccess(false);
            onClose?.();
        }, 300); // Wait for modal animation to complete

        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit();
            setLocalSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2500); // Would close automatically in 2.5 seconds honey
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    {(showSuccess || localSuccess) && (
                        <Alert variant="success" className="d-flex align-items-center">
                            <CheckCircleFill className="me-2" size={20} />
                            <span>{successMessage}</span>
                        </Alert>
                    )}
                    {/* Hide the form when success message is shown */}
                    {!(showSuccess || localSuccess) && <Form>{children}</Form>}
                </Modal.Body>
                <Modal.Footer>
                    {/* Hide cancel button on success */}
                    {!(showSuccess || localSuccess) && (
                        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                    )}
                    {/* Hide submit button on success */}
                    {!(showSuccess || localSuccess) && (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : submitButtonText}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateModalButton;
