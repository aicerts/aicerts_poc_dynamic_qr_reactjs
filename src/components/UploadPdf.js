import React, { useState, useRef, useEffect } from 'react';
import DisplayPdf from './DisplayPdf';

const UploadPdf = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: '',
        expirationDate: ''
    });
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [showPdf, setShowPdf] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const { email, certificateNumber, name, course, grantDate, expirationDate } = formData;
        setIsFormComplete(
            email && certificateNumber && name && course && grantDate && expirationDate && file
        );
    }, [formData, file]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            console.error('Please select a PDF file');
            setFile(null);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
        } else {
            console.error('Please select a PDF file');
            setFile(null);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleNextClick = () => {
        setShowPdf(true);
    };

    return (
        <div className="upload-pdf-container">
            {!showPdf && (
                <form className="form-container">
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Certificate Number:</label>
                        <input
                            type="text"
                            name="certificateNumber"
                            value={formData.certificateNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Course:</label>
                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Grant Date:</label>
                        <input
                            type="date"
                            name="grantDate"
                            value={formData.grantDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiration Date:</label>
                        <input
                            type="date"
                            name="expirationDate"
                            value={formData.expirationDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div
                        className='upload-container'
                        onClick={handleButtonClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <button type="button" className="upload-button">Upload PDF</button>
                    </div>
                    <button
                        type="button"
                        className="next-button"
                        onClick={handleNextClick}
                        disabled={!isFormComplete}
                    >
                        Next
                    </button>
                </form>
            )}
            {showPdf && <DisplayPdf file={file} scale={1.5} formDetails={formData} />}
        </div>
    );
};

export default UploadPdf;
