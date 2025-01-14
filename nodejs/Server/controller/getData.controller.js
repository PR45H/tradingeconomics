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
        // console.log(data1[0]);
        // filtering data based on search string
        const filterData = (data) => {
            const searchString1 = `${country1} ${category1}`;
            const searchString2 = `${country2} ${category2}`;
            
            
            const filteredData1 = data.filter(item => item.Title.toLowerCase().includes(searchString1.toLowerCase()));
            const filteredData2 = data.filter(item => item.Title.toLowerCase().includes(searchString2.toLowerCase()));
            if (filteredData1.length === 0) {
                return filteredData2;
            } else {
                return filteredData1;
            }
            // return [filteredData1, filteredData2];
        };

        const filterData1 = filterData(data1);
        const filterData2 = filterData(data2);

        console.log(filterData1, filterData2);

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
