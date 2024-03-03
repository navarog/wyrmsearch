import "./DragonCard.css";
import { renderImagesInText } from "./Card";
import VP from "../assets/icons/VP.svg";
import EggCapacity from "../assets/icons/EggCapacity.svg";

function costToIcons(data) {
  const costFields = ["Coin", "Meat", "Gold", "Crystal", "Egg", "Milk"];
  const finalCost = [];
  costFields.forEach((field) => {
    for (let i = 0; i < data[field]; i++) {
      finalCost.push(field);
    }
  });
  if (finalCost.length === 0) {
    finalCost.push("NoResourceCost");
  }
  return finalCost.map((part, index) => {
    return (
      <img
        className="cost-icon"
        key={index}
        src={require(`../assets/icons/${part}.svg`)}
        alt={part}
      />
    );
  });
}

const DragonCard = ({ data }) => {
  return (
    <div className="card">
      <img
        className="lines-image"
        src={require(`../assets/DragonLines.png`)}
        alt="lines"
      />
      <div className="upper-container">{data.name.toUpperCase()}</div>
      <div className="middle-container">
        <div className="left-column">
          <div className="cost">{costToIcons(data)}</div>
          <div className="habitats">
            <div
              className={
                data["Crimson Cavern"] ? "crimson-habitat" : "empty-habitat"
              }
            />
            <div
              className={
                data["Golden Grotto"] ? "golden-habitat" : "empty-habitat"
              }
            />
            <div
              className={
                data["Amethyst Abyss"] ? "amethyst-habitat" : "empty-habitat"
              }
            />
          </div>
          <div className="number">{data.number}</div>
        </div>
        <div className="right-column">
          <div className="VP">
            <img src={VP} alt="VP" />
            <div className="VP-value">{data.VP}</div>
          </div>
          <div className="size">{data.size.toUpperCase()}</div>
          <div className="eggs">
            {Array(Number(data.capacity))
              .fill(0)
              .map((_, index) => (
                <img
                  className="egg-icon"
                  key={index}
                  src={EggCapacity}
                  alt="Egg"
                />
              ))}
          </div>
          <img
            className="personality"
            src={require(`../assets/icons/${data.personality}.svg`)}
            alt={data.personality}
          />
        </div>
      </div>
      <div className="lower-container">
        <div className="ability">
          {data.size === "Hatchling" ? (
            <div>
              {data.ability
                .trim()
                .split(/([^.]+\.?)/)
                .filter(Boolean)
                .map(
                  (sentence, index) =>
                    sentence && (
                      <div key={index}>
                        {index > 0 && (
                          <div className="divider"></div>
                        )}
                         <div className="ability-hatchling">
                        {data.abilityType.split(", ").length > index && (
                          <img
                            className="hatchling-ability-icon"
                            src={require(`../assets/icons/${
                              data.abilityType.split(", ")[index]
                            }.svg`)}
                            alt={data.abilityType}
                          />
                        )}
                        <div className="hatchling-ability-text">{renderImagesInText(sentence)}</div>
                        </div>
                      </div>
                    )
                )}
            </div>
          ) : (
            <>
              <img
                className="ability-icon"
                src={require(`../assets/icons/${data.abilityType}.svg`)}
                alt={data.abilityType}
              />
              <div>{renderImagesInText(data.ability)}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragonCard;
