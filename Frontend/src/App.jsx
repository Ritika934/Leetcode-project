import {Routes, Route ,Navigate} from "react-router";
import Login from "../pages/Login";
import Signup from "../pages/Signup"
import Homepage from "../pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "../authslice";
import { useEffect } from "react";
import Admin from "../pages/Admin";
import Adminpanel from "../components.js/adminpanel";
import Adminupdate from "../components.js/adminupdate";
import Admindelete from "../components.js/admindelete";
import Adminvideo from "../components.js/adminvideo";
import Adminupload from "../components.js/adminupload";
import Profile from "../pages/Profile";
import ProblemPage from "../pages/problem";
import EditProfile from "../components.js/Editprofile"
import  Problemupdate from "../pages/problemupdate"
import Resumeupload from "../components.js/resumeupload"
import HandleGoogleSignIn from "../pages/firebase"
function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.slice1);
 const { theme } = useSelector((state) => state.theme);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

useEffect(() => {

    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  return(
  <>    <Routes>
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin"element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} ></Route>
    <Route path="/Admincreate"element={isAuthenticated && user?.role === 'admin' ? <Adminpanel /> :  <Navigate to="/" />} ></Route>
 <Route path="/Adminupdate"element={isAuthenticated && user?.role === 'admin' ? <Adminupdate/> : <Navigate to="/" />}> </Route>
  <Route path="/admin/update/:problemId"element={isAuthenticated && user?.role === 'admin' ? < Problemupdate/> : <Navigate to="/" />}> </Route>
  <Route path="/Admindelete"element={isAuthenticated && user?.role === 'admin' ? <Admindelete/> : <Navigate to="/" />}> </Route>
 <Route path="/admin/video"element={isAuthenticated && user?.role === 'admin' ? <Adminvideo/> : <Navigate to="/" />}> </Route>
 <Route path="/admin/upload/:problemId"element={isAuthenticated && user?.role === 'admin' ? <Adminupload/> : <Navigate to="/" />}> </Route>
    <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      <Route path="/Profile/:userId" element={<Profile/>}></Route>
      <Route path="/Userupdate/:id" element={<EditProfile/>}></Route>
            <Route path="/upload/resume/:id" element={<Resumeupload/>}></Route>
            <Route path="/Google"element={<HandleGoogleSignIn/>}></Route>
  </Routes>
  </>
  )
}

export default App;