import { useState, useEffect } from "react";
import "./AiSpace.css";
import { ThreeDots } from "react-loader-spinner";

function AiSpace() {
    const [creatorPrompt, setCreatorPrompt] = useState("");
    const [resultUrl, setResultUrl] = useState();
    const [loading, setLoadingState] = useState(false);
    const [count, setCount] = useState(0);
    const [error, setError] = useState("");

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
                setCount(res.count);
                if (res.error) {
                    setError(res.error);
                }
            })
            .catch((err) => {
                console.log("error here :(", err);
            });
    };

    useEffect(() => {
        fetch(`/api/ai/count`)
            .then((result) => result.json())
            .then((result) => {
                console.log(result.count.count);
                if (result.count.count) {
                    setCount(result.count.count);
                } else {
                    setCount(0);
                }
            });
    }, []);

    return (
        <div className="collabspace-ai-container">
            <h3>Image generation using AI (TEXT TO IMAGE)</h3>
            <p>
                Since it's a beta version, There is a limit of 10 prompts per
                user. ({count}/10) <span className="error">{error}</span>
            </p>
            <div className="ai-prompt-txtarea">
                <textarea
                    name="creatorPrompt"
                    id="creatorPrompt"
                    value={creatorPrompt}
                    onChange={addPromptTxt}
                    placeholder="Write your prompt here"
                    autoCorrect="on"
                    autoComplete="on"
                ></textarea>
                <p className="bio-btn" onClick={sendCreatorPrompt}>
                    Create
                </p>
            </div>
            <div className="ai-output-container">
                <div className="ai-img-container">
                    <div className="ai-image-notes">
                        <p>Generated Image will appear here</p>
                        <p>
                            Image link will expire in one hour, if you would
                            like to keep your image please save it.
                        </p>
                    </div>
                    <img src={resultUrl} alt="" />
                    {loading == true && (
                        <div className="loading-spinner">
                            <ThreeDots
                                height="150"
                                width="150"
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
            </div>
        </div>
    );
}
export default AiSpace;
