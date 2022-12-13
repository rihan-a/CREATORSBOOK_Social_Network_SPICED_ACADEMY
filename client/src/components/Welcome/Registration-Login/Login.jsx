import { Component } from "react";
import { Link } from "react-router-dom";
import "./RegistrationLogin.css";
class Login extends Component {
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
        console.log("About to submit the form!");
        //console.log(this.state);
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((response) => {
                console.log({ response });
                if (response.success == true) {
                    window.location.replace("/");
                } else {
                    this.setState({ error: response.error });
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }

    render() {
        return (
            <div className="signup-signin-components">
                <h2>Welcome back!</h2>
                <div className="signup-signin-form login">
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
                        value="Log-In"
                        onClick={(e) => this.handleSubmit(e)}
                    ></input>
                    <span>
                        Not a member yet ?<Link to="/">Sign up!</Link>
                    </span>
                    <span>
                        Forgot password?
                        <Link to="/password/reset">Reset password</Link>
                    </span>
                    <span className="error">{this.state.error}</span>
                </div>
            </div>
        );
    }
}

export default Login;
