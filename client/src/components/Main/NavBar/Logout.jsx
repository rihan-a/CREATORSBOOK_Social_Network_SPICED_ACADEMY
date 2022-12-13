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
            <div className="logout-btn" onClick={logOutHandler}>
                <div className="material-symbols-outlined">logout</div>
                <div> LOGOUT</div>
            </div>
        </>
    );
}

export default Logout;
