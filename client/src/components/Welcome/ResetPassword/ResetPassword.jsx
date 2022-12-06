import { Component } from "react";
import { ResetStart, ResetVerify, ResetSuccess } from "./ResetStates";

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
            resetStage: "start",
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

    handleResetStart() {
        console.log("Reset Password start submit");
        console.log(this.state);

        fetch("/password/reset/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((response) => {
                console.log({ response });

                if (response.success == true) {
                    this.setState({ resetStage: "verify" });
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }

    handleResetVerify() {
        console.log("Reset Password verify submit");
        console.log(this.state);

        fetch("/password/reset/Verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((response) => {
                console.log({ response });

                if (response.success == true) {
                    this.setState({ resetStage: "success" });
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }

    render() {
        switch (this.state.resetStage) {
            case "start":
                return (
                    <ResetStart
                        changeHandler={this.handleInputChange}
                        submitHandler={(e) => {
                            this.handleResetStart(e);
                        }}
                    ></ResetStart>
                );

            case "verify":
                return (
                    <ResetVerify
                        changeHandler={this.handleInputChange}
                        submitHandler={(e) => {
                            this.handleResetVerify(e);
                        }}
                    ></ResetVerify>
                );

            case "success":
                return <ResetSuccess></ResetSuccess>;

            default:
                console.log("default stage");
        }
    }
}

export default ResetPassword;
