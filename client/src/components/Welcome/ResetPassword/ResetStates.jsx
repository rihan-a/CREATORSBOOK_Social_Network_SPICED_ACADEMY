import { Link } from "react-router-dom";

const ResetStart = ({ changeHandler, submitHandler }) => {
    return (
        <div>
            <input
                type="email"
                name="email"
                onChange={changeHandler}
                placeholder="Email"
            ></input>
            <input
                type="submit"
                value="Send code"
                onClick={(e) => submitHandler(e)}
            ></input>
        </div>
    );
};

const ResetVerify = ({ changeHandler, submitHandler }) => {
    return (
        <div>
            <input
                type="password"
                name="reset_code"
                onChange={changeHandler}
                placeholder="enter code"
            ></input>
            <input
                type="password"
                name="password"
                onChange={changeHandler}
                placeholder="New Password"
            ></input>

            <input
                type="submit"
                value="Reset Password"
                onClick={(e) => submitHandler(e)}
            ></input>
        </div>
    );
};

const ResetSuccess = () => {
    return (
        <div>
            <div>
                <p>Password reset was successful!</p>
            </div>

            <span>
                You can log in again using your new password
                <Link to="/login">Log in!</Link>
            </span>
        </div>
    );
};

export { ResetStart, ResetVerify, ResetSuccess };
