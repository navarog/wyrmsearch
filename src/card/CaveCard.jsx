import "./CaveCard.css";
import { renderText } from "./Card";

const CaveCard = ({ data }) => {
  return (
    <div className="cave-card">
      <div className="number">{data.number}</div>
      <div className="container">
        <img
          className="ability-icon"
          src={require(`../assets/icons/${data.abilityType}.svg`)}
          alt={data.abilityType}
        />
        <div className="ability-text">{renderText(data.ability)}</div>
      </div>
    </div>
  );
};

export default CaveCard;
