import React, { useState } from "react";
import "./App.css";
import cards from "./assets/cards.json";
import Card from "./card/Card";
import FlexSearch from "flexsearch"

const cardIndex = FlexSearch.Document({
  tokenize: "full",
  document: {
    id: "id",
    index: ["name", "ability", "number"],
  },
});

import("./assets/cards.json").then((cards) => {
  cards.default.forEach((card) => cardIndex.add(card))
});


function App() {
  const [searchValue, setSearchValue] = useState("");
  const [displayedCards, setDisplayedCards] = useState(cards);
  
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (!value) {
      setDisplayedCards(cards);
      return;
    }
    const filteredList = cardIndex.search(value, { enrich: true }).reduce((acc, item) => [...acc, ...item.result], []);
    const sortedList = [...new Set(filteredList)].sort((a, b) => a - b);
    setDisplayedCards(sortedList.map((id) => cards[id]));
  };

  return (
    <div className="App">
      <div className="search-container">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        placeholder="Search the cards..."
      />
      </div>
      <div className="cards-container">
        {displayedCards.map((item) => (
          <Card
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
