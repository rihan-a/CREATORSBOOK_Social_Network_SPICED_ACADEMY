import "./DarkModeSwitch.css";

function DarkModeSwitch() {
    const handleSwitch = () => {
        document.body.classList.toggle("dark");
    };

    return (
        <div className="dark-mode-switch">
            <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                onChange={handleSwitch}
            />
            <label htmlFor="checkbox" className="label">
                <svg
                    className="fa-moon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 96 960 960"
                    width="15"
                >
                    <path d="M479.931 909.5Q341 909.5 243.75 812.221q-97.25-97.28-97.25-236.25 0-138.971 97.201-236.221t236.06-97.25q11.057 0 22.148.75T524.5 246q-37.5 29.5-59.25 71.5T443.5 408q0 86.042 59.229 145.271Q561.958 612.5 648 612.5q48.065 0 90.282-21.75Q780.5 569 810 531.5q2 11.5 2.75 22.591.75 11.091.75 22.148 0 138.859-97.319 236.06T479.931 909.5Z" />
                </svg>
                <svg
                    className="fa-sun"
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 96 960 960"
                    width="15"
                >
                    <path d="M446.5 285.5v-139h67v139h-67ZM709 396l-51-48 101-98 48.5 45.5L709 396Zm61.5 213.5v-67h139v67h-139Zm-324 396v-139h67v139h-67Zm-195-610-100.5-99 50.5-46L298 347l-46.5 48.5ZM760 906l-97.5-101.5 47-47L810 854l-50 52ZM50.5 609.5v-67h139v67h-139ZM200 905l-47-49 98.5-96.5L274 782l22 23-96 100Zm279.971-91.5q-98.971 0-168.221-69.279-69.25-69.28-69.25-168.25 0-98.971 69.279-168.221 69.28-69.25 168.25-69.25 98.971 0 168.221 69.279 69.25 69.28 69.25 168.25 0 98.971-69.279 168.221-69.28 69.25-168.25 69.25Z" />
                </svg>
                <div className="ball"></div>
            </label>
        </div>
    );
}

export default DarkModeSwitch;
