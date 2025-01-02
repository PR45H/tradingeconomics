import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const countries = ['Mexico', 'Sweden', 'New Zealand', 'Thailand'];
const categories = ['GDP', 'Inflation Rate', 'Unemployment Rate', 'Interest Rate', 'Population'];

export default function EconomicComparison() {
  const [country1, setCountry1] = useState('');
  const [country2, setCountry2] = useState('');
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const [chartData, setChartData] = useState(null);

  const fetchData = async (country, category) => {
    try {
      const response = await fetch(`YOUR_API_ENDPOINT?country=${country}&indicator=${category}&apiKey=YOUR_API_KEY`);
      const data = await response.json();

      // Example: Modify this based on the actual API response structure
      return data.value || Math.random() * 100; // Fallback if API data is unavailable
    } catch (error) {
      console.error('Error fetching data:', error);
      return Math.random() * 100; // Fallback for errors
    }
  };


  const compareCountries = () => {  
    if (!country1 || !country2 || !category1 || !category2) {
      alert('Please select both countries and categories');
      return;
    }

    const data1 = fetchData(country1, category1);
    const data2 = fetchData(country2, category2);

    setChartData({
      labels: [country1, country2],
      datasets: [{
        label: 'Comparison',
        data: [data1, data2],
        backgroundColor: ['rgba(74, 144, 226, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(74, 144, 226, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 2
      }]
    });
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: `${category1} Comparison`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="bg-[#2a2227] min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Economic Indicators Comparison
        </h1>
        
        {/* Selection Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Country 1 Card */}
          <div className="bg-white shadow-lg p-6 rounded-md">
            <label className="block text-gray-700 mb-2 font-medium">Select Country 1</label>
            <select 
              value={country1}
              onChange={(e) => setCountry1(e.target.value)} 
              className="w-full border-gray-300 rounded-md p-2 mb-4"
            >
              <option value="">Select a country...</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <label className="block text-gray-700 mb-2 font-medium">Select Category</label>
            <select 
              value={category1} 
              onChange={(e) => setCategory1(e.target.value)} 
              className="w-full border-gray-300 rounded-md p-2"
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Country 2 Card */}
          <div className="bg-white shadow-lg p-6 rounded-md">
            <label className="block text-gray-700 mb-2 font-medium">Select Country 2</label>
            <select 
              value={country2} 
              onChange={(e) => setCountry2(e.target.value)} 
              className="w-full border-gray-300 rounded-md p-2 mb-4"
            >
              <option value="">Select a country...</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <label className="block text-gray-700 mb-2 font-medium">Select Category</label>
            <select 
              value={category2} 
              onChange={(e) => setCategory2(e.target.value)} 
              className="w-full border-gray-300 rounded-md p-2"
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <div className="text-center mb-6">
          <button 
            onClick={compareCountries}
            className="px-8 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            Compare Countries
          </button>
        </div>

        {/* Chart Section */}
        <div className="bg-white shadow-lg p-6 rounded-md">
          {chartData ? (
            <Bar data={chartData} options={options} />
          ) : (
            <p className="text-center text-gray-500">Select options and click "Compare Countries" to see the chart.</p>
          )}
        </div>
      </div>
    </div>
  );
}
