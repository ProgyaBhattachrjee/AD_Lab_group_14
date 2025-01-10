import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data");
        const result = await response.json();
        const formattedData = Object.entries(result).map(([company, stockData]) => {
          if (stockData && stockData.length > 0) {
            const latestStock = stockData[stockData.length - 1];
            const closeKey = Object.keys(latestStock).find((key) => key.includes("Close"));
            const price = latestStock[closeKey];
            const previousPrice = stockData[stockData.length - 2] ? stockData[stockData.length - 2][closeKey] : price;
            const change = price - previousPrice;
            const percentChange = previousPrice !== 0 ? ((change / previousPrice) * 100).toFixed(2) + "%" : "N/A";
            
            return {
              name: company,
              price: price.toFixed(2),
              change: change.toFixed(2),
              percentChange: percentChange,
              isUp: change > 0,
            };
          }
          return { name: company, price: "N/A", change: "N/A", percentChange: "N/A", isUp: false };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        width: "300px",
        height: "120vh", // Increased height to 120vh for longer sidebar
        background: "#f8f9fa",
        borderRight: "2px solid #ddd",  // Border for the sidebar
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",  // Box shadow for the sidebar
        overflowY: "auto",
        padding: "10px",  // Padding for a bit of spacing
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Stock Prices</h3>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {data.map((item, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px",
              borderBottom: "1px solid #ddd",  // Border between items
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{item.name}</span>
            <div style={{ textAlign: "right" }}>
              <div>Price: ${item.price}</div>
              <div
                style={{
                  color: item.isUp ? "green" : "red",
                  fontSize: "12px",
                }}
              >
                {item.isUp ? "▲" : "▼"} {item.change} ({item.percentChange})
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
