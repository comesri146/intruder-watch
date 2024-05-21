import React, { useEffect, useState } from 'react';
import './Usb.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Usb() {
  const [connectedWebcams, setConnectedWebcams] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
      setConnectedWebcams(videoInputDevices);
    });
  }, []);

  const handleChange = (e) => {
    setSelectedDevice(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle the form submission with the selected device
    console.log('Selected Device:', selectedDevice);

    // Navigate to the HomePage with the selected device as a URL parameter
    if (selectedDevice) {
      navigate(`/home?deviceId=${encodeURIComponent(selectedDevice)}`);
    } else {
      // Show an alert if no device is selected
      alert('Please connect a webcam!');
    }
  };

  const handleClose = () => {
    // Handle close button click
    navigate('/home');
  };

  return (
    <div className="container">
      <section>
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <h3 className="text-white p-5 text-center text-sm-start">INTRUDER WATCH</h3>
            <div className="col-12 col-md-9 col-lg-7 col-xl-4">
              <div className="container" id="rtsp_container">
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
                    <h3 className="text-dark">USB INPUT FEED</h3>
                  </div>
                  <br />
                  <div className="input-container">
                    <i className="fa fa-usb icon"></i>
                    <select className="input-field" value={selectedDevice} onChange={handleChange}>
                      <option value="">Select a webcam</option>
                      {connectedWebcams.map((webcam) => (
                        <option key={webcam.deviceId} value={webcam.deviceId}>
                          {webcam.label || `Webcam ${connectedWebcams.indexOf(webcam) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div className="text-center mt-2 pt-2">
                    <button type="submit" className="btn btn-success btn-md">
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

export default Usb;