import "./DragonCard.css";
import {renderImagesInText} from "./Card";

const DragonCard = ({ data }) => {
    return (
        <div className="card">
          <div className="name">
            {data.name.toUpperCase()}
          </div>
          <div className="middle-container"></div>
          <div className="lower-container">
            <div className="ability">
              <div>{renderImagesInText(data.ability)}</div>
            </div>
          </div>
        </div>
      );
};

export default DragonCard;