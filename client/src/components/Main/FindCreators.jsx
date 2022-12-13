import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import CreatorCard from "./CreatorCard/CreatorCard";
import OtherCreatorProfile from "./OtherCreatorProfile/OtherCreatorProfile";
import { useDispatch } from "react-redux";
import { activateNavBar } from "../../redux/features/navBar/navBarSlice";

function FindCreators() {
    const [creators, setCreators] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [otherCreatorToggle, setOtherCreatorModal] = useState(false);
    const [otherCreatorId, setOtherCreatorId] = useState();

    //highlight nav-bar link when the component get mounted
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(activateNavBar("creators"));
        return function deactivateNavBar() {
            dispatch(activateNavBar(""));
        };
    }, []);

    const searchBarCallBack = (childData) => {
        setSearchQuery(childData);
        console.log(searchQuery);
    };

    const otherCreatorModalToggle = (id) => {
        setOtherCreatorModal(!otherCreatorToggle);
        setOtherCreatorId(id);
        console.log("user clicked");
    };

    const closeModalCallBack = () => {
        setOtherCreatorModal(!otherCreatorToggle);
    };

    // get the latest 3 creators
    useEffect(() => {
        fetch("/api/creators")
            .then((result) => result.json())
            .then((result) => {
                //console.log(result);
                if (result.success == true) {
                    setCreators([...result.creatorsData]);
                    //console.log(result.creatorsData);
                } else {
                    setError(result.error);
                }
            });
    }, []);

    // get creators by name -incremental search
    useEffect(() => {
        fetch(`/api/creators/${searchQuery}`)
            .then((result) => result.json())
            .then((result) => {
                //console.log(result);
                if (result.success == true) {
                    setCreators([...result.creatorsData]);
                    //console.log(result.creatorsData);
                } else {
                    setError(result.error);
                }
            });
    }, [searchQuery]);

    return (
        <>
            <div className="search-area">
                <SearchBar findCreatorsCallBack={searchBarCallBack} />
            </div>
            <div className="creators-container">
                {creators.map((creator) => (
                    <CreatorCard
                        key={creator.id}
                        id={creator.id}
                        firstName={creator.first_name}
                        lastName={creator.last_name}
                        imgUrl={creator.img_url}
                        openCreatorProfileCallBack={otherCreatorModalToggle}
                    />
                ))}
            </div>

            {otherCreatorToggle == true && (
                <OtherCreatorProfile
                    creatorId={otherCreatorId}
                    closeModalCallBack={closeModalCallBack}
                />
            )}
        </>
    );
}
export default FindCreators;
