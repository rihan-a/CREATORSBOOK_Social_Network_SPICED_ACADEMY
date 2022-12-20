import { useSelector } from "react-redux";
import "./OnlineCreators.css";
import CollabsCard from "../CollabsCard";

function OnlineCreators() {
    // get Id of the logged in Creator
    const loggedInCreatorId = useSelector((state) => {
        return state.loggedInUserData.userData.id;
    });

    // get Online creators data from redux
    const onlineCreatorsList = useSelector((state) => {
        return (
            state.onlineCreators.creatorsDataList &&
            state.onlineCreators.creatorsDataList.filter(
                (creator) => creator.id != loggedInCreatorId
            )
        );
    });
    //console.log(onlineCreatorsList);

    return (
        <div className="online-container">
            <h3>ONLINE CREATORS ({onlineCreatorsList.length})</h3>

            <div className="creators-container">
                {onlineCreatorsList.map((creator) => {
                    return (
                        <div
                            className="creator-card"
                            key={creator.id}
                            id={creator.id}
                        >
                            <CollabsCard
                                key={creator.id}
                                id={creator.id}
                                firstName={creator.first_name}
                                lastName={creator.last_name}
                                online={true}
                                imgUrl={
                                    creator.img_url
                                        ? creator.img_url
                                        : "/images/placeholder.png"
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default OnlineCreators;
