function ImageUploader(props) {
    const uploadImgHandler = () => {
        props.uploadImgHandler();
        props.closeUploadModal();
    };

    return (
        <>
            <div className="modal-uploader">
                <p>Upload profile picture</p>
                <input
                    className="upload-file"
                    id="profile-pic-file"
                    type="file"
                    accept="image/png, image/jpeg"
                />

                <input
                    className="upload-btn"
                    type="button"
                    onClick={uploadImgHandler}
                    value="Upload"
                />
                <div>{props.errorHandler}</div>
            </div>
        </>
    );
}
export default ImageUploader;
