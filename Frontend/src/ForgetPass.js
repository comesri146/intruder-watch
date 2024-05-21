import React, { useState } from 'react';
import './Forgotpass.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './Firebase';

function ForgotPass() {
  const initialValues = { email: '' };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);

    if (Object.keys(formErrors).length === 0 && otpSent) {
      navigate('/');
    }
  };

  const handleSendOTP = () => {
    const { email } = formValues;

    auth.sendPasswordResetEmail(email)
      .then(() => {
        setOtpSent(true);
        setIsLoading(false);
        alert('Password Reset Link sent to your email. Please check your inbox.');
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        alert('Please Enter the registerd email.  ');
      });
  };

  const validate = (values) => {
    const errors = {};
    const emailRegex = /([a-zA-Z0-9\.\-]+)@(\w+[\.\-]?\w+)\.([a-z]{2,3})(\.[a-z]{2})?$/;

    if (!values.email) {
      errors.email = '*Email is required!';
    } else if (!emailRegex.test(values.email)) {
      errors.email = '*This is not a valid email format!';
    }

    return errors;
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="container-absolute">
      <section>
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <h3 className="text-white p-5 text-center text-sm-start">INTRUDER WATCH</h3>
            <br />
            <div className="col-12 col-md-9 col-lg-7 col-xl-4">
              <div className="d-flex justify-content-end">
                <button type="button" id="close_button" className="btn close" onClick={handleClose}>
                  <span aria-hidden="true" className="text-white">
                    <h4>
                      <kbd>X</kbd>
                    </h4>
                  </span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row align-items-center justify-content-center">
                  <h3 className="text-white">FORGOT PASSWORD</h3>
                </div>
                <br />
                <div className="input-container">
                  <i className="fa fa-envelope icon"></i>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter your email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger">{formErrors.email}</p>
                <br />
                {!otpSent ? (
                  <div className="text-center mt-2 pt-2">
                    <button type="button" className="btn btn-info btn-md" onClick={handleSendOTP}>
                      Get Link
                    </button>
                  </div>
                ) : (
                  <div className="text-center mt-2 pt-2">
                    <button type="submit" className="btn btn-success btn-md">
                      Back to Login
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPass;