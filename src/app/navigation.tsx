import { logout } from '@/common/auth';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Container, NavDropdown, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Button from '../../shared/button/button';
const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;
import { getAuth } from "firebase/auth"
const Navigation = () => {
  const router = useRouter();
  const auth = getAuth()
  const isUserLoggedIn = useRef(false); // Use useRef instead of a variable
  const [token, setToken] = useState(null);
  const [userDetail, setUserDetail] = useState({
    organization: '',
    name: '',
    certificatesIssued: ""
  });
  const [formData, setFormData] = useState({
    organization: '',
    name: '',
    certificatesIssued: ""
  });
  const [selectedTab, setSelectedTab] = useState(0)
  const handleViewProfile = () => {
    window.location.href = "/user-details"
  }

  useEffect(() => {
    isUserLoggedIn.current = localStorage?.getItem('user') !== null; // Update the ref value
  }, []);

  useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      fetchData(storedUser.email);
      setUserDetail(storedUser.name);

    } else {
      // If token is not available, redirect to the login page
      // router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
// @ts-ignore: Implicit any for children prop
  const fetchData = async (email) => {

    const data = {
        email: email
    };

    try {
        const response = await fetch(`${apiUrl_Admin}/api/get-issuer-by-email`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });
        
        const userData = await response.json();
        const userDetails = userData?.data;
        setFormData({
          organization: userDetails?.organization || "-",
          name: userDetails?.name || "-",
          certificatesIssued: userDetails?.certificatesIssued || "-"
        });
        
    } catch (error) {
        console.error('Error ', error);
        // Handle error
    }
};
  
useEffect(() => {
  // Check if the token is available in localStorage
  // @ts-ignore: Implicit any for children prop
  const userDetails = JSON.parse(localStorage?.getItem('user'));

  if (userDetails && userDetails.JWTToken) {
    // If token is available, set it in the state
   fetchData(userDetails.email)
  } else {
    // If token is not available, redirect to the login page
    // router.push('/');
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  useEffect(() => {


    const currentPath = router.pathname;
  switch (currentPath) {
    case '/poc':
      setSelectedTab(0);
      break;
      case '/search':
      setSelectedTab(1);
      break;
    default:
      setSelectedTab(0); // Default to the first tab
  }
  }, [router.pathname]);

  // @ts-ignore: Implicit any for children prop
  const handleClickTab=((value)=>{
    setSelectedTab(value)
  })


  const handleLogout = () => {

    localStorage.removeItem('user');
    sessionStorage.removeItem('badgeUrl');
    sessionStorage.removeItem('logoUrl');
    sessionStorage.removeItem('signatureUrl');
    sessionStorage.removeItem('issuerName');
    sessionStorage.removeItem('issuerDesignation');
    
    auth.signOut().then(() => {
      console.log("signout Successfully")

    })

    router.push('/');
  };
  const routesWithLogoutButton = ['/issue-poc', '/download', '/search'];
  
  return (
    <>
      <Navbar className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <Container fluid>
          <Navbar.Brand>
            <div className='nav-logo'>
              <Link onClick={()=>{handleClickTab(0)}} className="navbar-brand" href="/issue-poc">
                <Image
                  src='https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
                  layout='fill'
                  objectFit="contain"
                  alt='AI Certs logo'
                />
              </Link>
            </div>
          </Navbar.Brand>
          {routesWithLogoutButton.includes(router.pathname) && (
          <Navbar.Brand>
            <div className='nav-list'>
              <Link onClick={()=>{handleClickTab(0)}} className={`nav-item ${selectedTab===0?"tab-golden":""}`} href="/issue-poc">
             Issue
              </Link>
              <Link onClick={()=>{handleClickTab(1)}} className={`nav-item ${selectedTab===1?"tab-golden":""}`} href="/search">
              Search
              </Link>
            </div>
          </Navbar.Brand>
          )}
          
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
          
            <Navbar.Text>
              {routesWithLogoutButton.includes(router.pathname) && (
                <div className='icons-container'>
                 {/* <div className='logout' onClick={handleLogout}>
                 <Image
                   src='/icons/help-icon.svg'
                   layout='fill'
                   objectFit="contain"
                   alt='logout Icon'
                 />
               </div> */}
                <div className='logout' onClick={handleLogout}>
                  <Image
                    src='https://images.netcomlearning.com/ai-certs/logout.svg'
                    layout='fill'
                    objectFit="contain"
                    alt='logout Icon'
                  />
                </div>
                </div>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;