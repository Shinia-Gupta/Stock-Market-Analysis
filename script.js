const chartDiv = document.getElementById("chartDiv");
const stocksList = document.getElementById("stock-list");
const Stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];
const Timeframes = ["5y", "1y", "1mo", "3mo"];
let stockData;
let currentStock = "AAPL";
let stockStats;
let stockSum;

async function fetchStocks() {
  const response = await fetch(
    "https://stocks3.onrender.com/api/stocks/getstocksdata"
  );
  const data = await response.json();
  stockData = data.stocksData[0];
}

async function displayStockStats() {
  Stocks.forEach((stock) => {
    const stockDiv = document.createElement("div");
    stockDiv.classList.add("list");
    const stockInfo = stockStats[stock];
    stockDiv.innerHTML = `<button  class='buttonList' onclick="fetchSummary('${stock}')">${stock}</button>&nbsp;&nbsp;&nbsp;
        <span >$${stockInfo.bookValue}</span>&nbsp;&nbsp;&nbsp;
        <span  style="color: ${stockInfo.profit === 0 ? "red" : "green"};">${
      stockInfo.profit
    }</span>`;
    stocksList.appendChild(stockDiv);
  });
}

async function fetchStockStats() {
  const response = await fetch(
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
  );
  const data = await response.json();
  stockStats = data.stocksStatsData[0];
  displayStockStats();
}

async function fetchSummary(stock) {
  currentStock = stock;
  const response = await fetch(
    "https://stocks3.onrender.com/api/stocks/getstocksprofiledata"
  );
  const data = await response.json();
  stockSum = data.stocksProfileData[0];
  displaySummary(stockSum[stock], stock);
  updateChart(stockData[stock], "5y", stock);
}

function displaySummary(stockSummary, stock) {
  const about = document.createElement("div");
  about.innerHTML = `<span id="name">${stock}</span> &nbsp;&nbsp;&nbsp; <span id="profit" style="color:${
    stockStats[stock].profit === 0 ? "red" : "green"
  }">&nbsp;${
    stockStats[stock].profit
  }%</span> &nbsp;&nbsp;&nbsp;<span id ="bookValue">$${
    stockStats[stock].bookValue
  }</span>`;
  const para = document.createElement("p");
  para.textContent = stockSummary ? stockSummary.summary : "";
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = "";
  summaryDiv.append(about, para);
  // document.getElementById("summary").textContent = stock ? stock.summary : "";
}

async function fetchDataAndDisplay() {
  await fetchStocks();
  await fetchStockStats();
  await fetchSummary("AAPL");
}

fetchDataAndDisplay();

const chartBtn = document.getElementsByClassName("chartBtn");
for (let i = 0; i < chartBtn.length; i++) {
  chartBtn[i].addEventListener("click", function () {
    updateChart(stockData[currentStock], `${this.id}`, currentStock);
  });
}
Stocks.forEach((stock) => {
  Timeframes.forEach((timeframe) => {
    const button = document.getElementById(`${stock}`);
    button.addEventListener("click", () => updateChart(stock, timeframe));
  
  });
});

// async function fetchStockData(stock, timeframe) {
//   console.log('fetched');
//   const response = await fetch(
//     `https://stocks3.onrender.com/api/stocks/getstocksdata/`
//   );
//   const data = await response.json();
//   return data[stock][timeframe];
// }

async function updateChart(stockData, timeframe, name) {
  const values = stockData[timeframe].value;
  const timestamps = stockData[timeframe].timeStamp;

  const trace = {
    x: timestamps.map((time) => new Date(time * 1000).toLocaleDateString()),
    y: values,
    type: "scatter",
    mode: "lines",
    name: `${name} - ${timeframe}`,

  };

  const layout = {
    title: `${name} Stock Prices - ${timeframe}`,
    xaxis: {
      title: "Date",
    },
    yaxis: {
      title: "Stock Price",
    },
  };

  Plotly.newPlot("chartDiv", [trace], layout);

}

