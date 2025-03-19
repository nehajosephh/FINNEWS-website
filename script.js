const FINNHUB_API_KEY = 'cvd90e1r01qodeudo5r0cvd90e1r01qodeudo5rg'; // Sign up at finnhub.io to get your API key
const ALPHA_VANTAGE_API_KEY = 'QRW6X4TR4BA5SF98'; // Get free API key from alphavantage.co
const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];
let mainChart;
let candleCharts = {};
let lastPrices = {};
let animationInterval;

// Function to format date for API
function formatDate(date) {
    return Math.floor(date.getTime() / 1000);
}

// Function to get real-time price updates
async function getRealtimePrice(symbol) {
    try {
        const response = await fetch(https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY});
        const data = await response.json();
        if (data['Global Quote'] && data['Global Quote']['05. price']) {
            return parseFloat(data['Global Quote']['05. price']);
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.error(Error fetching price for ${symbol}:, error);
        // Return simulated price if API fails
        return simulatePrice(symbol);
    }
}

// Function to simulate price for demo purposes
function simulatePrice(symbol) {
    if (!lastPrices[symbol]) {
        // Initial prices for major stocks if API fails
        const initialPrices = {
            'AAPL': 175.50,
            'MSFT': 325.75,
            'GOOGL': 140.20,
            'AMZN': 178.30,
            'NVDA': 950.40
        };
        lastPrices[symbol] = initialPrices[symbol] || 100.00;
    }
    
    // Simulate price movement (±0.5%)
    const change = lastPrices[symbol] * (Math.random() * 0.01 - 0.005);
    return lastPrices[symbol] + change;
}

// Function to create animated main chart with fast-moving candles
async function createMainChart() {
    const symbol = 'AAPL';
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Generate initial animated data
    const initialData = [];
    const now = new Date();
    let basePrice = 150;
    
    // Create 50 initial candles with high volatility for animation
    for (let i = 0; i < 50; i++) {
        const time = new Date(now.getTime() - (50 - i) * 60000);
        const volatility = 5;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = basePrice + change;
        
        initialData.push({
            x: time,
            o: basePrice,
            h: Math.max(basePrice, newPrice) + Math.random() * 2,
            l: Math.min(basePrice, newPrice) - Math.random() * 2,
            c: newPrice
        });
        
        basePrice = newPrice;
    }
    
    mainChart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: symbol,
                data: initialData,
                color: {
                    up: '#ff0066',
                    down: '#0033cc',
                    unchanged: '#ffffff'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 100 // Fast animation
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
    
    // Start fast animation for main chart
    startFastAnimation();
    
    // After 10 seconds, switch to real data if available
    setTimeout(async () => {
        clearInterval(animationInterval);
        try {
            const response = await fetch(https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY});
            const data = await response.json();
            
            if (data['Time Series (1min)']) {
                const timeSeriesData = data['Time Series (1min)'];
                
                const realData = Object.entries(timeSeriesData).slice(0, 50).map(([time, values]) => ({
                    x: new Date(time),
                    o: parseFloat(values['1. open']),
                    h: parseFloat(values['2. high']),
                    l: parseFloat(values['3. low']),
                    c: parseFloat(values['4. close'])
                })).reverse();
                
                mainChart.data.datasets[0].data = realData;
                mainChart.update();
                
                // Start slower, more realistic updates
                startSlowerAnimation();
            } else {
                // Continue with simulated data if API fails
                startSlowerAnimation();
            }
        } catch (error) {
            console.error('Error fetching real data:', error);
            // Continue with simulated data if API fails
            startSlowerAnimation();
        }
    }, 10000);
}

// Function to start fast animation for opening effect
function startFastAnimation() {
    animationInterval = setInterval(() => {
        const data = mainChart.data.datasets[0].data;
        const lastCandle = data[data.length - 1];
        const lastPrice = lastCandle.c;
        
        // High volatility for dramatic effect
        const volatility = 8;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = lastPrice + change;
        
        const now = new Date(lastCandle.x.getTime() + 60000);
        
        data.push({
            x: now,
            o: lastPrice,
            h: Math.max(lastPrice, newPrice) + Math.random() * 3,
            l: Math.min(lastPrice, newPrice) - Math.random() * 3,
            c: newPrice
        });
        
        if (data.length > 50) {
            data.shift();
        }
        
        mainChart.update('quiet');
    }, 200); // Update every 200ms for fast animation
}

// Function to start slower, more realistic animation
function startSlowerAnimation() {
    animationInterval = setInterval(() => {
        const data = mainChart.data.datasets[0].data;
        const lastCandle = data[data.length - 1];
        const lastPrice = lastCandle.c;
        
        // More realistic volatility
        const volatility = 1;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = lastPrice + change;
        
        const now = new Date(lastCandle.x.getTime() + 60000);
        
        data.push({
            x: now,
            o: lastPrice,
            h: Math.max(lastPrice, newPrice) + Math.random(),
            l: Math.min(lastPrice, newPrice) - Math.random(),
            c: newPrice
        });
        
        if (data.length > 50) {
            data.shift();
        }
        
        mainChart.update('quiet');
    }, 2000); // Update every 2 seconds for more realistic animation
}

