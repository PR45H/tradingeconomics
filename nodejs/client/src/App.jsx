import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const apiKey = "369ad36926fa407:ekofu92vnzjwm9v"

  const [country1, setCountry1] = useState('Sweden')
  const [country2, setCountry2] = useState('Mexico')
  const [data, setData] = useState([])

  const display_result = async (selectedCountry1, selectedCountry2) => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get(`https://api.tradingeconomics.com/search/${encodeURIComponent(selectedCountry1)}?category=markets&c=${apiKey}`),
        axios.get(`https://api.tradingeconomics.com/search/${encodeURIComponent(selectedCountry2)}?category=markets&c=${apiKey}`)
      ]);
      const mergedData = [...response1.data, ...response2.data];
      const filteredData = mergedData.filter(
        (item) => item.Symbol && item.Name && item.Country
      );
      console.log(mergedData);
      setData(filteredData);
    } catch (error) {
      toast.error(`Error fetching data for ${selectedCountry1} or ${selectedCountry2}: ${error.message}`, {
        position: 'bottom-right',
        autoClose: 5000,
        theme: "light",
      });
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedCountry1 = e.target.elements.Country1.value
    const selectedCountry2 = e.target.elements.Country2.value
    setCountry1(selectedCountry1)
    setCountry2(selectedCountry2)
    display_result(selectedCountry1, selectedCountry2)
  }

  return (
    <>
      <div>
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Country1">Choose a Country:
                <select name="Country1" value={country1} onChange={(e) => setCountry1(e.target.value)}>
                  <option value="Sweden">Sweden</option>
                  <option value="Mexico">Mexico</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Thailand">Thailand</option>
                </select>
              </label>
            </div>

            <div>
              <label htmlFor="Country2">Choose a Country:
                <select name="Country2" value={country2} onChange={(e) => setCountry2(e.target.value)}>
                  <option value="Sweden">Sweden</option>
                  <option value="Mexico">Mexico</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Thailand">Thailand</option>
                </select>
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div>
        {data.map((d, i) => (
          <div key={d.Symbol || i}>
            <h1>{d.Name} ({d.Type})</h1>
            <p>Country: {d.Country}</p>
            <p>Last: {d.Last} {d.unit}</p>
            <p>Last Update: {new Date(d.LastUpdate).toLocaleString()}</p>
          </div>
        ))}
      </div>

      
      <ToastContainer/>
    </>
  )
}

export default App
