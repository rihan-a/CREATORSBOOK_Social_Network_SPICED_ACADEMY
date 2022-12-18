import "./CreatorCard.css";

function CreatorCard(props) {
    const openCreatorProfile = (e) => {
        props.openCreatorProfileCallBack(e.target.id);
        //console.log(e.target.id);
    };

    return (
        <>
            <div
                className="creator-card"
                id={props.id}
                onClick={openCreatorProfile}
            >
                <div className="creator-img-container">
                    <img
                        className="creator-img"
                        src={props.imgUrl}
                        id={props.id}
                        alt="profile picture"
                    />
                </div>
                <h4 className="creator-name">
                    {props.firstName} {props.lastName}
                    {props.online && <span className="online-badge"></span>}
                </h4>
            </div>
        </>
    );
}

export default CreatorCard;