// Function to create live candle chart for individual stocks
async function createLiveCandleChart(symbol, chartId) {
    const stockBox = document.getElementById(stock${stocks.indexOf(symbol) + 1});
    stockBox.classList.add('loading');
    const ctx = document.getElementById(chartId).getContext('2d');
    
    try {
        // Get initial data
        const response = await fetch(https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY});
        const data = await response.json();
        
        let initialData = [];
        
        if (data['Time Series (1min)']) {
            const timeSeriesData = data['Time Series (1min)'];
            
            initialData = Object.entries(timeSeriesData).slice(0, 30).map(([time, values]) => ({
                x: new Date(time),
                o: parseFloat(values['1. open']),
                h: parseFloat(values['2. high']),
                l: parseFloat(values['3. low']),
                c: parseFloat(values['4. close'])
            })).reverse();
        } else {
            // Generate simulated data if API fails
            const now = new Date();
            let basePrice = simulatePrice(symbol);
            
            for (let i = 0; i < 30; i++) {
                const time = new Date(now.getTime() - (30 - i) * 60000);
                const volatility = 1;
                const change = (Math.random() - 0.5) * volatility;
                const newPrice = basePrice + change;
                
                initialData.push({
                    x: time,
                    o: basePrice,
                    h: Math.max(basePrice, newPrice) + Math.random(),
                    l: Math.min(basePrice, newPrice) - Math.random(),
                    c: newPrice
                });
                
                basePrice = newPrice;
            }
        }

        lastPrices[symbol] = initialData[initialData.length - 1].c;

        candleCharts[symbol] = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: symbol,
                    data: initialData,
                    color: {
                        up: '#ff0066',
                        down: '#0033cc',
                        unchanged: '#ffffff'
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });

        // Update stock box color based on price movement
        updateStockBoxStyle(stockBox, initialData[initialData.length - 1].c, initialData[initialData.length - 2].c);
        stockBox.classList.remove('loading');
    } catch (error) {
        console.error(Error creating chart for ${symbol}:, error);
        stockBox.classList.remove('loading');
        
        // Create chart with simulated data if API fails
        const now = new Date();
        let basePrice = simulatePrice(symbol);
        const initialData = [];
        
        for (let i = 0; i < 30; i++) {
            const time = new Date(now.getTime() - (30 - i) * 60000);
            const volatility = 1;
            const change = (Math.random() - 0.5) * volatility;
            const newPrice = basePrice + change;
            
            initialData.push({
                x: time,
                o: basePrice,
                h: Math.max(basePrice, newPrice) + Math.random(),
                l: Math.min(basePrice, newPrice) - Math.random(),
                c: newPrice
            });
            
            basePrice = newPrice;
        }
        
        lastPrices[symbol] = initialData[initialData.length - 1].c;
        
        candleCharts[symbol] = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: symbol,
                    data: initialData,
                    color: {
                        up: '#ff0066',
                        down: '#0033cc',
                        unchanged: '#ffffff'
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
        
        updateStockBoxStyle(stockBox, initialData[initialData.length - 1].c, initialData[initialData.length - 2].c);
    }
}

// Function to update stock box style based on price movement
function updateStockBoxStyle(element, currentPrice, previousPrice) {
    element.classList.remove('up', 'down');
    if (currentPrice > previousPrice) {
        element.classList.add('up');
    } else if (currentPrice < previousPrice) {
        element.classList.add('down');
    }
}

// Function to update charts with new data
async function updateCharts() {
    for (const symbol of stocks) {
        try {
            const stockBox = document.getElementById(stock${stocks.indexOf(symbol) + 1});
            stockBox.classList.add('loading');
            
            const price = await getRealtimePrice(symbol);
            if (price && candleCharts[symbol]) {
                const chart = candleCharts[symbol];
                const lastCandle = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
                const now = new Date();

                if (lastCandle && lastCandle.x.getMinute() === now.getMinute()) {
                    // Update existing candle with animation
                    const targetH = Math.max(lastCandle.h, price);
                    const targetL = Math.min(lastCandle.l, price);
                    const startC = lastCandle.c;
                    
                    // Animate the update
                    const steps = 10;
                    for (let i = 1; i <= steps; i++) {
                        setTimeout(() => {
                            lastCandle.h = lastCandle.h + (targetH - lastCandle.h) * (i / steps);
                            lastCandle.l = lastCandle.l + (targetL - lastCandle.l) * (i / steps);
                            lastCandle.c = startC + (price - startC) * (i / steps);
                            chart.update('quiet');
                        }, i * 50);
                    }
                } else {
                    // Create new candle
                    chart.data.datasets[0].data.push({
                        x: now,
                        o: price,
                        h: price,
                        l: price,
                        c: price
                    });

                    if (chart.data.datasets[0].data.length > 30) {
                        chart.data.datasets[0].data.shift();
                    }
                    
                    chart.update();
                }

                // Update stock box style
                updateStockBoxStyle(stockBox, price, lastPrices[symbol]);
                lastPrices[symbol] = price;
            }
            
            stockBox.classList.remove('loading');
        } catch (error) {
            console.error(Error updating ${symbol}:, error);
            const stockBox = document.getElementById(stock${stocks.indexOf(symbol) + 1});
            stockBox.classList.remove('loading');
        }
    }
}

// Initialize all charts
async function initCharts() {
    await createMainChart();
    
    // Create charts for each stock with a slight delay to avoid API rate limits
    for (let i = 0; i < stocks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between API calls
        await createLiveCandleChart(stocks[i], candleChart${i + 1});
    }
    
    // Update charts every 10 seconds
    setInterval(updateCharts, 10000);
}

// Start the application
document.addEventListener('DOMContentLoaded', initCharts);
