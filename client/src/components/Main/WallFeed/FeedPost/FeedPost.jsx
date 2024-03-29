// FEED-POST COMPONENT
//Component to render the uploaded image, title, and user name.

function FeedPost(props) {
    return (
        <>
            <div className="card-container">
                <div className="card-img">
                    {/* <div className="heart">
                        <span className="material-symbols-outlined">
                            favorite
                        </span>
                    </div> */}
                    <img src={props.imgUrl} alt="" />
                </div>

                <div className="card-desc">
                    <p className="post-title">{props.title}</p>
                    <div className="creator-details">
                        <img
                            src={
                                props.profilePicUrl
                                    ? props.profilePicUrl
                                    : "/images/placeholder.png"
                            }
                            alt="profile picture"
                        />
                        <p className="creator-name">
                            {props.firstName} {props.lastName}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default FeedPost;
