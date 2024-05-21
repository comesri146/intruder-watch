import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Homepage.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import ReactSwitch from 'react-switch';
import { useLocation } from 'react-router-dom';
import { auth } from './Firebase';
import ReactPlayer from 'react-player';
import axios from 'axios';

function HomePage() {
  const [checked, setChecked] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectedWebcam, setSelectedWebcam] = useState('');
  const [connectedWebcams, setConnectedWebcams] = useState([]);
  const [useWebcam, setUseWebcam] = useState(false);
  const webcamVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const location = useLocation();
  const [rtspUrl, setRtspUrl] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [videoStream, setVideoStream] = useState(null); // New state for video stream
  const videoRef = useRef(null); // Ref for video element

  const startStreaming = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const deviceIdFromParam = params.get('deviceId');

    if (deviceIdFromParam && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setSelectedWebcam(deviceIdFromParam);
    } else {
      setSelectedWebcam('');
    }
  }, [location.search]);
  
  const VideoPlayer = () => {
    const [videoStream, setVideoStream] = useState(null);
  
    useEffect(() => {
      const fetchVideoStream = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/stream/', {
            responseType: 'blob',
          });
          const blob = new Blob([response.data], { type: 'video/mp4' });
          const videoURL = URL.createObjectURL(blob);
          setVideoStream(videoURL);
        } catch (error) {
          console.error('Error fetching video stream:', error);
        }
      };
  
      fetchVideoStream();
    }, []);
  
    return (
      <div>
        {videoStream && (
          <video controls>
            <source src={videoStream} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  };
  



  const startStreamingVideo = useCallback(() => {
    if (selectedWebcam && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: { exact: selectedWebcam } } })
        .then((stream) => {
          webcamVideoRef.current.srcObject = stream;
          setUseWebcam(true);
          setStreaming(true);
        })
        .catch((error) => {
          console.error('Error accessing selected webcam:', error);
          startLocalVideo();
        });
    } else {
      startLocalVideo();
    }
  }, [selectedWebcam]);
  
  const startLocalVideo = useCallback(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: { exact: selectedWebcam } } })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          setUseWebcam(true);
          setStreaming(true);
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    }
  }, [selectedWebcam]);

  const startRTSPStreaming = useCallback(() => {
    if (rtspUrl) {
      const video = document.getElementById('video');
      if (video) {
        video.src = rtspUrl;
        video.play();
        setStreaming(true);
      }
    }
  }, [rtspUrl]);
  

  const stopStreaming = useCallback(() => {
    const stream = useWebcam ? webcamVideoRef.current?.srcObject : localVideoRef.current?.srcObject;
    if (stream && streaming) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      if (useWebcam) {
        webcamVideoRef.current.srcObject = null;
      } else {
        localVideoRef.current.srcObject = null;
      }
      setStreaming(false);
    }
  }, [streaming, useWebcam]);
  // Your drawing functions
  const handleMouseDown = (event) => {
    setDrawing(true);
    const canvas = document.getElementById('lineDrawingCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.style.cursor = 'crosshair';
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const canvas = document.getElementById('lineDrawingCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      const canvas = document.getElementById('lineDrawingCanvas');
      const ctx = canvas.getContext('2d');
      ctx.closePath();
      canvas.style.cursor = 'auto';
    }
  };

  const clearCanvas = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    startStreaming();
    startStreamingVideo();
    startRTSPStreaming();

    const dropdownToggle = document.getElementById('configureDropdown');
    const dropdownMenu = document.getElementById('configureDropdownMenu');
    dropdownToggle.addEventListener('click', function () {
      dropdownMenu.classList.toggle('show');
    });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
      setConnectedWebcams(videoInputDevices);
    });

    document.addEventListener('click', function (event) {
      const isDropdownToggle = dropdownToggle.contains(event.target);
      const isDropdownMenu = dropdownMenu.contains(event.target);
      if (!isDropdownToggle && !isDropdownMenu) {
        dropdownMenu.classList.remove('show');
      }
    });

    return () => {
      stopStreaming();
      dropdownToggle.removeEventListener('click', function () {
        dropdownMenu.classList.toggle('show');
      });
      document.removeEventListener('click', function (event) {
        const isDropdownToggle = dropdownToggle.contains(event.target);
        const isDropdownMenu = dropdownMenu.contains(event.target);
        if (!isDropdownToggle && !isDropdownMenu) {
          dropdownMenu.classList.remove('show');
        }
      });
    };
  }, [startStreaming, startStreamingVideo, startRTSPStreaming, stopStreaming, startLocalVideo]);


  const handleChangeWebcam = (event) => {
    setSelectedWebcam(event.target.value);
    setStreaming(false);
  };

  const handleRTSPInputChange = (event) => {
    setRtspUrl(event.target.value);
    setStreaming(false);
  };

  const handleRTSPSubmit = (event) => {
    event.preventDefault();
    startRTSPStreaming();
  };

  const handleConfigureDropdownClick = (event) => {
    event.preventDefault();
    const selectedOptionId = event.target.id;
    if (selectedOptionId === 'd-1') {
      window.location.href = '/Rtsp';
    } else if (selectedOptionId === 'd-2') {
      window.location.href = '/Usb';
    }
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const drawLine = (canvasId, y) => {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    };

    clearCanvas('lineCanvas1');
    clearCanvas('lineCanvas2');
    clearCanvas('lineCanvas3');

    drawLine('lineCanvas1', 150);
    drawLine('lineCanvas2', 150);
    drawLine('lineCanvas3', 150);
  }, []);


  return (
    <div className="scrollable-wrapper">
      <div className="overflow">
        <section>
          <div className="container" id="main-container">
            <div className="row">
              <div className="col-md-9 col-lg-6 col-xl-8">
                <h3 className="text-white p-3 text-center text-md-start">INTRUDER WATCH</h3>
                <select className="form-select" aria-label="Dropdown" value={selectedWebcam} onChange={handleChangeWebcam}>
                  <option value="">Select an input CCTV</option>
                  {connectedWebcams.map((webcam) => (
                    <option key={webcam.deviceId} value={webcam.deviceId}>
                      {webcam.label || `Webcam ${connectedWebcams.indexOf(webcam) + 1}`}
                    </option>
                  ))}
                </select>
                {selectedWebcam && (
                  <p style={{ color: 'white', margin: '10px ' }}>
                    Selected Camera:{' '}
                    {connectedWebcams.find((webcam) => webcam.deviceId === selectedWebcam)?.label ||
                      `Webcam ${connectedWebcams.findIndex((webcam) => webcam.deviceId === selectedWebcam) + 1}`}
                  </p>
                )}
                <form onSubmit={handleRTSPSubmit} className="mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter RTSP URL"
                    value={rtspUrl}
                    onChange={handleRTSPInputChange}
                  />
                  <button type="submit" className="btn btn-primary mt-2">
                    Start RTSP Streaming
                  </button>
                </form>
              </div>
              <div className="col-md-3 col-lg-6 col-xl-3 offset-xl-1" id="configure">
                <div className="container text-center text-md-start">
                  <div className="dropdown">
                    <a
                      className="btn btn-secondary dropdown-toggle"
                      href="#!"
                      role="button"
                      id="configureDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Confgure Manually
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="configureDropdown" id="configureDropdownMenu">
                      <li>
                        <a className="dropdown-item" href="/Rtsp" id="d-1" onClick={handleConfigureDropdownClick}>
                          RTSP INPUT
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/Usb" id="d-2">
                          USB INPUT
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row pt-5">
        <div className="col-md-11 col-lg-11 col-xl-11 justify-content-center align-self-center">
        <div className="embed-responsive embed-responsive-16by9 position-relative">
        {streaming ? (
  useWebcam ? (
    <div className="position-relative">
      <video
        ref={webcamVideoRef}
        className="embed-responsive-item"
        style={{
          borderStyle: 'dotted',
          borderWidth: '10px',
          borderColor: 'yellow',
          width: '100%', // Set width to 100% to match the canvas size
        }}
        autoPlay
      ></video>
      <canvas
        id="lineDrawingCanvas"
        className="position-absolute"
        style={{
          bottom: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
        width={webcamVideoRef.current?.videoWidth}
        height={webcamVideoRef.current?.videoHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
    ) : (
      <div className="position-relative">
        <ReactPlayer
          url={rtspUrl}
          className="react-player embed-responsive-item"
          style={{
            borderStyle: 'dotted',
            borderWidth: '10px',
            borderColor: 'yellow',
            width: '100%', // Set width to 100% to match the canvas size
            height: 'auto', // Allow the height to adjust automatically
          }}
          playing={true}
          controls={true}
          width="100%" // Set the width attribute for the <ReactPlayer> component
          height="auto" // Allow the height to adjust automatically
        />
        <canvas
          id="lineDrawingCanvas"
          className="position-absolute"
          style={{
            bottom: 0,
            left: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
          width={webcamVideoRef.current?.videoWidth}
          height={webcamVideoRef.current?.videoHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>
    )
  ) : (
  <video
    ref={localVideoRef}
    src="/InShot_20240411_142135437.mp4"
    className="embed-responsive-item"
    style={{
      borderStyle: 'dotted',
      borderWidth: '10px',
      borderColor: 'yellow',
      width: '100%', // Set width to 100% to match the canvas size
    }}
    autoPlay
  ></video>
)}



</div>

              <div className="mt-2 pt-2">
                <button
                  type="button"
                  className={`btn ${streaming ? 'btn-danger' : 'btn-success'}`}
                  onClick={streaming ? stopStreaming : startRTSPStreaming}
                >
                  {streaming ? 'Stop Streaming' : 'Start Streaming'}
                  </button>
                  <div className={`d-flex float-end ${checked ? 'ai-mode' : 'normal-mode'}`}>
                    <ReactSwitch checked={checked} onChange={handleChange} className="d-flex" />
                    <span style={{ color: 'yellow', fontSize: '20px', fontWeight: 'bold' }}>
                      {checked ? 'AI Mode' : 'Normal Mode'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-md-none">
                <i
                  className="fa fa-arrow-circle-left"
                  style={{ fontSize: '60px', color: 'orange', paddingTop: '20px', position: 'relative' }}
                  data-bs-toggle="offcanvas"
                  data-bs-target="#demo"
                ></i>
              </div>
              <div className="col-md-1 col-lg-1 col-xl-1 d-none d-md-block">
                <i
                  className="fa fa-arrow-circle-left"
                  style={{
                    fontSize: '60px',
                    color: 'orange',
                    paddingTop: '150px',
                    position: 'absolute',
                    paddingRight: '20px',
                    right: '0',
                  }}
                  data-bs-toggle="offcanvas"
                  data-bs-target="#demo"
                ></i>
              </div>
            </div>
            <div className="offcanvas offcanvas-end" id="demo">
              <div className="oaffcanvas-header">
                <h1 className="offcanvas-title text-danger">Intruder Alert</h1>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
              </div>
              <div className="offcanvas-body">
                <div className="d-flex justify-content-center">
                  <img
                    src="https://videos.cctvcamerapros.com/wp-content/files/IP-security-camera-AI-person-detection.jpg"
                    className="img-fluid"
                    alt="Intruder"
                  />
                </div>
                <br />
                <h4 className="text-center border" style={{ padding: '5px' }}>
                  Alert Time: 10.45 PM
                </h4>
              </div>
            </div>
            <div className="row mt-3 justify-content-center">
              <div className="col-auto">
                <button type="button" onClick={logout} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default HomePage;