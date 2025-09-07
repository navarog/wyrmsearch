import "./ExpansionIndicator.css";

const expansionAbbreviations = {
  academy: "DA"
}

const ExpansionIndicator = ({ expansion, variant = "dragon" }) => {
  if (!expansion || expansion === "base") {
    return null;
  }

  return (
    <div className={`expansion-indicator ${variant}`}>
      {expansionAbbreviations[expansion] || expansion}
    </div>
  );
};

export default ExpansionIndicator;