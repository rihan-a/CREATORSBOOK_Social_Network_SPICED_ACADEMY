function ProfilePicture(props) {
    return (
        <>
            <div className="profile-picture">
                <img
                    src={props.imgUrlHandler}
                    alt="profile-picture"
                    onClick={props.openModalHandler}
                />
            </div>
        </>
    );
}

export default ProfilePicture;
