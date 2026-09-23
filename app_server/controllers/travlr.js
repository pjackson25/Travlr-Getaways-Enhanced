const axios = require('axios');

const travel = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/api/trips');

        res.render('travel', {
            title: 'Travlr Getaways',
            trips: response.data
        });
    } catch (error) {
        console.error('Error retrieving trips from API:', error.message);

        res.status(500).render('error', {
            message: 'Unable to retrieve trip information.',
            error
        });
    }
};

module.exports = {
    travel
};