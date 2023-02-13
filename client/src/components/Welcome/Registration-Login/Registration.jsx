import { Component } from "react";
import { Link } from "react-router-dom";

import "./RegistrationLogin.css";

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        //console.log(e);
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }

    handleSubmit() {
        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success == true) {
                    location.reload();
                } else {
                    this.setState({
                        error: response.error,
                    });
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }

    render() {
        return (
            <div className="signup-signin-components">
                <h2>
                    Create an account and be a part of what's next in art,
                    design, fashion, web culture & more.
                </h2>

                <div className="signup-signin-form">
                    <input
                        type="text"
                        name="firstName"
                        onChange={this.handleInputChange}
                        placeholder="First name"
                    ></input>

                    <input
                        type="text"
                        name="lastName"
                        onChange={this.handleInputChange}
                        placeholder="Last name"
                    ></input>

                    <input
                        type="email"
                        name="email"
                        onChange={this.handleInputChange}
                        placeholder="Email"
                    ></input>

                    <input
                        type="password"
                        name="password"
                        onChange={this.handleInputChange}
                        placeholder="Password"
                    ></input>
                    <input
                        type="submit"
                        value="Register Now"
                        onClick={(e) => this.handleSubmit(e)}
                    ></input>
                    <span>
                        Already a member ? <Link to="/login">Log in!</Link>
                    </span>

                    <span className="error">{this.state.error}</span>
                </div>
            </div>
        );
    }
}

export default Registration;
