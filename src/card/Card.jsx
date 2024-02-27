import React from "react";
import DragonCard from "./DragonCard";
import VP from "../assets/icons/VP.svg";

function highlightText(
  text,
  highlights = ["AGGRESSIVE", "PLAYFUL", "HELPFUL", "SHY"]
) {
  let parts = [text];
  let newParts = [];
  for (const highlight of highlights) {
    for (const part of parts) {
      const splits = part.split(new RegExp(`(${highlight})`, "gi"));
      newParts.push(splits);
    }
    parts = newParts.flat();
    newParts = [];
  }
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
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
            <img className="text-icon" key={index} src={VP} alt="VP" />
            {part.replace("VP-", "")}
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
        highlightText(part)
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
