import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import React, { useState } from 'react';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import Link from 'next/link';
import CopyrightNotice from '../app/CopyrightNotice';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useRouter } from 'next/router';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

const Login = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [confirmationResult, setConfirmationResult] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const auth = getAuth()

  function onCaptchVerify() {

    // @ts-ignore: Implicit any for children prop
    if (!window.recaptchaVerifier) {
      // @ts-ignore: Implicit any for children prop
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // login();
          },
          "expired-callback": () => { },
        }
      );
    }
  }

  const handleClick = () => {
    window.location.href = '/register';
  };


  // @ts-ignore: Implicit any for children prop
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // @ts-ignore: Implicit any for children prop
    await window.confirmationResult
      .confirm(otp)
      // @ts-ignore: Implicit any for children prop
      .then(async (res) => {
        //  localStorage.setItem('user',JSON.stringify(user))
        // router.push('/certificates');
      })
      // @ts-ignore: Implicit any for children prop
      .catch((err) => {
        console.log(err, "err")
        setLoginError(err?.error?.message || "Invalid Code")
        setIsLoading(false)
        setShow(true)
        console.log(err)

      });
  }

  const handleClose = () => {
    setShow(false);
  };
  // @ts-ignore: Implicit any for children prop
  const handleSendPhone = async (e) => {
    e.preventDefault()
    onCaptchVerify();
    setIsLoading(true)
    // @ts-ignore: Implicit any for children prop
    const appVerifier = window.recaptchaVerifier;

    // @ts-ignore: Implicit any for children prop
    await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // @ts-ignore: Implicit any for children prop
        window.confirmationResult = confirmationResult;
        // @ts-ignore: Implicit any for children prop
        setConfirmationResult(confirmationResult)
        console.log("OTP sended successfully!");
        setOtpSentMessage('OTP has been sent to your registered phone Number');
        setShowOTP(true)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setLoginError('An error occurred during login using phone');
        setShow(true);
        setIsLoading(false)
      });
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // @ts-ignore: Implicit any for children prop
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setLoginStatus(''); // Clear login status when email changes
    setFormData((prevData) => ({ ...prevData, email: value }));
  };
  // @ts-ignore: Implicit any for children prop
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setLoginStatus(''); // Clear login status when password changes
    if (value.length < 8) {
      setPasswordError('Password should be minimum 8 characters');
    } else {
      setPasswordError('');
    }
    setFormData((prevData) => ({ ...prevData, password: value }));
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        // Successful login, handle accordingly (redirect or show a success message)
        if (responseData.status === 'FAILED') {
          // Display error message for failed login
          setLoginStatus('FAILED');
          setLoginError(responseData.message || 'An error occurred during login');
          setShow(true);
          setShowPhone(responseData?.isPhoneNumber)
          if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
            setPhoneNumber(responseData?.phoneNumber)
          }
        } else if (responseData.status === 'SUCCESS') {


          if (responseData?.data && responseData?.data?.JWTToken !== undefined) {
            setLoginStatus('SUCCESS');
            setLoginError('');
            setLoginSuccess(responseData.message);
            setShow(true);
            localStorage.setItem('user', JSON.stringify(responseData?.data))
            router.push('/issue-poc');

          } else {
            setShowPhone(responseData?.isPhoneNumber)
            setLoginError('An error occurred during login');
            setShow(true);
            if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
              setPhoneNumber(responseData?.phoneNumber)
            }
          }
        }
      } else if (response.status === 400) {
        // Invalid input or empty credentials
        setShowPhone(responseData?.isPhoneNumber)
        setLoginError('Invalid input or empty credentials');
        setShow(true);
      } else if (response.status === 401) {
        // Invalid credentials entered
        setShowPhone(responseData?.isPhoneNumber)
        setLoginError('Invalid credentials entered');
        setShow(true);
        if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
          setPhoneNumber(responseData?.phoneNumber)
        }
      } else {
        // An error occurred during login
        setShowPhone(responseData?.isPhoneNumber)
        if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
          setPhoneNumber(responseData?.phoneNumber)
        }
        setLoginError('An error occurred during login');
        setShow(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Server Error.Please Try again');
      setShow(true);
    } finally {
      setIsLoading(false);
    }
  };

  // otp login
  // @ts-ignore: Implicit any for children prop
  const loginWithPhone = async (e) => {
    e.preventDefault()
    await handleOtpSubmit(e)
    try {
      setIsLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${apiUrl}/api/login-with-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
          email: formData.email
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        // Successful login, handle accordingly (redirect or show a success message)
        if (responseData.status === 'FAILED') {
          // Display error message for failed login
          setLoginStatus('FAILED');
          setLoginError(responseData.message || 'An error occurred during login');
          setShow(true);

        } else if (responseData.status === 'SUCCESS') {


          if (responseData?.data && responseData?.data?.JWTToken !== undefined) {
            setLoginStatus('SUCCESS');
            setLoginSuccess("Login Success");
            setShow(true);
            localStorage.setItem('user', JSON.stringify(responseData?.data))
            router.push('/dashboard');

          } else {

            setLoginError('An error occurred during login');
            setShow(true);

          }
        }
      } else if (response.status === 400) {
        // Invalid input or empty credentials

        setLoginError('Invalid input or empty credentials');
        setShow(true);
      } else if (response.status === 401) {
        // Invalid credentials entered

        setLoginError('Invalid credentials entered');
        setShow(true);

      } else {
        // An error occurred during login
        setLoginError('An error occurred during login');
        setShow(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // @ts-ignore: Implicit any for children prop
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLoginError('Please enter valid login credentials');
      return;
    }

    if (passwordError) {
      console.error('Login failed: Password is too short');
      return;
    }

    // if (passwordError) {
    //   console.error('Login failed: Password is too short');
    //   return;
    // }

    await login();
  };


  return (
    <>
      <Row className="justify-content-md-center mt-5">
        <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 6 }} className='login-container'>
          <div className='golden-border-left'></div>
          <Card className='login input-elements'>
            <h2 className='title text-center'>Issuer Login</h2>
            <p className='sub-text text-center'>Login using your credentials.</p>
            <div id='recaptcha-container'></div>

            {showOTP ? (
              // OTP Verification Form
              <Form className='otp-form' onSubmit={loginWithPhone}>
                <Form.Group controlId="otp" className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name='otp'
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
                {otpSentMessage && <p style={{ color: 'green' }}>{otpSentMessage}</p>}
                <div className='d-flex justify-content-between align-items-center'>
                  <Button label="Verify OTP" className="golden" />
                </div>
              </Form>


            ) : (
              // Login Form

              <Form className='login-form' onSubmit={handleSubmit}>
                <Form.Group controlId="email" className='mb-3'>
                  <Form.Label>
                    <Image
                      src="/icons/user-icon.svg"
                      width={16}
                      height={20}
                      alt='User Name'
                    />
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>
                    <Image
                      src="/icons/lock-icon.svg"
                      width={20}
                      height={20}
                      alt='Password'
                    />
                    Password
                  </Form.Label>
                  <Form.Control className='mb-2' style={{ marginBottom: showPhone ? "20px" : "" }} 
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError ? ( 
                    <p style={{ color: 'red' }}>{passwordError}</p>
                    ) : (
                    <p>&nbsp;</p>
                  )}
                </Form.Group>
                {showPhone && (
                  <Link
                    style={{ margin: "0 0 30px 10px", display: "block" }}
                    onClick={handleSendPhone}
                    href="/forgot-passwords"
                  >
                    Login with Phone
                  </Link>
                )}


                <div className='d-flex justify-content-between align-items-center'>
                  <Button label="Login" className="golden" />
                  <Link className="forgot-password-text" href="/forgot-passwords">Forgot Password?</Link>
                </div>
              </Form>
            )
            }

          </Card>
          <div className='golden-border-right'></div>
        </Col>
        <Col md={{ span: 12 }}>
          <Button label="Register" className='golden mt-5 ps-0 pe-0 w-100 d-block d-lg-none' onClick={handleClick} />
          <div className='copy-right text-center'>
            <CopyrightNotice />
          </div>
        </Col>
      </Row>

      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
        <Modal.Body>
          <div className='certificate-loader'>
            <Image
              src="/backgrounds/login-loading.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
        </Modal.Body>
      </Modal>

      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body className='p-5'>
          {loginError !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/close.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: 'red' }}>{loginError}</h3>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          ) : (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/check-mark.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: '#198754' }}>{loginSuccess}</h3>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;