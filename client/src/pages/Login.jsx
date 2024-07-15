import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext';

library.add(fab);

function Login() {

  const navigate = useNavigate();
  const { updateAuthStatus } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    const username = e.target.elements['username'].value
    const password = e.target.elements['password'].value;
    try {
      await axios.post("http://localhost:3000/login", { username, password }, { withCredentials: true });
      await updateAuthStatus();
      setErrorMessage(null);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please check your credentials and try again.");
    }
  };
  async function handleGoogleSubmit() {
    try {
      const result = await axios.get("http://localhost:3000/auth/google", {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173"
        },
        withCredentials: true
      });
      if(result.data==="Success") {
        navigate("/");
      }
      else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
    <Header />
    <div className="container mt-5">
      <h1>Login</h1>

      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" name="username" />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" name="password" />
                </div>
                <br />
                <button type="submit" className="btn btn-dark">Login</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <div className="btn btn-block" role="button" onClick={handleGoogleSubmit}>
                <FontAwesomeIcon icon={['fab', 'google']} />
                &nbsp;
                Sign In with Google
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {errorMessage && (
        <div>
          <br />
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        </div>
      )}

      {!errorMessage && <br />}
      <div className="row">
      <div className="col-sm-3" />
        <div className="col-sm-9">
          New User? <a href='/register'>Register</a>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default Login;