import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import { Rnd } from 'react-rnd';

const adminUrl = process.env.NEXT_PUBLIC_BASE_URL;

const DisplayPdf = ({ file, scale, formDetails }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [rectangle, setRectangle] = useState({
        x: 100 ,
        y: 100,
        width: 130 ,
        height: 130
    });
    const containerRef = useRef(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    const handleSubmit = () => {
        if (!rectangle) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", formDetails.email);
        formData.append("certificateNumber",formDetails.certificateNumber );
        formData.append("name", formDetails.name);
        formData.append("course", formDetails.course);
        formData.append("grantDate", formatDate(formDetails.grantDate));
        formData.append("expirationDate", formatDate(formDetails.expirationDate));
        formData.append("posx", Math.round(rectangle.x));
        formData.append("posy", Math.round(rectangle.y));
        const qrsize = Math.round((Math.abs(rectangle.width) + Math.abs(rectangle.height)) / 2);
        formData.append("qrsize", qrsize);
        formData.append("file", file);

        fetch(`${adminUrl}/api/issue-dynamic-pdf`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.blob())
        .then(blob => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
                setSuccess("Certificates Retrieved Successfully");
                setShow(true);
            } else {
                setError("Failed to generate certificate.");
                setShow(true);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setError("An error occurred. Please try again.");
            setShow(true);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const cancelSelection = () => {
        setRectangle(null);
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            return () => {
                // Cleanup event listeners if needed
            };
        }
    }, [scale]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <button onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1)}>Previous</button>
                <button onClick={() => setPageNumber(pageNumber < numPages ? pageNumber + 1 : numPages)}>Next</button>
            </div>
            <div
                ref={containerRef}
                style={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    border: '1px solid #ccc'
                }}
            >
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                    <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} />
                </Document>
                {rectangle && (
                    <Rnd
                        size={{ width: rectangle.width * scale, height: rectangle.height * scale }}
                        position={{ x: rectangle.x * scale, y: rectangle.y * scale }}
                        onDragStop={(e, d) => {
                            setRectangle(prev => ({
                                ...prev,
                                x: d.x / scale,
                                y: d.y / scale
                            }));
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            setRectangle(prev => ({
                                ...prev,
                                width: ref.offsetWidth / scale,
                                height: ref.offsetHeight / scale,
                                x: position.x / scale,
                                y: position.y / scale
                            }));
                            console.log('Updated Rectangle:', {
                                x: position.x / scale,
                                y: position.y / scale,
                                width: ref.offsetWidth / scale,
                                height: ref.offsetHeight / scale
                            });
                        }}
                        bounds="parent"
                        style={{ border: '2px solid red' }}
                    />
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button onClick={handleSubmit} disabled={!rectangle}>Submit</button>
                <button onClick={cancelSelection} disabled={!rectangle}>Cancel</button>
            </div>
            {blobUrl && (
                <a href={blobUrl} download="certificate.pdf">
                    <button>Download Certificate</button>
                </a>
            )}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <p>Please dont reload the Page. It may take a few minutes.</p>
                </Modal.Body>
            </Modal>
            <Modal className='loader-modal text-center' show={show} centered onHide={() => setShow(false)}>
                <Modal.Body className='p-5'>
                    {error && (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Error'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}>{error}</h3>
                            <button className='warning' onClick={() => setShow(false)}>Ok</button>
                        </>
                    )}
                    {success && (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Success'
                                />
                            </div>
                            <h3 style={{ color: 'green' }}>{success}</h3>
                            <button className='success' onClick={() => setShow(false)}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DisplayPdf;
