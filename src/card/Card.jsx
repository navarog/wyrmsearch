import React from "react";
import DragonCard from "./DragonCard";
import VP from "../assets/icons/VP.svg";

function highlightText(
  text,
  highlights = ["AGGRESSIVE", "PLAYFUL", "HELPFUL", "SHY"]
) {
  let parts = text.split(new RegExp(`(${highlights.join("|")})`, "gi"));
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

function renderImagesInText(text, splitSentences = false) {
  if (!text) {
    return text;
  }

  const parts = text.split(/\[(.*?)\]/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
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
    return part.split(/\*(.*?)\*/).map((part, index) => {
      return index % 2 === 0 ? (
        <span key={index}>{highlightText(part)}</span>
      ) : (
        <strong key={index}>{part}</strong>
      );
    });
  });
}

const Card = ({ data }) => {
  if (data.type === "Dragon") {
    return DragonCard({ data });
  }
};

export { renderImagesInText };
export default Card;
