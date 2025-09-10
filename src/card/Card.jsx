import React from "react";
import DragonCard from "./DragonCard";
import CaveCard from "./CaveCard";
import VP from "../assets/icons/VP.svg";
import Adventurer from "../assets/icons/Adventurer.svg";
import Book from "../assets/icons/Book.svg";
import FledglingArrow from "../assets/icons/FledglingArrow.svg";

function highlightText(
  text,
  highlights = ["AGGRESSIVE", "PLAYFUL", "HELPFUL", "SHY"]
) {
  let parts = text.split(new RegExp(`(${highlights.join("|")})`, "gi")).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        if (highlights.includes(part)) {
          return (
            <span key={index} className={`highlight-${part.toLowerCase()}`}>
              {part}
            </span>
          );
        } else {
          return part;
        }
      })}
    </>
  );
}

export function renderText(text) {
  if (!text) {
    return text;
  }

  // First split by <br> tags to handle line breaks
  const lines = text.split('<br>');
  
  return lines.map((line, lineIndex) => (
    <React.Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {renderTextLine(line)}
    </React.Fragment>
  ));
}

function renderTextLine(text) {
  const parts = text.split(/(\[.*?\])|(\*.*?\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.match(/^\[.*?\]$/)) {
      part = part.slice(1, -1);
      if (part.startsWith("VP")) {
        return (
          <span key={index} className="vp-span">
            {part.replace("VP-", "")}
            <img className="text-icon" key={index} src={VP} alt="VP" />
          </span>
        );
      }
      return (
        <img
          className="text-icon"
          key={index}
          src={require(`../assets/icons/${part}.svg`)}
          alt={part}
        />
      );
    }

    if (part.match(/^\*.*?\*$/)) {
      part = part.slice(1, -1);
      return <strong key={index}>{part}</strong>
    }

    return <span key={index}>{highlightText(part)}</span>;
  });
}

export function renderFledglingAbility(text, abilityType) {
  if (!text || !text.includes('<br>')) {
    return renderText(text);
  }

  const [resourceLine, effectLine] = text.split('<br>');
  
  // Extract resources from the first line
  const resourceMatches = resourceLine.match(/\[([^\]]+)\]/g) || [];
  const resources = resourceMatches.map(match => match.slice(1, -1));

  return (
    <div className="fledgling-ability">
      <div className="fledgling-resource-line">
        <img
          className="text-icon adventurer-icon"
          src={Adventurer}
          alt="Adventurer"
        />
        <div className="right-aligned-icons">
          <img
            className="text-icon"
            src={Book}
            alt="Book"
          />
          <img
            className="fletching-arrow"
            src={FledglingArrow}
            alt="Arrow"
          />
          <div className="resource-chain">
            {resources.map((resource, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <img
                    className="fletching-arrow"
                    src={FledglingArrow}
                    alt="Arrow"
                  />
                )}
                <div className="resource-item">
                  <img
                    className="text-icon"
                    src={require(`../assets/icons/${resource}.svg`)}
                    alt={resource}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="fledgling-effect-line">
        <img
          className="text-icon ability-type-icon"
          src={require(`../assets/icons/${abilityType}.svg`)}
          alt={abilityType}
        />
        <span className="effect-text">{renderTextLine(effectLine)}</span>
      </div>
    </div>
  );
}

const Card = ({ data }) => {
  if (data.type === "Dragon") {
    return DragonCard({ data });
  }

  if (data.type === "Cave") {
    return CaveCard({ data });
  }
};

export default Card;
