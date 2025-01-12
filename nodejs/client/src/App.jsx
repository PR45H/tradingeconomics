import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const countries = ['Mexico', 'Sweden', 'New Zealand', 'Thailand'];
const categories = ['GDP', 'Inflation Rate', 'Unemployment Rate', 'Interest Rate', 'Population'];

export default function EconomicComparison() {
  const [country1, setCountry1] = useState('');
  const [country2, setCountry2] = useState('');
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async (country, category) => {
    try {
      const response = await fetch(`YOUR_API_ENDPOINT?country=${country}&indicator=${category}&apiKey=YOUR_API_KEY`);
      const data = await response.json();
      return data.value || Math.random() * 100;
    } catch (error) {
      console.error('Error fetching data:', error);
      return Math.random() * 100;
    }
  };

  const compareCountries = async () => {
    if (!country1 || !country2 || !category1 || !category2) {
      alert('Please select both countries and categories');
      return;
    }

    const data1 = await fetchData(country1, category1);
    const data2 = await fetchData(country2, category2);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [country1, country2],
        datasets: [
          {
            label: category1,
            data: [data1, 0],
            backgroundColor: 'rgba(74, 144, 226, 0.8)',
            borderColor: 'rgba(74, 144, 226, 1)',
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false,
          },
          {
            label: category2,
            data: [0, data2],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                family: 'Poppins'
              }
            }
          },
          title: {
            display: true,
            text: `${category1} vs ${category2} Comparison`,
            font: {
              size: 18,
              weight: 'bold'
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });
  };

  return (
    <div className="bg-[#2a2227] min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-200">
          Economic Indicators Comparison
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
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
              {/* TODO
              change the select a categoty to select a category related to */}
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

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
        {/* TODO: to create a scond page where after selecting the category will take you to another page which will help
        select a list of category for chart */}

        <div className="text-center mb-6">
          <button 
            onClick={compareCountries}
            className="px-8 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            Compare Countries
          </button>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-md">
          <div className="w-full h-[400px] relative">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

