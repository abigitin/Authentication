import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
	const [auth, setAuth] = useState(false);
	const [message, setMessage] = useState("");
	const [name, setName] = useState("");

	axios.defaults.withCredentials = true;

	useEffect(() => {
		axios
			.get("http://localhost:8081/home")
			.then((res) => {
				if (res.data.status === "Success") {
					setAuth(true);
					setName(res.data.name);
				} else {
					setAuth(false);
					setMessage(res.data.Error);
				}
			})
			.catch((err) => console.error("Error:", err));
	}, []);

	const handleDelete = async () => {
		await axios
			.get("http://localhost:8081/logout")
			.then((res) => {
				location.reload(true);
				console.log(res.data);
			})
			.catch((err) => console.error("Error:", err));
	};

	return (
		<div className="container mt-4">
			{auth ? (
				<div className="auth-container">
					<h2>Your are an authorized user: {name}</h2>
					<button className="logout-btn" onClick={handleDelete}>
						Logout
					</button>
				</div>
			) : (
				<div className="text-center">
					<h3>{message}</h3>
					<h3>Login Now</h3>
					<Link to="/login" className="login-btn">
						Login
					</Link>
				</div>
			)}
		</div>
	);
}

export default Home;
