import { useEffect } from "react";
const VisitorAPI = require("visitorapi");

function VisitorApi() {
    useEffect(() => {
        VisitorAPI("dBi64Wz2bAQaSgolqJIY", (visitorData) => {
            fetch("/visitorapi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(visitorData),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                });
        });
    }, []);
    return <div></div>;
}

export default VisitorApi;
