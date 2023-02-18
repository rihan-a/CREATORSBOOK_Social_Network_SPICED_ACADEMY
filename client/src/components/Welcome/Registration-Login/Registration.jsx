import { useState } from "react";
import { Link } from "react-router-dom";

import "./RegistrationLogin.css";

function Registration() {
    const [userInput, setUserInput] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setUserInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInput),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success == true) {
                    location.reload();
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
            <h2>
                Create an account and be a part of what's next in art, design,
                fashion, web culture & more.
            </h2>

            <div className="signup-signin-form">
                <input
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                    placeholder="First name"
                ></input>

                <input
                    type="text"
                    name="lastName"
                    onChange={handleInputChange}
                    placeholder="Last name"
                ></input>

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
                    value="Register Now"
                    onClick={handleSubmit}
                ></input>
                <span>
                    Already a member ? <Link to="/login">Log in!</Link>
                </span>

                <span className="error">{error}</span>
            </div>
        </div>
    );
}

export default Registration;
