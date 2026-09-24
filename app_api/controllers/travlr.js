const Trip = require('../models/travlr');

// Validate required trip fields before processing the request
const validateTrip = (tripData) => {
  const requiredFields = [
    'code',
    'name',
    'length',
    'start',
    'resort',
    'perPerson',
    'image',
    'description'
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      tripData[field] === undefined ||
      tripData[field] === null ||
      tripData[field] === ''
  );

  return missingFields;
};

// GET /api/trips
// Supports searching, filtering, and sorting trip records
const tripsList = async (req, res) => {
  try {
    const { search, resort, sort, page = 1, limit = 10 } = req.query;

    // Build the MongoDB query dynamically
    const query = {};

    // Search across trip name, resort, and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { resort: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter trips by resort
    if (resort) {
      query.resort = { $regex: resort, $options: 'i' };
    }

    // Convert pagination values to numbers and calculate records to skip
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    // Create the database query
    let tripQuery = Trip.find(query)
      .skip(skip)
      .limit(limitNumber);
    // Sort results using an approved field
    const allowedSortFields = ['name', 'start', 'resort'];

    if (sort && allowedSortFields.includes(sort)) {
      tripQuery = tripQuery.sort({ [sort]: 1 });
    }

    const trips = await tripQuery;

   return res.status(200).json(trips);

  } catch (err) {
    console.error('Error retrieving trips:', err);

    return res.status(500).json({
      message: 'Unable to retrieve trips'
    });
  }
};

// GET /api/trips/:tripCode
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      code: req.params.tripCode
    });

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json(trip);
  } catch (err) {
    console.error('Error retrieving trip:', err);

    return res.status(500).json({
      message: 'Unable to retrieve trip'
    });
  }
};
// POST /api/trips
const tripsAddTrip = async (req, res) => {
  try {
    const missingFields = validateTrip(req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required trip information',
        missingFields: missingFields
      });
    }

    const existingTrip = await Trip.findOne({
      code: req.body.code
    });

    if (existingTrip) {
      return res.status(409).json({
        message: 'A trip with this code already exists'
      });
    }

    const newTrip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    return res.status(201).json(newTrip);
  } catch (err) {
    console.error('Error creating trip:', err);

    return res.status(500).json({
      message: 'Unable to create trip'
    });
  }
};
// PUT /api/trips/:tripCode
const tripsUpdateTrip = async (req, res) => {
  try {
    const missingFields = validateTrip(req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required trip information',
        missingFields: missingFields
      });
    }

    const trip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json(trip);
  } catch (err) {
    console.error('Error updating trip:', err);

    return res.status(500).json({
      message: 'Unable to update trip'
    });
  }
};

// DELETE /api/trips/:tripCode
const tripsDeleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      code: req.params.tripCode
    });

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting trip:', err);

    return res.status(500).json({
      message: 'Unable to delete trip'
    });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};