import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './Firebase';

function Login() {
  const initialValues = { email: '', password: '' };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };

  const signin = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // Sign-in successful, navigate to the home page
        window.location.href = '/home';
      })
      .catch((error) => {
        // Handle sign-in error here
        console.error(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // Validation successful, sign in the user with the provided email and password
      auth
        .signInWithEmailAndPassword(formValues.email, formValues.password)
        .then((userCredential) => {
          // Sign-in successful, navigate to the home page
          window.location.href = '/home';
        })
        .catch((error) => {
          // Handle sign-in error here
          console.error(error);
          // Show pop-up or error message indicating invalid email or password
          alert('Invalid email or password');
        });
    }
  }, [formErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
  };

  const validate = (values) => {
    const errors = {};
    const emailRegex = /([a-zA-Z0-9\.\-]+)@(\w+[\.\-]?\w+)\.([a-z]{2,3})(\.[a-z]{2})?$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!values.email) {
      errors.email = '*Email is required!';
    } else if (!emailRegex.test(values.email)) {
      errors.email = '*This is not a valid email format!';
    }

    if (!values.password) {
      errors.password = '*Password is required!';
    } else if (!passwordRegex.test(values.password)) {
      errors.password = '*Enter a strong password!';
    }

    return errors;
  };

  return (
    <div className="container-absolute">
      <section>
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <h3 className="text-white pt-5">INTRUDER WATCH</h3>
              <br />
              <img src="camera.jpg" className="img-fluid rounded-image" alt="" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <br />
              <br />
              <br />
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row align-items-center justify-content-center">
                  <h3 className="text-white">LOGIN</h3>
                </div>
                <br />

                <div className="input-container">
                  <i className="fa fa-envelope icon"></i>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter a valid email address"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger">{formErrors.email}</p>
                <br />

                <div className="input-container">
                  <i className="fa fa-key icon"></i>
                  <input
                    className="input-field"
                    type={passwordType}
                    placeholder="Password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                  <span onClick={togglePassword}>
                    {passwordType === 'password' ? (
                      <i className="fa fa-eye-slash icon"></i>
                    ) : (
                      <i className="fa fa-eye icon"></i>
                    )}
                  </span>
                </div>
                <p className="text-danger">{formErrors.password}</p>

                <div className="d-flex flex-row align-items-center justify-content-center">
                  <Link to="/forgetpass" className="lead fw-normal mb-0 me-1 text-white">
                    Forgot password?
                  </Link>
                </div>

                <div className="text-center  mt-2 pt-2">
                  <button type="submit" className="btn btn-success btn-md">
                    Login
                  </button><br/>
                  <p className="small fw-bold mt-1 pt-1 mb-0 text-white">
                    Don't have an account? <Link to="/signup" className="link-danger">Sign-Up</Link>
                  </p>
                </div>
              </form>
             <hr class="my-4"  style={{border:"1px solid white"}}/>
             <div className="d-flex flex-row align-items-center justify-content-center">
                <button onClick={signin}  class="google btn" style={{backgroundColor:"#dd4b39",color:"white"}}>
                  <i class="fa fa-google fa-fw"></i> Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;