import React, { useEffect, useState } from "react";
import axios from "axios";
import Loding from "./Loding";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Login Handler
  const loginUserHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios.post(
        "/api/users/login",
        {
          email,
          password,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setError(null);
      if (data.isAdmin) {
        navigate("/admin-dashboard");
      } else navigate("/dashboard");
    } catch (error) {
      if(error.response.status===500)
      {
        setError(`Could not connect to server!`);
      }
      else
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  // to check if a user is already logged in > redirect
  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      if (data.isAdmin) {
        navigate("/admin-dashboard");
      } else navigate("/dashboard");
    }
  }, []);
  return (
    <div>
      <div className="bgImage"> </div>
      <div className="position-relative">
        <h2 className="p-2 fw600 position-relative text-center bg-dark text-white">
          Welcome to StarBookAuctions (SBA)
        </h2>
        <div className=" my-4 col-sm-6 container">
          <div className="text-white fs-3">Sign-In</div>
          <hr className="text-white" />
          {loading && <Loding />}
          {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
          <div className="card p-3 bg-light">
            <form onSubmit={loginUserHandler} autoComplete="off">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="none"
                  value={email}
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="pass" className="form-label">
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  autoComplete="none"
                  type="password"
                  className="form-control"
                  id="pass"
                />
              </div>
              <div className="mb-2">
                <small>
                  New Here? <a href="/register">Register</a>
                </small>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
