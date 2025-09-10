import "./DragonCard.css";
import { renderText, renderFledglingAbility } from "./Card";
import VP from "../assets/icons/VP.svg";
import EggCapacity from "../assets/icons/EggCapacity.svg";
import BlueStar from "../assets/icons/BlueStar.svg";
import ExpansionIndicator from "./ExpansionIndicator";
import shyBackground from "../assets/card-backgrounds/dragon-card-background-shy.png";
import playfulBackground from "../assets/card-backgrounds/dragon-card-background-playful.png";
import helpfulBackground from "../assets/card-backgrounds/dragon-card-background-helpful.png";
import aggressiveBackground from "../assets/card-backgrounds/dragon-card-background-aggressive.png";

const backgroundMap = {
  shy: shyBackground,
  playful: playfulBackground,
  helpful: helpfulBackground,
  aggressive: aggressiveBackground
};

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
  
  const costIcons = finalCost.map((part, index) => {
    return (
      <img
        className="cost-icon"
        key={index}
        src={require(`../assets/icons/${part}.svg`)}
        alt={part}
      />
    );
  });

  // Add slash and BlueStar if ignoreCost is "x"
  if (data.ignoreCost === "x") {
    return (
      <>
        {costIcons}
        <span className="cost-slash">/</span>
        <img
          className="cost-icon"
          src={BlueStar}
          alt="Ignore Cost"
        />
      </>
    );
  }

  return costIcons;
}

function renderAbilityWithIgnoreCost(text, abilityType, ignoreCost) {
  if (ignoreCost === "x") {
    // Find the first sentence ending with a dot
    const dotIndex = text.indexOf('.');
    if (dotIndex !== -1) {
      const firstSentence = text.substring(0, dotIndex + 1);
      const remainingText = text.substring(dotIndex + 1).trim();
      
      return (
        <div className="ability-ignore-cost">
          <div className="ability-first-sentence">
            <img
              className="ability-star-icon"
              src={BlueStar}
              alt="Ignore Cost"
            />
            <div className="first-sentence-text">{renderText(firstSentence)}</div>
          </div>
          {remainingText && (
            <div className="ability-remaining-text">
              <img
                className="ability-icon"
                src={require(`../assets/icons/${abilityType}.svg`)}
                alt={abilityType}
              />
              <div>{renderText(remainingText)}</div>
            </div>
          )}
        </div>
      );
    }
  }
  
  // Default rendering for non-ignore cost or text without dots
  return (
    <div className="ability-default">
      <img
        className="ability-icon"
        src={require(`../assets/icons/${abilityType}.svg`)}
        alt={abilityType}
      />
      <div>{renderText(text)}</div>
    </div>
  );
}

const DragonCard = ({ data }) => {
  const backgroundImage = backgroundMap[data.personality.toLowerCase()];
  return (
    <div className="dragon-card" style={{ backgroundImage: `url("${backgroundImage}")` }}>
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
          {data.size === "Fledgling" && (
            <div className="per-text">per</div>
          )}
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
        </div>
      </div>
      <div className={data.size === "Fledgling" ? "lower-container fledgling" : "lower-container"}>
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
                        <div className="hatchling-ability-text">{renderText(sentence)}</div>
                        </div>
                      </div>
                    )
                  )}
            </div>
          ) : data.size === "Fledgling" ? (
            <>
              {renderFledglingAbility(data.ability, data.abilityType)}
            </>
          ) : (
            <>
              {renderAbilityWithIgnoreCost(data.ability, data.abilityType, data.ignoreCost)}
            </>
          )}
        </div>
      </div>
      <ExpansionIndicator expansion={data.expansion} variant="dragon" />
    </div>
  );
};

export default DragonCard;
