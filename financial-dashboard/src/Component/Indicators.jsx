import { useState, useEffect } from "react";

function Indicators({ selectedCompany }) {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCompany) return; // ✅ Prevents unnecessary fetches

    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/api/indicators") // ✅ Ensure Flask is running
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch indicators");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Indicators Fetched:", data); // ✅ Debugging
        setIndicators(data.indicators); // ✅ Store indicators
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedCompany]); // ✅ Fetches when selectedCompany changes

//   return (
//     <div style={containerStyle}>
//       <h2>Technical Indicators for {selectedCompany || "No Company Selected"}</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}

//       {indicators && (
//         <div style={indicatorsStyle}>
//           <p><strong>SMA 20:</strong> {indicators.SMA_20?.slice(-1)[0]}</p>
//           <p><strong>SMA 50:</strong> {indicators.SMA_50?.slice(-1)[0]}</p>
//           <p><strong>RSI 14:</strong> {indicators.RSI_14?.slice(-1)[0]}</p>
//         </div>
//       )}
//     </div>
//   );
}

// Styles
const containerStyle = {
  padding: "15px",
  background: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

const indicatorsStyle = {
  marginTop: "10px",
  background: "#fff",
  padding: "10px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};

export default Indicators;
