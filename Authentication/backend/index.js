import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cokieParser from "cookie-parser";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const salt = 10;
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		methods: ["GET", "POST"],
	})
);
app.use(cokieParser());

const db = sql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.password,
	database: process.env.database,
});

db.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to database");
	}
});

const verifyuser = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.json({ Error: "User not Authenticated" });
	else {
		jwt.verify(token, process.env.secret, (err, decoded) => {
			if (err) return res.json({ Error: "Token is not okay" });
			else {
				req.name = decoded.name;
				next();
				return res.json({ name: req.name });
			}
		});
	}
};

app.get("/home", verifyuser, (req, res) => {
	try {
		console.log(req.name);
		return res.json({ status: "Success", name: req.name });
	} catch (error) {
		console.error("Error in /home route:", error);
		return res.status(500).json({ Error: "Internal Server Error" });
	}
});

app.get("/logout", (req, res) => {
	res.clearCookie("token");
	return res.json({ status: "Success" });
});

app.post("/register", (req, res) => {
	const sql = "INSERT INTO login(`name`, `email`, `password`) VALUES (?, ?, ?)";
	bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
		if (err) {
			return res.json({ status: "error" });
		} else {
			const VALUES = [req.body.name, req.body.email, hash];
			db.query(sql, VALUES, (err, result) => {
				if (err) {
					return res.json({ status: "error" });
				} else {
					return res.json({ status: "success" });
				}
			});
		}
	});
});

app.post("/login", (req, res) => {
	const sql = "SELECT * FROM login WHERE email = ?";
	db.query(sql, [req.body.email], (err, result) => {
		if (err) {
			return res.json({ status: "error" });
		} else {
			if (result.length > 0) {
				bcrypt.compare(
					req.body.password.toString(),
					result[0].password,
					(err, response) => {
						if (err) {
							return res.json({ status: "error" });
						}
						if (response) {
							const name = result[0].name;
							const token = jwt.sign({ name }, process.env.secret, {
								expiresIn: "1d",
							});
							res.cookie("token", token);

							return res.json({ status: "success" });
						} else {
							return res.json({ Error: "Password not matched" });
						}
					}
				);
			} else {
				return res.json({ Error: "User Email does not exist" });
			}
		}
	});
});

app.listen(8081, () => {
	console.log("Server is running on port 8081");
});
