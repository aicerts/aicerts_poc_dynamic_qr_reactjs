import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navigation from '../app/navigation';
import Upload from '../components/Upload';
const LoginPage = () => {
    return (
        <div className='container-fluid'>  
            <Navigation />
            <div className="container">
                <Upload />
            </div>
        </div>
    );
}

export default LoginPage;
