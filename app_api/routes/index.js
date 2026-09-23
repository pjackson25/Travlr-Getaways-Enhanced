const passport = require('passport');
const express = require('express');
const router = express.Router();
const ctrlTrips = require('../controllers/travlr');
const ctrlAuth = require('../controllers/authentication');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router
  .route('/trips')
  .get(ctrlTrips.tripsList)
  .post(
    passport.authenticate('jwt', { session: false }),
    ctrlTrips.tripsAddTrip
  );

router
  .route('/trips/:tripCode')
  .get(ctrlTrips.tripsFindByCode)
  .put(
    passport.authenticate('jwt', { session: false }),
    ctrlTrips.tripsUpdateTrip
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    ctrlTrips.tripsDeleteTrip
  );
module.exports = router;