import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import Loding from "./Loding";
const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);


  // create a New User in database
  const registerUser = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    }
    else if(password.length<6)
    {
      setError("Please create a password of atleast 6 characters");
    }
    else {
      setMessage(null);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        setLoading(true);
        const { data } = await axios.post(
          "/api/users/register",
          {
            name,
            email,
            password,
          },
          config
        );
        if(data)
        {
          setError(null);
          setMessage(<div>Account Created Successfully, Please Login <a href='/'>here</a> to continue</div>);
        setLoading(false);

        }
        // localStorage.setItem("userInfo", JSON.stringify(data));
        // setLoading(false);
      } catch (error) {
        setError(error.response.data.message);
        setLoading(false);
      }
    }
  };

  return (
    <div>
    <div className="bgImage"> </div>
    <div className="position-relative pt-4">
    <div className="mb-4 col-sm-6 container">
      <div className="text-white fs-3">Register</div>
      <hr className="text-white" />
      {loading && <Loding/>}
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {message && <ErrorMessage >{message}</ErrorMessage>}
      <div className="card p-3 bg-light">
      <form onSubmit={registerUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            id="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="email"
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
            type="password"
            className="form-control"
            id="pass"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confpass" className="form-label">
            Confirm Password
          </label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="form-control"
            id="confpass"
          />
        </div>
        <div className="mb-2"></div>
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

export default Register;
