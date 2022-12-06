import { useNavigate } from "react-router";

function Logout() {
    const navigate = useNavigate();
    const logOutHandler = () => {
        fetch("/logout")
            .then((result) => result.json())
            .then(() => {
                navigate("/");
                location.reload();
            });
    };

    return (
        <>
            <span className="nav-link" onClick={logOutHandler}>
                LOGOUT
            </span>
        </>
    );
}

export default Logout;
