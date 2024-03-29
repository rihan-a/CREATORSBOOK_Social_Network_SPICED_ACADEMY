import { useEffect, useState } from "react";
import FeedPost from "./FeedPost/FeedPost";
import PostUploader from "./PostUploader/PostUploader";
import { getPosts } from "../../../redux/features/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { activateNavBar } from "../../../redux/features/navBar/navBarSlice";
import "./WallFeed.css";

function WallFeed() {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [uploaderModalToggle, setUploaderModal] = useState(false);

    const uploaderModalHandler = () => {
        setUploaderModal(!uploaderModalToggle);
    };

    //highlight nav-bar link when the component get mounted
    useEffect(() => {
        dispatch(activateNavBar("feed"));
        return function deactivateNavBar() {
            dispatch(activateNavBar(""));
        };
    }, []);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch("/api/posts");
                const result = await response.json();
                if (result.success == true) {
                    dispatch(getPosts(result.postsData));
                } else {
                    setError(result.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchPosts();
    }, []);

    const postsList = useSelector((state) => {
        return state.posts.postsList && state.posts.postsList;
    });

    return (
        <>
            <div className="post-btn-container">
                <div className="post-btn" onClick={uploaderModalHandler}>
                    <span
                        className={
                            uploaderModalToggle
                                ? "material-symbols-outlined rotate"
                                : "material-symbols-outlined"
                        }
                    >
                        add
                    </span>
                </div>
            </div>

            <div className="feed-container">
                {postsList.map((post) => {
                    return (
                        <FeedPost
                            key={post.id}
                            //id={post.id}
                            firstName={post.first_name}
                            lastName={post.last_name}
                            profilePicUrl={post.img_url}
                            imgUrl={post.url}
                            title={post.title}
                            desc={post.desc}
                            createdAt={post.created_at}
                        />
                    );
                })}
            </div>
            <p>{error}</p>
            {uploaderModalToggle == true && (
                <PostUploader closeUploaderModal={uploaderModalHandler} />
            )}
        </>
    );
}
export default WallFeed;
