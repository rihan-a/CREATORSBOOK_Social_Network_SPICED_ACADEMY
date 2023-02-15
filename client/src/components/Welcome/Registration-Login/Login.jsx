import { useState } from "react";
import { Link } from "react-router-dom";
import "./RegistrationLogin.css";

function Login() {
    const [userInput, setUserInput] = useState({ email: "", password: "" });

    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setUserInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInput),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success == true) {
                    window.location.replace("/");
                } else {
                    setError(response.error);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    return (
        <div className="signup-signin-components">
            <h2>Welcome back!</h2>
            <div className="signup-signin-form login">
                <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    placeholder="Email"
                ></input>

                <input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    placeholder="Password"
                ></input>
                <input
                    type="submit"
                    value="Log-In"
                    onClick={handleSubmit}
                ></input>
                <span>
                    Not a member yet ?<Link to="/">Sign up!</Link>
                </span>
                <span>
                    Forgot password?
                    <Link to="/password/reset">Reset password</Link>
                </span>
                <span className="error">{error}</span>
            </div>
        </div>
    );
}

export default Login;
