import { useState } from "react";
import "./AiSpace.css";
import { ThreeDots } from "react-loader-spinner";

function AiSpace() {
    const [creatorPrompt, setCreatorPrompt] = useState("");
    const [resultUrl, setResultUrl] = useState();
    const [loading, setLoadingState] = useState(false);

    const addPromptTxt = (e) => {
        setCreatorPrompt(e.target.value);
    };
    const sendCreatorPrompt = () => {
        //console.log(creatorPrompt);
        setLoadingState(true);
        fetch("/api/collabspace/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ creatorPrompt }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setLoadingState(false);
                setResultUrl(res.url);
            })
            .catch((err) => {
                console.log("error here :(", err);
            });
    };

    return (
        <div className="collabspace-ai-container">
            <div className="ai-prompt-txtarea">
                <h3>Write your prompt here</h3>
                <textarea
                    name="creatorPrompt"
                    id="creatorPrompt"
                    cols="30"
                    rows="10"
                    value={creatorPrompt}
                    onChange={addPromptTxt}
                ></textarea>
                <p className="bio-btn" onClick={sendCreatorPrompt}>
                    Create
                </p>
            </div>
            <div className="ai-output-container">
                <div className="ai-img-container">
                    <img src={resultUrl} alt="" />
                </div>
            </div>
            {loading == true && (
                <div className="loading-spinner">
                    <ThreeDots
                        height="120"
                        width="120"
                        radius="9"
                        color="var(--accentColor)"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                </div>
            )}
        </div>
    );
}
export default AiSpace;
