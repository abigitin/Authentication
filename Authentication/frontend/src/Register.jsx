import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const RegisterPage = () => {
	// State variables to hold form data
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Use the useNavigate hook to access navigation functionality
	const navigate = useNavigate();
	axios.defaults.withCredentials = true;
	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:8081/register", {
				name,
				email,
				password,
			});
			if (response.data.status === "success") {
				navigate("/login");
			} else {
				alert("Registration failed");
			}
		} catch (error) {
			console.error("Registration failed:", error);
			alert("Registration failed");
		}
	};

	return (
		<Container className="register-container mt-5">
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formName">
					<Form.Label>Name</Form.Label>
					<input
						type="text"
						className="input-field"
						placeholder="Enter your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formEmail">
					<Form.Label>Email address</Form.Label>
					<input
						type="email"
						className="input-field"
						placeholder="Enter email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formPassword">
					<Form.Label>Password</Form.Label>
					<input
						type="password"
						className="input-field"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>

				<Button variant="primary" type="submit" className="register-btn">
					Register
				</Button>
			</Form>
		</Container>
	);
};

export default RegisterPage;
