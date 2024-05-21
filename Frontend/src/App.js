import Login from "./Login";
import { Routes,Route } from "react-router-dom";
import SignUp from "./SignUp";
import ForgetPass from "./ForgetPass";
import HomePage from "./Homepage";
import Rtsp from "./Rtsp";
import Usb from "./Usb";
function App() {
  return (
    <>
   <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<SignUp/>} />
    <Route path="/forgetpass" element={<ForgetPass/>} />
    <Route path="/home" element={<HomePage/>} />
    <Route path="/Rtsp" element={<Rtsp/>}/>
    <Route path="/Usb" element={<Usb/>}/>
   </Routes>
   </>
  );
}

export default App;
