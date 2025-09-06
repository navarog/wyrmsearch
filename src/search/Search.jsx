import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import FlexSearch from "flexsearch";
import { useEffect, useState, useMemo } from "react";
import "./Search.css";
import DragonCard from "../assets/icons/DragonCard.svg";
import CaveCard from "../assets/icons/CaveCard.svg";
import Shy from "../assets/icons/Shy.svg";
import Playful from "../assets/icons/Playful.svg";
import Helpful from "../assets/icons/Helpful.svg";
import Aggressive from "../assets/icons/Aggressive.svg";

const cardIndex = FlexSearch.Document({
  tokenize: "full",
  document: {
    id: "id",
    index: ["name", "ability", "number"],
  },
});

import("../assets/cards.json").then((cards) => {
  cards.default
    .sort((a, b) => a.id - b.id)
    .forEach((card) => cardIndex.add(card));
});

const fields = [
  "type",
  "size",
  "abilityType",
  "Crimson Cavern",
  "Golden Grotto",
  "Amethyst Abyss",
  "personality",
  "expansion",
];

export function handleSearch(state, query) {
  const searchedIds = query.text
    ? [
        ...new Set(
          cardIndex
            .search(query.text)
            .reduce((acc, item) => [...acc, ...item.result], [])
        ),
      ]
    : state.allCards.map((card) => card.id);
  const filteredIds = searchedIds.filter((id) => {
    const card = state.allCards[id];
    return query.type[card.type] && 
           (query.personality[card.personality] || card.type === "Cave") &&
           query.expansion[card.expansion];
  });

  return { ...state, filteredCardIds: filteredIds.sort((a, b) => a - b) };
}

function Search({ cardState, triggerSearch }) {
  const defaultQuery = {
    text: "",
    type: {
      Dragon: true,
      Cave: true,
    },
    personality: {
      Shy: true,
      Playful: true,
      Helpful: true,
      Aggressive: true,
    },
    expansion: {
      base: true,
      academy: true,
    },
  };
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    triggerSearch(query);
  }, [query, triggerSearch]);

  const stats = useMemo(() => {
    return cardState.filteredCardIds
      .map((id) => cardState.allCards[id])
      .reduce(
        (acc, card) => {
          fields.forEach((field) => {
            if (!acc[field][card[field]]) acc[field][card[field]] = 0;
            acc[field][card[field]]++;
          });
          return acc;
        },
        fields.reduce((obj, field) => ({ ...obj, [field]: {} }), {})
      );
  }, [cardState]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Acumin Pro Condensed', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="search-container">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div className="search-summary">
              <TextField
                variant="standard"
                label="Search the dragon and cave cards"
                className="search-input"
                value={query.text}
                onChange={(e) => setQuery({ ...query, text: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search the cards by its ability, title or number"
              />
              <div className="search-count-container">
                <Tooltip title="Filter out all dragon cards">
                  <div
                    className={`search-count ${
                      query.type.Dragon ? "" : "disabled"
                    }`}
                    onClick={(e) => {
                      setQuery({
                        ...query,
                        type: { ...query.type, Dragon: !query.type.Dragon },
                      });
                      e.stopPropagation();
                    }}
                  >
                    {stats.type.Dragon || 0}
                    <img src={DragonCard} alt="Dragon Cards" />
                  </div>
                </Tooltip>
                <Tooltip title="Filter out all cave cards">
                  <div
                    className={`search-count ${
                      query.type.Cave ? "" : "disabled"
                    }`}
                    onClick={(e) => {
                      setQuery({
                        ...query,
                        type: { ...query.type, Cave: !query.type.Cave },
                      });
                      e.stopPropagation();
                    }}
                  >
                    {stats.type.Cave || 0}
                    <img src={CaveCard} alt="Cave Cards" />
                  </div>
                </Tooltip>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="search-details">
              <Tooltip title="Filter out cards by personality">
                <div className="row">
                  <img
                    src={Shy}
                    alt="Shy"
                    className={`personality ${
                      query.personality.Shy ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      setQuery({
                        ...query,
                        personality: {
                          ...query.personality,
                          Shy: !query.personality.Shy,
                        },
                      })
                    }
                  />
                  <img
                    src={Playful}
                    alt="Playful"
                    className={`personality ${
                      query.personality.Playful ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      setQuery({
                        ...query,
                        personality: {
                          ...query.personality,
                          Playful: !query.personality.Playful,
                        },
                      })
                    }
                  />
                  <img
                    src={Helpful}
                    alt="Helpful"
                    className={`personality ${
                      query.personality.Helpful ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      setQuery({
                        ...query,
                        personality: {
                          ...query.personality,
                          Helpful: !query.personality.Helpful,
                        },
                      })
                    }
                  />
                  <img
                    src={Aggressive}
                    alt="Aggressive"
                    className={`personality ${
                      query.personality.Aggressive ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      setQuery({
                        ...query,
                        personality: {
                          ...query.personality,
                          Aggressive: !query.personality.Aggressive,
                        },
                      })
                    }
                  />
                </div>
              </Tooltip>
              <div className="row" style={{ marginTop: '10px' }}>
                <label style={{ marginRight: '10px', fontSize: '14px' }}>Expansion:</label>
                <button
                  className={`expansion-filter ${query.expansion.base ? "" : "disabled"}`}
                  onClick={() =>
                    setQuery({
                      ...query,
                      expansion: {
                        ...query.expansion,
                        base: !query.expansion.base,
                      },
                    })
                  }
                  style={{
                    marginRight: '8px',
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: query.expansion.base ? '#007bff' : '#f8f9fa',
                    color: query.expansion.base ? 'white' : '#333',
                    cursor: 'pointer',
                  }}
                >
                  Base ({stats.expansion?.base || 0})
                </button>
                <button
                  className={`expansion-filter ${query.expansion.academy ? "" : "disabled"}`}
                  onClick={() =>
                    setQuery({
                      ...query,
                      expansion: {
                        ...query.expansion,
                        academy: !query.expansion.academy,
                      },
                    })
                  }
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: query.expansion.academy ? '#28a745' : '#f8f9fa',
                    color: query.expansion.academy ? 'white' : '#333',
                    cursor: 'pointer',
                  }}
                >
                  Academy ({stats.expansion?.academy || 0})
                </button>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </ThemeProvider>
  );
}

export default Search;
