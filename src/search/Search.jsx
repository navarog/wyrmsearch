import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SortIcon from "@mui/icons-material/Sort";
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
import {
  DragonCard,
  CaveCard,
  Shy,
  Playful,
  Helpful,
  Aggressive,
  Egg,
  Milk,
  Meat,
  Gold,
  Crystal,
  Coin,
  NoResourceCost,
  BlueStar,
  Adventurer,
  WhenPlayed,
  EndGame,
  OncePerRound,
} from "@/assets";
import cards from "@/assets/cards.json";

const cardIndex = FlexSearch.Document({
  tokenize: "full",
  document: {
    id: "id",
    index: ["name", "ability", "number"],
  },
});

cards
  .sort((a, b) => a.sort_id - b.sort_id)
  .forEach((card) => cardIndex.add(card));

const fields = [
  "type",
  "size",
  "abilityType",
  "Crimson Cavern",
  "Golden Grotto",
  "Amethyst Abyss",
  "personality",
  "expansion",
  "hasEgg",
  "hasMilk",
  "hasMeat",
  "hasGold",
  "hasCrystal",
  "hasCoin",
  "hasNoResourceCost",
  "hasIgnoreCost",
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
    const card = state.allCardsById[id];
    
    // Type filter
    if (!query.type[card.type]) return false;
    
    // Personality filter (only for Dragon cards)
    if (card.type === "Dragon" && !query.personality[card.personality]) return false;
    
    // Expansion filter
    if (!query.expansion[card.expansion]) return false;
    
    // Size filter
    if (card.size && !query.size[card.size]) return false;
    
    // Check for ignoreCost flag
    const hasIgnoreCost = card.ignoreCost === "x" || card.ignoreCost === true;
    
    // If card has ignoreCost and IgnoreCost filter is off, exclude it
    if (hasIgnoreCost && !query.resource.IgnoreCost) return false;
    
    // Resource filter - check if card has no resource cost
    const hasNoResourceCost = !card.Egg && !card.Milk && !card.Meat && !card.Gold && !card.Crystal && !card.Coin && !hasIgnoreCost;
    
    // If the card has no resource cost and NoResourceCost filter is off, exclude it
    if (hasNoResourceCost && !query.resource.NoResourceCost) return false;
    
    // If the card has resources (and not ignoreCost), check if those specific resources are enabled
    if (!hasNoResourceCost && !hasIgnoreCost) {
      if (card.Egg && !query.resource.Egg) return false;
      if (card.Milk && !query.resource.Milk) return false;
      if (card.Meat && !query.resource.Meat) return false;
      if (card.Gold && !query.resource.Gold) return false;
      if (card.Crystal && !query.resource.Crystal) return false;
      if (card.Coin && !query.resource.Coin) return false;
    }
    
    // Ability type filter
    const cardAbilityTypes = card.abilityType ? card.abilityType.split(", ") : [];
    const selectedAbilityTypes = Object.keys(query.abilityType).filter(key => query.abilityType[key]);
    if (selectedAbilityTypes.length > 0 && card.type === "Dragon") {
      const hasMatchingAbility = selectedAbilityTypes.some(selectedType => 
        cardAbilityTypes.some(cardType => cardType.includes(selectedType))
      );
      if (!hasMatchingAbility) return false;
    }
    
    // Cave filter - if multiple caves selected, card must have ALL selected caves
    const selectedCaves = Object.keys(query.cave).filter(key => query.cave[key]);
    if (selectedCaves.length > 0 && card.type === "Dragon") {
      const hasAllCaves = selectedCaves.every(cave => card[cave] === "x");
      if (!hasAllCaves) return false;
    }
    
    return true;
  });

  // Sort the filtered cards
  const sortedIds = filteredIds.sort((a, b) => {
    const cardA = state.allCardsById[a];
    const cardB = state.allCardsById[b];
    let comparison = 0;
    
    switch(query.sortBy) {
      case "number":
        comparison = cardA.sort_id - cardB.sort_id;
        break;
      case "name":
        comparison = cardA.name.localeCompare(cardB.name);
        break;
      case "vp":
        comparison = (cardA.VP || 0) - (cardB.VP || 0);
        break;
      case "size":
        const sizeOrder = { "Hatchling": 1, "Fledgling": 2, "Small": 3, "Medium": 4, "Large": 5 };
        comparison = (sizeOrder[cardA.size] || 0) - (sizeOrder[cardB.size] || 0);
        break;
      default:
        comparison = cardA.sort_id - cardB.sort_id;
    }
    
    return query.sortOrder === "desc" ? -comparison : comparison;
  });

  return { ...state, filteredCardIds: sortedIds };
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
    size: {
      Hatchling: true,
      Fledgling: true,
      Small: true,
      Medium: true,
      Large: true,
    },
    resource: {
      Egg: true,
      Milk: true,
      Meat: true,
      Gold: true,
      Crystal: true,
      Coin: true,
      NoResourceCost: true,
      IgnoreCost: true,
    },
    abilityType: {
      Adventurer: true,
      WhenPlayed: true,
      OncePerRound: true,
      EndGame: true,
    },
    cave: {
      "Crimson Cavern": false,
      "Golden Grotto": false,
      "Amethyst Abyss": false,
    },
    sortBy: "number", // number, name, vp, size
    sortOrder: "asc", // asc, desc
  };
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    triggerSearch(query);
  }, [query, triggerSearch]);

  const stats = useMemo(() => {
    return cardState.filteredCardIds
      .map((id) => cardState.allCardsById[id])
      .reduce(
        (acc, card) => {
          fields.forEach((field) => {
            if (field === "hasEgg") {
              if (card.Egg) {
                if (!acc[field]["Egg"]) acc[field]["Egg"] = 0;
                acc[field]["Egg"]++;
              }
            } else if (field === "hasMilk") {
              if (card.Milk) {
                if (!acc[field]["Milk"]) acc[field]["Milk"] = 0;
                acc[field]["Milk"]++;
              }
            } else if (field === "hasMeat") {
              if (card.Meat) {
                if (!acc[field]["Meat"]) acc[field]["Meat"] = 0;
                acc[field]["Meat"]++;
              }
            } else if (field === "hasGold") {
              if (card.Gold) {
                if (!acc[field]["Gold"]) acc[field]["Gold"] = 0;
                acc[field]["Gold"]++;
              }
            } else if (field === "hasCrystal") {
              if (card.Crystal) {
                if (!acc[field]["Crystal"]) acc[field]["Crystal"] = 0;
                acc[field]["Crystal"]++;
              }
            } else if (field === "hasCoin") {
              if (card.Coin) {
                if (!acc[field]["Coin"]) acc[field]["Coin"] = 0;
                acc[field]["Coin"]++;
              }
            } else if (field === "hasNoResourceCost") {
              const hasIgnoreCost = card.ignoreCost === "x" || card.ignoreCost === true;
              const hasNoResourceCost = !card.Egg && !card.Milk && !card.Meat && !card.Gold && !card.Crystal && !card.Coin && !hasIgnoreCost;
              if (hasNoResourceCost) {
                if (!acc[field]["NoResourceCost"]) acc[field]["NoResourceCost"] = 0;
                acc[field]["NoResourceCost"]++;
              }
            } else if (field === "hasIgnoreCost") {
              const hasIgnoreCost = card.ignoreCost === "x" || card.ignoreCost === true;
              if (hasIgnoreCost) {
                if (!acc[field]["IgnoreCost"]) acc[field]["IgnoreCost"] = 0;
                acc[field]["IgnoreCost"]++;
              }
            } else {
              if (!acc[field][card[field]]) acc[field][card[field]] = 0;
              acc[field][card[field]]++;
            }
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
              <div className="filter-section">
                <div className="filter-header">
                  <label className="filter-label">Personality:</label>
                  <div className="filter-header-buttons">
                    <button
                      className="filter-select-all"
                      disabled={query.personality.Shy && query.personality.Playful && query.personality.Helpful && query.personality.Aggressive}
                      onClick={() =>
                        setQuery({
                          ...query,
                          personality: {
                            Shy: true,
                            Playful: true,
                            Helpful: true,
                            Aggressive: true,
                          },
                        })
                      }
                    >
                      All
                    </button>
                    <button
                      className="filter-clear-all"
                      disabled={!query.personality.Shy && !query.personality.Playful && !query.personality.Helpful && !query.personality.Aggressive}
                      onClick={() =>
                        setQuery({
                          ...query,
                          personality: {
                            Shy: false,
                            Playful: false,
                            Helpful: false,
                            Aggressive: false,
                          },
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </div>
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
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <label className="filter-label">Type:</label>
                  <div className="filter-header-buttons">
                    <button
                      className="filter-select-all"
                      disabled={query.size.Hatchling && query.size.Fledgling && query.size.Small && query.size.Medium && query.size.Large}
                      onClick={() =>
                        setQuery({
                          ...query,
                          size: {
                            Hatchling: true,
                            Fledgling: true,
                            Small: true,
                            Medium: true,
                            Large: true,
                          },
                        })
                      }
                    >
                      All
                    </button>
                    <button
                      className="filter-clear-all"
                      disabled={!query.size.Hatchling && !query.size.Fledgling && !query.size.Small && !query.size.Medium && !query.size.Large}
                      onClick={() =>
                        setQuery({
                          ...query,
                          size: {
                            Hatchling: false,
                            Fledgling: false,
                            Small: false,
                            Medium: false,
                            Large: false,
                          },
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="row">
                  <button
                    className={`type-filter ${query.size.Hatchling ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        size: {
                          ...query.size,
                          Hatchling: !query.size.Hatchling,
                        },
                      })
                    }
                  >
                    Hatchling ({stats.size?.Hatchling || 0})
                  </button>
                  <button
                    className={`type-filter ${query.size.Fledgling ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        size: {
                          ...query.size,
                          Fledgling: !query.size.Fledgling,
                        },
                      })
                    }
                  >
                    Fledgling ({stats.size?.Fledgling || 0})
                  </button>
                  <button
                    className={`type-filter ${query.size.Small ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        size: {
                          ...query.size,
                          Small: !query.size.Small,
                        },
                      })
                    }
                  >
                    Small ({stats.size?.Small || 0})
                  </button>
                  <button
                    className={`type-filter ${query.size.Medium ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        size: {
                          ...query.size,
                          Medium: !query.size.Medium,
                        },
                      })
                    }
                  >
                    Medium ({stats.size?.Medium || 0})
                  </button>
                  <button
                    className={`type-filter ${query.size.Large ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        size: {
                          ...query.size,
                          Large: !query.size.Large,
                        },
                      })
                    }
                  >
                    Large ({stats.size?.Large || 0})
                  </button>
                </div>
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <label className="filter-label">Resources:</label>
                  <div className="filter-header-buttons">
                    <button
                      className="filter-select-all"
                      disabled={query.resource.Egg && query.resource.Milk && query.resource.Meat && query.resource.Gold && query.resource.Crystal && query.resource.Coin && query.resource.NoResourceCost && query.resource.IgnoreCost}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            Egg: true,
                            Milk: true,
                            Meat: true,
                            Gold: true,
                            Crystal: true,
                            Coin: true,
                            NoResourceCost: true,
                            IgnoreCost: true,
                          },
                        })
                      }
                    >
                      All
                    </button>
                    <button
                      className="filter-clear-all"
                      disabled={!query.resource.Egg && !query.resource.Milk && !query.resource.Meat && !query.resource.Gold && !query.resource.Crystal && !query.resource.Coin && !query.resource.NoResourceCost && !query.resource.IgnoreCost}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            Egg: false,
                            Milk: false,
                            Meat: false,
                            Gold: false,
                            Crystal: false,
                            Coin: false,
                            NoResourceCost: false,
                            IgnoreCost: false,
                          },
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <Tooltip title="Filter by resource cost">
                  <div className="row resource-icons">
                    <div
                      className={`resource-icon ${query.resource.Egg ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            Egg: !query.resource.Egg,
                          },
                        })
                      }
                    >
                      <img src={Egg} alt="Egg" className="resource-svg" />
                      <span>({stats.hasEgg?.Egg || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.Milk ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            Milk: !query.resource.Milk,
                          },
                        })
                      }
                    >
                      <img src={Milk} alt="Milk" className="resource-svg" />
                      <span>({stats.hasMilk?.Milk || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.Meat ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            Meat: !query.resource.Meat,
                          },
                        })
                      }
                    >
                      <img src={Meat} alt="Meat" className="resource-svg" />
                      <span>({stats.hasMeat?.Meat || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.Gold ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            Gold: !query.resource.Gold,
                          },
                        })
                      }
                    >
                      <img src={Gold} alt="Gold" className="resource-svg" />
                      <span>({stats.hasGold?.Gold || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.Crystal ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            Crystal: !query.resource.Crystal,
                          },
                        })
                      }
                    >
                      <img src={Crystal} alt="Crystal" className="resource-svg" />
                      <span>({stats.hasCrystal?.Crystal || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.Coin ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            Coin: !query.resource.Coin,
                          },
                        })
                      }
                    >
                      <img src={Coin} alt="Coin" className="resource-svg" />
                      <span>({stats.hasCoin?.Coin || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.NoResourceCost ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            NoResourceCost: !query.resource.NoResourceCost,
                          },
                        })
                      }
                    >
                      <img src={NoResourceCost} alt="No Resource Cost" className="resource-svg" />
                      <span>({stats.hasNoResourceCost?.NoResourceCost || 0})</span>
                    </div>
                    <div
                      className={`resource-icon ${query.resource.IgnoreCost ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          resource: {
                            ...query.resource,
                            IgnoreCost: !query.resource.IgnoreCost,
                          },
                        })
                      }
                      title="Ignore Cost"
                    >
                      <img src={BlueStar} alt="Ignore Cost" className="resource-svg" />
                      <span>({stats.hasIgnoreCost?.IgnoreCost || 0})</span>
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <label className="filter-label">Ability:</label>
                  <div className="filter-header-buttons">
                    <button
                      className="filter-select-all"
                      disabled={query.abilityType.Adventurer && query.abilityType.WhenPlayed && query.abilityType.OncePerRound && query.abilityType.EndGame}
                      onClick={() =>
                        setQuery({
                          ...query,
                          abilityType: {
                            Adventurer: true,
                            WhenPlayed: true,
                            OncePerRound: true,
                            EndGame: true,
                          },
                        })
                      }
                    >
                      All
                    </button>
                    <button
                      className="filter-clear-all"
                      disabled={!query.abilityType.Adventurer && !query.abilityType.WhenPlayed && !query.abilityType.OncePerRound && !query.abilityType.EndGame}
                      onClick={() =>
                        setQuery({
                          ...query,
                          abilityType: {
                            Adventurer: false,
                            WhenPlayed: false,
                            OncePerRound: false,
                            EndGame: false,
                          },
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <Tooltip title="Filter by ability type">
                  <div className="row ability-icons">
                    <div
                      className={`ability-icon active`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          abilityType: {
                            ...query.abilityType,
                            WhenPlayed: !query.abilityType.WhenPlayed,
                          },
                        })
                      }
                      title="When Played"
                    >
                      <img src={WhenPlayed} alt="When Played" className="ability-svg" />
                    </div>
                    <div
                      className={`ability-icon ${query.abilityType.Adventurer ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          abilityType: {
                            ...query.abilityType,
                            Adventurer: !query.abilityType.Adventurer,
                          },
                        })
                      }
                      title="On Explore (Adventurer)"
                    >
                      <img src={Adventurer} alt="Adventurer" className="ability-svg" />
                    </div>
                    <div
                      className={`ability-icon ${query.abilityType.OncePerRound ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          abilityType: {
                            ...query.abilityType,
                            OncePerRound: !query.abilityType.OncePerRound,
                          },
                        })
                      }
                      title="Once Per Round"
                    >
                      <img src={OncePerRound} alt="Once Per Round" className="ability-svg" />
                    </div>
                    <div
                      className={`ability-icon ${query.abilityType.EndGame ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          abilityType: {
                            ...query.abilityType,
                            EndGame: !query.abilityType.EndGame,
                          },
                        })
                      }
                      title="End Game"
                    >
                      <img src={EndGame} alt="End Game" className="ability-svg" />
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <label className="filter-label">Cave:</label>
                  <div className="filter-header-buttons">
                    <button
                      className="filter-select-all"
                      disabled={query.cave["Crimson Cavern"] && query.cave["Golden Grotto"] && query.cave["Amethyst Abyss"]}
                      onClick={() =>
                        setQuery({
                          ...query,
                          cave: {
                            "Crimson Cavern": true,
                            "Golden Grotto": true,
                            "Amethyst Abyss": true,
                          },
                        })
                      }
                    >
                      All
                    </button>
                    <button
                      className="filter-clear-all"
                      disabled={!query.cave["Crimson Cavern"] && !query.cave["Golden Grotto"] && !query.cave["Amethyst Abyss"]}
                      onClick={() =>
                        setQuery({
                          ...query,
                          cave: {
                            "Crimson Cavern": false,
                            "Golden Grotto": false,
                            "Amethyst Abyss": false,
                          },
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <Tooltip title="Filter by cave type (cards must match ALL selected caves)">
                  <div className="row cave-icons">
                    <div
                      className={`cave-icon crimson ${query.cave["Crimson Cavern"] ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          cave: {
                            ...query.cave,
                            "Crimson Cavern": !query.cave["Crimson Cavern"],
                          },
                        })
                      }
                      title="Crimson Cavern"
                    >
                      Crimson ({stats["Crimson Cavern"]?.x || 0})
                    </div>
                    <div
                      className={`cave-icon golden ${query.cave["Golden Grotto"] ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          cave: {
                            ...query.cave,
                            "Golden Grotto": !query.cave["Golden Grotto"],
                          },
                        })
                      }
                      title="Golden Grotto"
                    >
                      Golden ({stats["Golden Grotto"]?.x || 0})
                    </div>
                    <div
                      className={`cave-icon amethyst ${query.cave["Amethyst Abyss"] ? "active" : ""}`}
                      onClick={() =>
                        setQuery({
                          ...query,
                          cave: {
                            ...query.cave,
                            "Amethyst Abyss": !query.cave["Amethyst Abyss"],
                          },
                        })
                      }
                      title="Amethyst Abyss"
                    >
                      Amethyst ({stats["Amethyst Abyss"]?.x || 0})
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className="filter-section">
                <div className="sort-header">
                  <label className="filter-label">Sort By:</label>
                  <button
                    className={`sort-order-toggle ${query.sortOrder === "desc" ? "active" : ""}`}
                    onClick={() => setQuery({ ...query, sortOrder: query.sortOrder === "asc" ? "desc" : "asc" })}
                    title={`Sort Order: ${query.sortOrder === "asc" ? "Ascending" : "Descending"}`}
                  >
                    <SortIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>
                <div className="row">
                  <button
                    className={`type-filter ${query.sortBy === "number" ? "active" : ""}`}
                    onClick={() => setQuery({ ...query, sortBy: "number" })}
                  >
                    Number
                  </button>
                  <button
                    className={`type-filter ${query.sortBy === "name" ? "active" : ""}`}
                    onClick={() => setQuery({ ...query, sortBy: "name" })}
                  >
                    Name
                  </button>
                  <button
                    className={`type-filter ${query.sortBy === "vp" ? "active" : ""}`}
                    onClick={() => setQuery({ ...query, sortBy: "vp" })}
                  >
                    Victory Points
                  </button>
                </div>
              </div>

              <div className="filter-section">
                <label className="filter-label">Expansion:</label>
                <div className="row">
                  <button
                    className={`expansion-filter ${query.expansion.base ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        expansion: {
                          ...query.expansion,
                          base: !query.expansion.base,
                        },
                      })
                    }
                  >
                    Base Game ({stats.expansion?.base || 0})
                  </button>
                  <button
                    className={`expansion-filter ${query.expansion.academy ? "active" : ""}`}
                    onClick={() =>
                      setQuery({
                        ...query,
                        expansion: {
                          ...query.expansion,
                          academy: !query.expansion.academy,
                        },
                      })
                    }
                  >
                    Dragon Academy ({stats.expansion?.academy || 0})
                  </button>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </ThemeProvider>
  );
}

export default Search;
