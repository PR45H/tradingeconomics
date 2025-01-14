import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const countries = ['Mexico', 'Sweden', 'New Zealand', 'Thailand'];
const categories = ['GDP', 'Inflation Rate', 'Unemployment Rate', 'Interest Rate', 'Population'];

// Define primary indicators and their exact matching titles
const PRIMARY_INDICATORS = {
  'GDP': {
    exactTitle: 'GDP',
    excludeWords: ['from', 'per', 'growth', 'ratio']
  },
  'Inflation Rate': {
    exactTitle: 'Inflation Rate',
    excludeWords: ['core', 'food', 'transport', 'housing', 'monthly']
  },
  'Interest Rate': {
    exactTitle: 'Interest Rate',
    excludeWords: ['deposit', 'lending', 'mortgage', 'interbank', 'policy']
  },
  'Unemployment Rate': {
    exactTitle: 'Unemployment Rate',
    excludeWords: ['youth', 'long', 'short']
  },
  'Population': {
    exactTitle: 'Population',
    excludeWords: ['growth', 'density', 'urban', 'rural']
  }
};

export default function EconomicComparison() {
  const [country1, setCountry1] = useState('');
  const [country2, setCountry2] = useState('');
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const getPrimaryIndicatorData = (data, category) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    const indicatorConfig = PRIMARY_INDICATORS[category];
    if (!indicatorConfig) {
      return data[0]; // Fallback to first item if category not configured
    }

    // First try to find exact match
    let primaryData = data.find(item => 
      item.Category === category || 
      item.Title === `${item.Country} ${indicatorConfig.exactTitle}`
    );

    // If no exact match, try to find the most relevant entry
    if (!primaryData) {
      primaryData = data.find(item => {
        const hasExcludedWord = indicatorConfig.excludeWords.some(word => 
          item.Category.toLowerCase().includes(word.toLowerCase()) ||
          item.Title.toLowerCase().includes(word.toLowerCase())
        );
        
        return !hasExcludedWord && (
          item.Category.includes(category) ||
          item.Title.includes(category)
        );
      });
    }

    // If still no match, return the first item as fallback
    return primaryData || data[0];
  };

  const fetchData = async (country, category) => {
    try {
      const response = await fetch(`http://localhost:3000/api/get-data?country1=${country1}&country2=${country2}&category1=${category1}&category2=${category2}`);
      const result = await response.json();
      // console.log('API Response:', result); // For debugging

      // Get primary indicator data from the arrays
      const data1 = getPrimaryIndicatorData(result.data1, category1);
      const data2 = getPrimaryIndicatorData(result.data2, category2);
      
      // console.log('Filtered Data:', { data1, data2 }); // For debugging
      
      return {
        category1Data: {
          latest: data1?.LatestValue || 0,
          previous: data1?.PreviousValue || 0,
          unit: data1?.Unit || '',
          dates: {
            latest: new Date(data1?.LatestValueDate).toLocaleDateString(),
            previous: new Date(data1?.PreviousValueDate).toLocaleDateString()
          },
          source: data1?.Source || '',
          adjustment: data1?.Adjustment || ''
        },
        category2Data: {
          latest: data2?.LatestValue || 0,
          previous: data2?.PreviousValue || 0,
          unit: data2?.Unit || '',
          dates: {
            latest: new Date(data2?.LatestValueDate).toLocaleDateString(),
            previous: new Date(data2?.PreviousValueDate).toLocaleDateString()
          },
          source: data2?.Source || '',
          adjustment: data2?.Adjustment || ''
        }
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        category1Data: { latest: 0, previous: 0, unit: '', dates: { latest: '', previous: '' }, source: '', adjustment: '' },
        category2Data: { latest: 0, previous: 0, unit: '', dates: { latest: '', previous: '' }, source: '', adjustment: '' }
      };
    }
  };

  const compareCountries = async () => {
    if (!country1 || !country2 || !category1 || !category2) {
      alert('Please select both countries and categories');
      return;
    }

    const { category1Data, category2Data } = await fetchData(country1, category1);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          `${country1}\n(Previous: ${category1Data.dates.previous})`,
          `${country1}\n(Latest: ${category1Data.dates.latest})`,
          `${country2}\n(Previous: ${category2Data.dates.previous})`,
          `${country2}\n(Latest: ${category2Data.dates.latest})`
        ],
        datasets: [
          {
            label: `${category1} (${category1Data.unit})`,
            data: [category1Data.previous, category1Data.latest, 0, 0],
            backgroundColor: [
              'rgba(74, 144, 226, 0.6)',
              'rgba(74, 144, 226, 0.8)',
              'rgba(74, 144, 226, 0)',
              'rgba(74, 144, 226, 0)'
            ],
            borderColor: 'rgba(74, 144, 226, 1)',
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false,
          },
          {
            label: `${category2} (${category2Data.unit})`,
            data: [0, 0, category2Data.previous, category2Data.latest],
            backgroundColor: [
              'rgba(255, 99, 132, 0)',
              'rgba(255, 99, 132, 0)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 99, 132, 0.8)'
            ],
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
            },
            title: {
              display: true,
              text: 'Value'
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
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const dataset = context.dataset;
                const value = context.raw;
                const unit = dataset.label.split('(')[1].replace(')', '');
                return `${dataset.label.split('(')[0].trim()}: ${value} ${unit}`;
              },
              afterBody: function(tooltipItems) {
                const dataIndex = tooltipItems[0].datasetIndex;
                const data = dataIndex === 0 ? category1Data : category2Data;
                return [
                  `Source: ${data.source}`,
                  `Adjustment: ${data.adjustment}`
                ];
              }
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