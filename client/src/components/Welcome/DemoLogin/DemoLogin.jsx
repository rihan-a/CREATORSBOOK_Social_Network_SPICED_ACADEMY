import "./DemoLogin.css";

function DemoLogin(props) {
    const userInput = {
        email: props.email,
        password: props.password,
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
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    return (
        <div className="demo-login-card" onClick={handleSubmit}>
            <h4 className="demo-name">{props.firstName} Doe</h4>
        </div>
    );
}

export default DemoLogin;
