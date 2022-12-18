function ProfilePicture(props) {
    return (
        <>
            <div className="profile-picture">
                <img
                    src={props.imgUrlHandler}
                    alt="profile-picture"
                    onClick={props.openModalHandler}
                />
                <span className="online-badge"></span>
            </div>
        </>
    );
}

export default ProfilePicture;
