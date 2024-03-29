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
    };

    const otherCreatorModalToggle = (id) => {
        setOtherCreatorModal(!otherCreatorToggle);
        setOtherCreatorId(id);
    };

    const closeModalCallBack = () => {
        setOtherCreatorModal(!otherCreatorToggle);
    };

    // get the latest 3 creators
    useEffect(() => {
        async function fetchCreators() {
            try {
                const response = await fetch("/api/creators");
                const result = await response.json();

                if (result.success == true) {
                    setCreators([...result.creatorsData]);
                } else {
                    setError(result.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchCreators();
    }, []);

    // get creators by name -incremental search
    useEffect(() => {
        async function fetchCreatorsByName() {
            try {
                const response = await fetch(`/api/creators/${searchQuery}`);
                const result = await response.json();
                if (result.success == true) {
                    setCreators([...result.creatorsData]);
                    //console.log(result.creatorsData);
                } else {
                    setError(result.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchCreatorsByName();
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
                        imgUrl={
                            creator.img_url
                                ? creator.img_url
                                : "/images/placeholder.png"
                        }
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
