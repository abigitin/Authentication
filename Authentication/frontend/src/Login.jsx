import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const LoginPage = () => {
	// State variables to hold form data
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	axios.defaults.withCredentials = true;
	const navigate = useNavigate();
	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:8081/login", {
				email,
				password,
			});
			if (response.data.status === "success") {
				navigate("/home");
			} else if (response.data.status === "error") {
				alert("Invalid Credentials");
			} else {
				alert("Email and Password not matched");
			}
		} catch (error) {
			console.error("Login failed:", error);
			alert("Email not found in the database");
		}
		console.log("Form submitted:", { email, password });
	};

	return (
		<Container className="login-container mt-5">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email address</label>
					<input
						type="email"
						className="form-control"
						id="email"
						placeholder="Enter email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						className="form-control"
						id="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<Button variant="primary" type="submit" className="login-btn">
					Login
				</Button>

				<Link to="/register" className="create-account-link">
					Create New Account
				</Link>
			</form>
		</Container>
	);
};

export default LoginPage;
