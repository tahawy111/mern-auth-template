/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error: any) {
      toast.error(error.response.data.msg);
    }
  };
  return (
    <div>
      <h1>Welcome back</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Enter you username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <input
          name="password"
          placeholder="Enter you password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Login</button>

        <br />
        <span>
          Don't have an account? <Link to={`/register`}>Register</Link>
        </span>
      </form>
    </div>
  );
}
