import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PageNotFound from './Components/PageNotFound';
import Home from './Components/Home';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Style/style.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  window.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  window.indianPhoneNumberRegex = /^[6-9]\d{9}$/;
  window.nameRegex = /^[A-Za-z ]+$/;


  const routes = [
    { path: '* ', element: <PageNotFound /> },
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
  ];


  return (
    <div>
      <ToastContainer
        limit={1}
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="colored"
        theme="light"
      />
      <BrowserRouter>
        <Routes>
          {routes && routes.map((route, k) => (
            <Route key={k} exact {...route} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


