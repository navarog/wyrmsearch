import React from "react";
import DragonCard from "./DragonCard";
import CaveCard from "./CaveCard";
import VP from "../assets/icons/VP.svg";

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

const Card = ({ data }) => {
  if (data.type === "Dragon") {
    return DragonCard({ data });
  }

  if (data.type === "Cave") {
    return CaveCard({ data });
  }
};

export default Card;
