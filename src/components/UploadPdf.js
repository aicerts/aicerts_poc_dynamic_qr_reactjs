import React, { useState, useRef } from 'react';
import DisplayPdf from './displayPdf';

const UploadPdf = () => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

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

    return (
        <div>
            <div
                className='upload-container'
                onClick={handleButtonClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <div className='upload-file'>
                    {!file && <div className='file-name'>Drop PDF here or click to upload.</div>}
                    {file && <div className='file-name'>{file.name}</div>}
                    <div className='link-wrapper d-flex justify-content-center'>
                        <div className='link-text'>Upload from Computer</div>
                    </div>
                    <p className='text my-2'>MAX PDF (50MB)</p>
                </div>
            </div>
            {file && <DisplayPdf file={file} scale={1.5} />}
        </div>
    );
};

export default UploadPdf;
