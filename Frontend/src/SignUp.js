import React, { useState, useEffect } from 'react';
import './SignUp.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function SignUp() {
  const initialValues = { email: '', password: '', street: '', city: '', pin: '' };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEmailAlreadyRegistered, setIsEmailAlreadyRegistered] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [isConfirmationSuccess, setIsConfirmationSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formErrors);
    }
  }, [formErrors, isSubmit]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified && isConfirmationSuccess) {
          const db = firebase.firestore();
          db.collection('users')
            .doc(user.uid)
            .set({
              email: formValues.email,
              city: formValues.city,
              street: formValues.street,
              pincode: formValues.pin
            })
            .then(() => {
              console.log('User details saved successfully.');
              navigate('/home');
            })
            .catch((error) => {
              console.error('Error saving user details:', error);
            });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConfirmationSuccess, formValues, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));

    if (Object.keys(formErrors).length === 0) {
      firebase
        .auth()
        .fetchSignInMethodsForEmail(formValues.email)
        .then((signInMethods) => {
          if (signInMethods && signInMethods.length > 0) {
            setIsEmailAlreadyRegistered(true);
          } else {
            firebase
              .auth()
              .createUserWithEmailAndPassword(formValues.email, formValues.password)
              .then((userCredential) => {
                const user = userCredential.user;
                user.sendEmailVerification()
                  .then(() => {
                    setIsVerificationEmailSent(true);
                  })
                  .catch((error) => {
                    console.error('Error sending verification email:', error);
                  });
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage);
              });
          }
        })
        .catch((error) => {
          console.error('Error checking email:', error);
        });
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /([a-zA-Z0-9\.\-]+)@(\w+[\.\-]?\w+)\.([a-z]{2,3})(\.[a-z]{2})?$/;
    const regex1 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!values.email) {
      errors.email = '*Email is required!';
    } else if (!regex.test(values.email)) {
      errors.email = '*This is not a valid email format!';
    }

    if (!values.password) {
      errors.password = '*Password is required!';
    } else if (!regex1.test(values.password)) {
      errors.password = '*Enter a strong password!';
    }

    if (!values.street) {
      errors.street = '*Street is required!';
    }
    if (!values.city) {
      errors.city = '*City is required!';
    }
    if (!values.pin) {
      errors.pin = '*Pincode is required!';
    }

    return errors;
  };

  const [passwordType, setPasswordType] = useState('password');
  const togglePassword = () => {
    setPasswordType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleConfirmation = () => {
    const user = firebase.auth().currentUser;
    user.reload().then(() => {
      if (user.emailVerified) {
        setIsConfirmationSuccess(true);
        
        // At this point, the user's email is verified, and the details can be saved to the database.
        const db = firebase.firestore();
        db.collection('users')
          .doc(user.uid)
          .set({
            email: formValues.email,
            city: formValues.city,
            street: formValues.street,
            pincode: formValues.pin
          })
          .then(() => {
            console.log('User details saved successfully.');
            navigate('/home');
          })
          .catch((error) => {
            console.error('Error saving user details:', error);
          });
      } else {
        setIsConfirmationSuccess(false);
        alert('Email not confirmed yet. Please check your email and click the confirmation link.');
      }
    });
  };

  const handleClosePopUp = () => {
    setIsEmailAlreadyRegistered(false);
    setIsVerificationEmailSent(false);
    navigate('/');
  };

  return (
    <div className="scrollable-wrapper">
      <div className='container'>
        <section>
          <h3 className='text-white p-3'>INTRUDER WATCH</h3>
          <br />
          <div className='container-fluid h-custom'>
            <div className='flex-row d-flex justify-content-center align-items-center h-100'>
              <div className='col-12 col-md-9 col-lg-7 col-xl-4'>
                <div className='d-flex justify-content-end'>
                  <button type='button' id='close_button' className='btn close' onClick={handleClose}>
                    <span aria-hidden='true' className='text-white'>
                      <h4>
                        <kbd>X</kbd>
                      </h4>
                    </span>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className='d-flex flex-row align-items-center justify-content-center'>
                    <h3 className='text-white'>SIGN UP</h3>
                  </div>
                  <br />
                  <div className='input-container'>
                    <i className='fa fa-envelope icon'></i>
                    <input
                      className='input-field '
                      type='email'
                      placeholder='Enter your email id'
                      name='email'
                      value={formValues.email}
                      onChange={handleChange}
                    />
                  </div>
                  <span className='text-danger'>{formErrors.email}</span>

                  <div className='input-container'>
                    <i className='fa fa-key icon'></i>
                    <input
                      className='input-field'
                      type={passwordType}
                      placeholder='Enter your Password'
                      name='password'
                      value={formValues.password}
                      onChange={handleChange}
                    />
                    <span onClick={togglePassword}>
                      {passwordType === 'password' ? (
                        <i className='fa fa-eye-slash icon'></i>
                      ) : (
                        <i className='fa fa-eye icon'></i>
                      )}
                    </span>
                  </div>
                  <span className='text-danger'>{formErrors.password}</span>

                  <div className='input-container'>
                    <i className='fa fa-street-view icon'></i>
                    <input
                      className='input-field'
                      type='text'
                      placeholder='Enter your street'
                      name='street'
                      value={formValues.street}
                      onChange={handleChange}
                    />
                  </div>
                  <span className='text-danger'>{formErrors.street}</span>

                  <div className='input-container'>
                    <i className='fa fa-map-marker icon'></i>
                    <input
                      className='input-field'
                      type='text'
                      placeholder='Enter your city'
                      name='city'
                      value={formValues.city}
                      onChange={handleChange}
                    />
                  </div>
                  <span className='text-danger'>{formErrors.city}</span>

                  <div className='input-container'>
                    <i className='fa fa-globe icon'></i>
                    <input
                      className='input-field'
                      type='text'
                      placeholder='Enter your Pin number'
                      name='pin'
                      value={formValues.pin}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='text-center  mt-2 pt-2'>
                    <button type='submit' className='btn btn-success btn-md'>
                      Sign Up
                    </button>
                  </div>
                  <br></br>
                </form>
                {isEmailAlreadyRegistered && (
                  <div className='popup'>
                    <div className='popup-inner'>
                      <button onClick={handleClosePopUp} className='btn btn-outline-light' >Login</button>
                      <p>Email already registered Please Login</p>
                    </div>
                  </div>
                )}

                {isVerificationEmailSent && (
                  <div className='popup'>
                    <div className='popup-inner'>
                      <button onClick={handleConfirmation} className='btn btn-outline-light'>Confirm Email</button>
                      <p>Verification email sent. Please check your email and click the confirmation link.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SignUp;