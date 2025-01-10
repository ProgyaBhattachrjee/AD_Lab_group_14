import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import styled from "styled-components";
const DashboardContainer = styled.div`
  background: #f7f7f7;
  padding: 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 3rem;
  color: #333;
  background: #e0e0e0;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 30px;
`;

const SelectContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;

  label {
    font-size: 1.1rem;
    color: #333;
  }

  select {
    background-color: #fff;
    color: #333;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 200px;

    &:hover {
      border-color: #aaa;
    }
  }
`;

const ChartContainer = styled.div`
  width: 80%;
  max-width: 800px;
  margin-top: 40px;
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  color: #e74c3c;
`;

const FinancialDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [chartType, setChartType] = useState("Candlestick");
  const [chartData, setChartData] = useState(null);
  const [interval, setInterval] = useState("daily"); // New state for interval

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/data")
      .then((response) => {
        const data = response.data;
        const companyList = Object.keys(data);
        setCompanies(companyList);
        if (companyList.length > 0) {
          setSelectedCompany(companyList[0]);
        }
      })
      .catch((error) => console.error("Error fetching company list:", error));
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      axios
        .get("http://localhost:5000/api/data")
        .then((response) => {
          const companyData = response.data[selectedCompany];
          if (companyData && companyData.length > 0) {
            const filteredData = filterDataByInterval(companyData, interval);
            setChartData(filteredData);
          } else {
            setChartData(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching company data:", error);
          setChartData(null);
        });
    }
  }, [selectedCompany, interval]);

  const filterDataByInterval = (data, interval) => {
    if (interval === "daily") return data; 

    const aggregatedData = [];
    const intervalMap = {
      weekly: 7,
      monthly: 30,
    };
    const step = intervalMap[interval];

    for (let i = 0; i < data.length; i += step) {
      const slice = data.slice(i, i + step);
      const aggregated = {
        "('Date', '')": slice[0]["('Date', '')"],
        [`('Close', '${selectedCompany.toUpperCase()}')`]: slice[slice.length - 1][`('Close', '${selectedCompany.toUpperCase()}')`],
        [`('Open', '${selectedCompany.toUpperCase()}')`]: slice[0][`('Open', '${selectedCompany.toUpperCase()}')`],
        [`('High', '${selectedCompany.toUpperCase()}')`]: Math.max(...slice.map(item => item[`('High', '${selectedCompany.toUpperCase()}')`])),
        [`('Low', '${selectedCompany.toUpperCase()}')`]: Math.min(...slice.map(item => item[`('Low', '${selectedCompany.toUpperCase()}')`])),
      };
      aggregatedData.push(aggregated);
    }

    return aggregatedData;
  };

  const renderChart = () => {
    if (!chartData) {
      return <ErrorMessage>No data available for {selectedCompany}</ErrorMessage>;
    }
    const companyKey = selectedCompany.toUpperCase();
    const dates = chartData.map((item) => item["('Date', '')"]);
    const close = chartData.map((item) => item[`('Close', '${companyKey}')`]);
  
    if (!close || close.length === 0) {
      return <ErrorMessage>No valid data for {selectedCompany}</ErrorMessage>;
    }
    switch (chartType) {
      case "Candlestick":
        return (
          <Plot
            data={[
              {
                x: dates,
                open: chartData.map((item) => item[`('Open', '${companyKey}')`]),
                high: chartData.map((item) => item[`('High', '${companyKey}')`]),
                low: chartData.map((item) => item[`('Low', '${companyKey}')`]),
                close: close,
                type: "candlestick",
                xaxis: "x",
                yaxis: "y",
              },
            ]}
            layout={{
              title: `${selectedCompany} Candlestick Chart`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Bar":
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "bar",
                marker: { color: "blue" },
              },
            ]}
            layout={{
              title: `${selectedCompany} Bar Chart`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Line":
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "scatter",
                mode: "lines",
                line: { color: "blue" },
              },
            ]}
            layout={{
              title: `${selectedCompany} Line Graph`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Vertex Line":
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "scatter",
                mode: "markers+lines",
                marker: { color: "purple", size: 8 },
                line: { shape: "linear", color: "purple" },
              },
            ]}
            layout={{
              title: `${selectedCompany} Vertex Line Graph`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Step":
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "scatter",
                mode: "lines",
                line: { shape: "hv", color: "orange" },
              },
            ]}
            layout={{
              title: `${selectedCompany} Step Graph`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Baseline":
        const baselineValue = close.reduce((a, b) => a + b, 0) / close.length;
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "scatter",
                mode: "lines",
                line: { color: "green" },
              },
              {
                x: dates,
                y: Array(dates.length).fill(baselineValue),
                type: "scatter",
                mode: "lines",
                line: { color: "red", dash: "dash" },
                name: "Baseline",
              },
            ]}
            layout={{
              title: `${selectedCompany} Baseline Graph`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Mountain":
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "scatter",
                mode: "lines",
                fill: "tozeroy",
                line: { color: "green" },
              },
            ]}
            layout={{
              title: `${selectedCompany} Mountain Graph`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Scatter":
        return (
          <Plot
            data={[
              {
                x: dates,
                y: close,
                type: "scatter",
                mode: "markers",
                marker: { color: "red", size: 8 },
              },
            ]}
            layout={{
              title: `${selectedCompany} Scatter Graph`,
              xaxis: { title: "Date" },
              yaxis: { title: "Price" },
            }}
          />
        );
      case "Histogram":
        return (
          <Plot
            data={[
              {
                x: close,
                type: "histogram",
                marker: { color: "orange" },
              },
            ]}
            layout={{
              title: `${selectedCompany} Histogram`,
              xaxis: { title: "Price" },
              yaxis: { title: "Frequency" },
            }}
          />
        );
      default:
        return <ErrorMessage>Invalid chart type selected!</ErrorMessage>;
    }
  };
  

  return (
    <>
      <DashboardContainer>
        <Heading>Zerodha</Heading>
        <SelectContainer>
          <div>
            <label>Select Company:</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Select Chart Type:</label>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
  <option value="Candlestick">Candlestick</option>
  <option value="Bar">Bar</option>
  <option value="Line">Line</option>
  <option value="Mountain">Mountain</option>
  <option value="Scatter">Scatter</option>
  <option value="Histogram">Histogram</option>
  <option value="Vertex Line">Vertex Line</option>
  <option value="Step">Step</option>
  <option value="Baseline">Baseline</option>
</select>
          </div>
          <div>
            <label>Select Interval:</label>
            <select value={interval} onChange={(e) => setInterval(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </SelectContainer>
        <ChartContainer>{renderChart()}</ChartContainer>
      </DashboardContainer>
    </>
  );
};

export default FinancialDashboard;
