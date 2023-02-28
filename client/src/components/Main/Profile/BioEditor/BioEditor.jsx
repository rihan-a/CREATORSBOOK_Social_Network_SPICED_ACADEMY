import { useState, useEffect } from "react";

function BioEditor() {
    const [bioState, setBioState] = useState("add");

    const [bioText, setBioText] = useState("");

    //const [error, setError] = useState("");

    useEffect(() => {
        async function creatorsData() {
            try {
                const response = await fetch("/creators-data");
                const result = await response.json();
                if (result.userData.bio) {
                    setBioText(result.userData.bio);
                    setBioState("edit");
                }
            } catch (error) {
                console.error(error);
            }
        }
        creatorsData();
    }, []);

    const addBioText = (e) => {
        setBioText(e.target.value);
    };

    const editBioHandler = () => {
        setBioState("save");
    };

    const saveBioData = () => {
        console.log(bioText);
        fetch("/bio/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bioText }),
        })
            .then((res) => res.json())
            .then((res) => {
                setBioText(res.bio);
                //setError("");
            })
            .catch((err) => {
                //setError("Something went wrong!");
            });
        setBioState("edit");
    };

    return (
        <div className="bio-container">
            {(() => {
                switch (bioState) {
                    case "add":
                        return (
                            <>
                                <p>
                                    You can write a bit about yourself and your
                                    work.
                                </p>

                                <p
                                    className="bio-btn"
                                    onClick={() => setBioState("save")}
                                >
                                    Add
                                </p>
                            </>
                        );

                    case "save":
                        return (
                            <>
                                <textarea
                                    name="bioText"
                                    id="bioText"
                                    cols="30"
                                    rows="10"
                                    value={bioText}
                                    onChange={addBioText}
                                ></textarea>
                                <p className="bio-btn" onClick={saveBioData}>
                                    Save
                                </p>
                            </>
                        );
                    case "edit":
                        return (
                            <>
                                <p>{bioText}</p>
                                <p className="bio-btn" onClick={editBioHandler}>
                                    Edit Bio
                                </p>
                            </>
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
export default BioEditor;
