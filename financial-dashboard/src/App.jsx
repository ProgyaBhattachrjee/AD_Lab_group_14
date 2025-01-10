import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FinancialDashboard from './Component/Board'
import Sidebar from './Component/Sidebar';
function App() {
  return (
    <>
    <div style={containerStyle}>
      <Sidebar />
      <FinancialDashboard />
    </div>
  </>
  
  );
}
const containerStyle = {
  display: "flex", 
  height: "150vh", 
  flexDirection: "row",
  width: "100%",
};

const sidebarStyle = {
  width: "240px",
  height: "100vh",
  background: "#f8f9fa",
  overflowY: "auto",
  padding: "10px", 
  boxSizing: "border-box",
};

const dashboardStyle = {
  flexGrow: 1,
  padding: "20px",
  background: "#fff",
  overflowY: "auto",
};


export default App
