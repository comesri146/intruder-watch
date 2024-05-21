import React, { useState, useEffect } from 'react';
import './Rtsp.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Rtsp() {
  const initialValues = { host: '', port: '' };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    const hostRegex = /^\d{3}$/;
    const portRegex = /^\d{5}$/;

    if (!values.host) {
      errors.host = '*Host number is required';
    } else if (!hostRegex.test(values.host)) {
      errors.host = '*This is not a valid Host Number format!';
    }

    if (!values.port) {
      errors.port = '*Port is required!';
    } else if (!portRegex.test(values.port)) {
      errors.port = '*Enter a valid port!';
    }

    if (hostRegex.test(values.host) && portRegex.test(values.port)) {
      navigate(`/home?rtspUrl=${values.host}:${values.port}`);
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formErrors);
    }
  }, [formErrors, isSubmit]);

  const [isLoadingHost, setIsLoadingHost] = useState(false);
  const [isLoadingPort, setIsLoadingPort] = useState(false);

  const togglePort = () => {
    setIsLoadingPort(true);

    // Simulating an asynchronous action
    setTimeout(() => {
      setIsLoadingPort(false);
    }, 10000);
  };

  const toggleHost = () => {
    setIsLoadingHost(true);

    // Simulating an asynchronous action
    setTimeout(() => {
      setIsLoadingHost(false);
    }, 10000);
  };

  const handleClose = () => {
    // Handle close button click
    navigate('/home');
  };

  return (
    <div className='container-absolute'>
      <section>
        <div className='container-fluid'>
          <div className='row d-flex justify-content-center align-items-center h-100'>
            <h3 className='text-white p-5 text-center text-sm-start'>INTRUDER WATCH</h3>
            <div className='col-12 col-md-9 col-lg-7 col-xl-4'>
              <div className='container' id="rtsp_container">
                <div className='d-flex justify-content-end'>
                  <button type='button' id='close_button' className='btn close' onClick={handleClose}>
                    <span aria-hidden='true' className='text-white'>
                      <h4><kbd>X</kbd></h4>
                    </span>
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='d-flex flex-row align-items-center justify-content-center'>
                    <h3 className='text-white'>RTSP INPUT FEED</h3>
                  </div>
                  <br />
                  <div className='input-container'>
                    <i className='fa fa-server icon'></i>
                    <input
                      className='input-field'
                      placeholder='Enter your host'
                      name='host'
                      value={formValues.host}
                      onChange={handleChange}
                    />
                    <span onClick={toggleHost}>
                      {isLoadingHost ? (
                        <i className='fa fa-spinner icon'></i>
                      ) : (
                        <i className='fa fa-refresh icon'></i>
                      )}
                    </span>
                  </div>
                  <p className='text-danger'>{formErrors.host}</p>
                  <br />
                  <div className='input-container'>
                    <i className='fa fa-sitemap icon'></i>
                    <input
                      className='input-field'
                      placeholder='Enter your Port'
                      name='port'
                      value={formValues.port}
                      onChange={handleChange}
                    />
                    <span onClick={togglePort}>
                      {isLoadingPort ? (
                        <i className='fa fa-spinner icon'></i>
                      ) : (
                        <i className='fa fa-refresh icon'></i>
                      )}
                    </span>
                  </div>
                  <p className='text-danger'>{formErrors.port}</p>
                  <br />
                  <div className='text-center mt-2 pt-2'>
                    <button type='submit' className='btn btn-success btn-md'>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Rtsp;