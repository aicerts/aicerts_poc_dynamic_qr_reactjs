// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router'; 
import fileDownload from 'react-file-download';
import SearchTab from "./SearchTab";
const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
const userUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;


const Upload = () => {
    const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBatchFile, setSelectedBatchFile] = useState(null);
  const singleFileInputRef = useRef(null);
const batchFileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [show, setShow] = useState(false);
  const [singleZip, setSingleZip] = useState(null);
  const [batchZip, setBatchZip] = useState(null);
    // State to track active tab
    const [activeTab, setActiveTab] = useState('single');

    // Function to handle tab click
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

  const handleDownloadsample = () => {
    // Create a new anchor element
    const anchor = document.createElement('a');
    // Set the href attribute to the path of the file to be downloaded
    anchor.href = '/sample.zip';
    // Set the download attribute to the desired filename for the downloaded file
    anchor.download = 'sample';
    // Append the anchor element to the document body
    document.body.appendChild(anchor);
    // Trigger a click event on the anchor element to initiate the download
    anchor.click();
    // Remove the anchor element from the document body
    document.body.removeChild(anchor);
  };

  const handleClose = () => {
    setShow(false);
    window.location.reload();
    setError("")
    setSuccess("")

  };
  const handleCloseSuccess = () => {
    setShow(false);
    setError("")
    setSuccess("")
  };

  const handleSingleDownload = async () => {
    
    if (singleZip) {
    setIsLoading(true);

        const fileData = new Blob([singleZip], { type: 'application/zip' }); // Change type to 'application/zip'
        await fileDownload(fileData, 'certificate.zip'); // Change file name to 'certificate.zip'
    setIsLoading(false);

    }

};

const handleBatchDownload = async () => {
    if (batchZip) {
    setIsLoading(true);

        const fileData = new Blob([batchZip], { type: 'application/zip' }); // Change type to 'application/zip'
        await fileDownload(fileData, 'certificate.zip'); // Change file name to 'certificate.zip'
    setIsLoading(false);

    }

};


 // @ts-ignore
const handleFileChange = (event) => {

    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop(); // Get the file extension
      const fileSize = file.size / (1024 * 1024); // Convert bytes to MB for zip files
      if (
        fileType.toLowerCase() === 'zip' &&
        fileSize <= 100
      ) {
        setSelectedFile(file);
        console.log('Selected file:', fileName, file.size, file.type);
      } else {
        let message = '';
        if (fileType.toLowerCase() !== 'zip') {
          message = 'Only ZIP files are supported.';
        } else if (fileSize < 0.1) {
          message = 'File size should be at least 100KB.';
        } else if (fileSize > 100) {
          message = 'File size should be less than or equal to 100MB.';
        }
        // Notify the user with the appropriate message
        setError(message);
        setShow(true)
      }
    }
  };

  
  // @ts-ignore
const handleFileBatchChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop(); // Get the file extension
      const fileSize = file.size / (1024 * 1024); // Convert bytes to MB for zip files
      if (
        fileType.toLowerCase() === 'zip' &&
        fileSize >= 0.1 && // Minimum size is 0.1 MB (100KB)
        fileSize <= 100 // Maximum size is 100 MB
      ) {
        setSelectedBatchFile(file);
        console.log('Selected file:', fileName, file.size, file.type);
      } else {
        let message = '';
        if (fileType.toLowerCase() !== 'zip') {
          message = 'Only ZIP files are supported.';
        } else if (fileSize < 0.1) {
          message = 'File size should be at least 100KB.';
        } else if (fileSize > 100) {
          message = 'File size should be less than or equal to 100MB.';
        }
        // Notify the user with the appropriate message
        setError(message);
        setShow(true)
      }
    }
  };
  



  const handleSingleClick = () => {
    // @ts-ignore
    singleFileInputRef.current.click();
  };

  const handleBatchClick = () => {
    // @ts-ignore
    batchFileInputRef.current.click();
  };

  // Get the data from the API
  const issueSingleCertificates = async () => {
    try {
        setIsLoading(true)
        // Construct FormData for file upload
        const formData = new FormData();
        formData.append('zipFile', selectedFile);

        // Make API call
        const response = await fetch(`${userUrl}/api/bulk-single-issue`, {
            method: 'POST',
            body: formData
        }
        );


        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
    
        // Parse response body as JSON
        if(response && response.ok){
            const blob = await response.blob();
            setSingleZip(blob);
            setSuccess("Certificates Successfully Generated")
            setShow(true);
       } else if (response) {
        
        const responseBody = await response.json();

        const errorMessage = responseBody && responseBody.message ? responseBody.message : 'An error occurred';
       
        console.error('API Error:' || 'An error occurred');
        setError(errorMessage);
        setShow(true);
       }
    }
    
    catch (error) {
      let errorMessage = 'An error occurred';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      setShow(true);
    } finally {
      setIsLoading(false)
    }
  };

  const issueBatchCertificates = async () => {
    try {
        setIsLoading(true)
        // Construct FormData for file upload
        const formData = new FormData();
        formData.append('zipFile', selectedBatchFile);

        // Make API call
        const response = await fetch(`${userUrl}/api/bulk-batch-issue`, {
            method: 'POST',
            body: formData
        }
        );

        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
    
        // Parse response body as JSON

       if(response && response.ok){
        const blob = await response.blob();
        setBatchZip(blob);
        setSuccess("Certificates Successfully Generated")
        setShow(true);
       }else if (response) {
        const responseBody = await response.json();
        const errorMessage = responseBody && responseBody.message ? responseBody.message : 'An error occurred';
        console.error('API Error:' || 'An error occurred');
        setError(errorMessage);
        setShow(true);
       }

    }
    
    catch (error) {
      let errorMessage = 'An error occurred';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      setShow(true);
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <>
    <Container className='dashboard pb-5'>
    <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
                  <div className='tagline mb-3 mb-md-0'>Please refer to our Sample file for upload.</div>
                  <Button label="Download Sample &nbsp; &nbsp;" className='golden position-relative' onClick={handleDownloadsample} />
                </div>
      <Row>
        <Col xs={12} md={8}>
          <div className='bulk-upload'>
            {/* Bootstrap tabs */}
            <div className='admin-button-container'>
              <span onClick={() => handleTabClick('single')} className={`btn ${activeTab === 'single' ? 'btn-golden' : ''}`}>
                Single
              </span>
          <span className="vertical-line"></span>

              <span onClick={() => handleTabClick('batch')} className={`btn ${activeTab === 'batch' ? 'btn-golden' : ''}`}>
              Batch
              </span>
            </div>

              {/* <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === 'search' ? 'active' : ''}`} id="search-tab" data-bs-toggle="tab" data-bs-target="#search" type="button" role="tab" aria-controls="search" aria-selected={activeTab === 'search'} onClick={() => handleTabClick('search')}>Search</button>
              </li> */}
            {activeTab?.toLowerCase() !== "search" && (<h3 className='page-title'>{activeTab} Issuance</h3>)
            }
            <div className="tab-content" id="uploadTabContent">
              {/* Single Tab */}
              <div className={`tab-pane fade ${activeTab === 'single' ? 'show active' : ''}`} id="single" role="tabpanel" aria-labelledby="single-tab">
                <div className='browse-file text-center'>
                  <div className='download-icon position-relative'>
                    <Image
                      src={`${iconUrl}/cloud-upload.svg`}
                      layout='fill'
                      objectFit='contain'
                      alt='Upload icon'
                    />
                  </div>
                  <h4 className='tagline'>Upload your Single issue certification zip file here.</h4>
                  <input type="file" ref={singleFileInputRef} onChange={handleFileChange} hidden accept=".zip" />
                  <Button label="Choose File" className='outlined' onClick={handleSingleClick} />
                  {selectedFile && (
                    <div>
                      <p className='mt-4'>{selectedFile?.name}</p>
                      <Button label="Validate and Issue" className='golden' onClick={issueSingleCertificates} />
                    </div>
                  )}
                  <div className='restriction-text'>Only <strong>zip</strong> is supported. <br />(Upto 100MB)</div>
                  {singleZip && (
                                            <Button onClick={handleSingleDownload} label="Download Certification" className="golden mt-2" disabled={isLoading} />
                                        )}
                </div>
              </div>
              {/* batch Tab */}
              <div className={`tab-pane fade ${activeTab === 'batch' ? 'show active' : ''}`} id="batch" role="tabpanel" aria-labelledby="batch-tab">
              <div className='browse-file text-center'>
                  <div className='download-icon position-relative'>
                    <Image
                      src={`${iconUrl}/cloud-upload.svg`}
                      layout='fill'
                      objectFit='contain'
                      alt='Upload icon'
                    />
                  </div>
                  <h4 className='tagline'>Upload your batch issue certification zip file here.</h4>
                  <input type="file" ref={batchFileInputRef} onChange={handleFileBatchChange} hidden accept=".zip" />
                  <Button label="Choose File" className='outlined' onClick={handleBatchClick} />
                  {selectedBatchFile && (
                    <div>
                      <p className='mt-4'>{selectedBatchFile?.name}</p>
                      <Button label="Validate and Issue" className='golden' onClick={issueBatchCertificates} />
                    </div>
                  )}
                   
                  <div className='restriction-text'>Only <strong>zip</strong> is supported. <br />(Upto 100MB)</div>
                  {batchZip && (
                                            <Button onClick={handleBatchDownload} label="Download Certification" className="golden mt-2" disabled={isLoading} />
                                        )}
                </div>
              </div>
            {/* Search tab */}
              <div className={`tab-pane fade ${activeTab === 'search' ? 'show active' : ''}`} id="batch" role="tabpanel" aria-labelledby="batch-tab">
            <SearchTab/>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>

    {/* Loading Modal for API call */}
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

    <Modal className='loader-modal text-center' show={show} centered onHide={handleClose}>
            <Modal.Body className='p-5'>
                {error && (
                    <>
                        <div className='error-icon'>
                            <Image
                                src="/icons/close.svg"
                                layout='fill'
                                objectFit='contain'
                                alt='Loader'
                            />
                        </div>
                        <h3 style={{ color: 'red' }}>{error}</h3>
                        <button className='warning' onClick={handleClose}>Ok</button>
                    </>
                )}
                {success && (
                    <>
                        <div className='error-icon'>
                            {/* Use a success icon */}
                            <Image
                  src="/icons/check-mark.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
                        </div>
                        <h3 style={{ color: 'green' }}>{success}</h3>
                        <button className='success' onClick={handleCloseSuccess}>Ok</button>
                    </>
                )}
            </Modal.Body>
        </Modal>
  </>
  
  )
}


export default Upload
