const { default: axios } = require('axios');
require('dotenv').config();
const apiKey = process.env.API_KEY;

const getData = async (req, res) => {
    try {
        const { country1, country2, category1, category2 } = req.query;
        if (!country1 || !country2) {
            return res.status(400).json({ message: 'Please provide both countries' });
        }
        if (!category1 || !category2) {
            return res.status(400).json({ message: 'Please provide both categories' });
        }

        const fetchData = async (country, category) => {
            let data = [];
            let offset = 0;
            let limit = 500;
            let hasMoreData = true;

            while (hasMoreData) {
                const response = await axios.get(
                    `https://api.tradingeconomics.com/peers/country/${country}/${category}?c=${apiKey}&offset=${offset}&limit=${limit}`
                );
                data = data.concat(response.data);
                offset += limit;
                hasMoreData = response.data.length === limit;
                
                // Throttle requests: wait for 1 second before the next call
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            return data;
        };

        // Sequentially fetch data to avoid rate limiting
        const data1 = await fetchData(country1, category1);
        const data2 = await fetchData(country2, category2);

        
        const filterData = (data1, data2) => {
            const filteredData1 = data1.filter(item => item.Title.includes(`${country1} ${category1}`));
            const filteredData2 = data2.filter(item => item.Title.includes(`${country2} ${category2}`));
            return [filteredData1, filteredData2];
        }
        const filteredData = filterData(data1, data2);
        
        console.log(filteredData);

        res.json({
            message: `Data for ${country1} - ${category1}, and ${country2} - ${category2} fetched successfully`,
            data1,
            data2
        });

    } catch (error) {
        console.log(error);
        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = { getData };
