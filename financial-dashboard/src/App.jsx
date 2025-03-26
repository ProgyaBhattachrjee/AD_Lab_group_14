import { useState } from "react";
import Sidebar from "./Component/Sidebar";
import FinancialDashboard from "./Component/Board";
import Indicators from "./Component/Indicators";

function App() {
  const [selectedCompany, setSelectedCompany] = useState(""); // ✅ Fix useState inside function

  return (
    <div style={containerStyle}>
      <Sidebar setSelectedCompany={setSelectedCompany} />
      <div style={mainContentStyle}>
        <FinancialDashboard />
        {/* <div style={indicatorsContainerStyle}>
          <Indicators selectedCompany={selectedCompany} />
        </div> */}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  height: "100%",
  width: "100%",
};

// const mainContentStyle = {
//   flexGrow: 1,
//   display: "flex",
//   flexDirection: "column", // ✅ Stack Board and Indicators vertically
//   alignItems: "center",
//   padding: "20px",
// };

const mainContentStyle = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px",
  overflow: "auto", // Allows scrolling if content exceeds viewport
  width: "100%", // Ensures full width alignment
};


const indicatorsContainerStyle = {
  width: "80%",
  marginTop: "120px",
  padding: "15px",
  background: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

export default App;
