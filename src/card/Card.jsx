import React from "react";
import DragonCard from "./DragonCard";
// import "./Card.css";

function renderImagesInText(text, splitSentences = false) {
  if (!text) {
    return text;
  }

  const parts = text.split(/\[(.*?)\]/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      if (part.startsWith("VP")) {
        part = "VP"
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
      return index % 2 === 0 ? part : <strong key = {index}>{part}</strong>;
    }); // TODO add special highlight for the personalities and tidy up the code
  });
}

const Card = ({ data }) => {
  if (data.type === "Dragon") {
    return DragonCard({ data });
  }
};

export { renderImagesInText };
export default Card;
