import { useState } from "react";
import { useDispatch } from "react-redux";
import { addLastPost } from "../../../../redux/features/posts/postsSlice";
import "./PostUploader.css";

import { ThreeDots } from "react-loader-spinner";

function PostUploader(props) {
    const [error, setError] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [postDesc, setPostDesc] = useState("");
    const [loading, setLoadingState] = useState(false);

    const handlePostTitleChange = (e) => {
        setPostTitle(e.target.value);
    };
    const handlePostDescChange = (e) => {
        setPostDesc(e.target.value);
    };

    const dispatch = useDispatch();

    // fetch image data to server to be saved on AWS and url to db
    const uploadImage = (e) => {
        e.preventDefault();
        setLoadingState(true);
        console.log("user trying to upload an img");
        const file = document.querySelector("input[type=file]").files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("postTitle", postTitle);
        formData.append("postDesc", postDesc);

        console.log(formData);

        if (!file) {
            setError("Please upload an image!");
            return;
        }

        fetch("/api/postImgUpload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                //console.log(res.postData);
                if (res.postData) {
                    dispatch(addLastPost(res.postData));
                    setLoadingState(false);
                    props.closeUploaderModal();
                    setPostTitle("");
                    setPostDesc("");
                    setError("");
                } else {
                    setError("Something went wrong.");
                }
                //setImgUrl(res.img_url);
            })
            .catch((err) => {
                console.log(err);
                setError("Something went wrong.");
            });
    };

    return (
        <div className="img-upload-container">
            <form action="">
                <input
                    type="file"
                    name="photo"
                    accept="image/png, image/jpeg"
                />
                <input
                    type="text"
                    placeholder="Post title"
                    name="postTitle"
                    value={postTitle}
                    onChange={handlePostTitleChange}
                />
                <input
                    type="text"
                    placeholder="Post description"
                    name="postDesc"
                    value={postDesc}
                    onChange={handlePostDescChange}
                />
                <input
                    type="submit"
                    className="btn-submit"
                    value="Post"
                    onClick={uploadImage}
                />

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
            </form>
            <p className="form-error">{error}</p>
        </div>
    );
}
export default PostUploader;
