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
            <div className="nav-link" onClick={logOutHandler}>
                <div> LOGOUT</div>
            </div>
        </>
    );
}

export default Logout;
