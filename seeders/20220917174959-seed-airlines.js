'use strict';

// as this project has no server in it, we will perform our dotenv setup here
require('dotenv').config();

const axios = require('axios');
const APIKEY = process.env.APIKEY;
const HOST = process.env.RAPIDHOST;

module.exports = {
  async up (queryInterface, Sequelize) {
    // making seedin date to store the time we seeded db
    const seedDate = new Date().toISOString();

    // http axios config for first request to fetch all available airlines
    const fetchAirlinesConfig = {
      method: 'GET',
      url: 'https://iata-and-icao-codes.p.rapidapi.com/airlines',
      headers: {
        'X-RapidAPI-Key': APIKEY,
        'X-RapidAPI-Host': HOST
      }
    }

    // array to hold our airline json models to be upload to psotgres with queryGenerator(queryInterface)
    const airlinesToUpload = [];

    // our response for fetching all available airlines
    const airlinesResponse = await axios.request(fetchAirlinesConfig);

    // if we succeeded in fetching all of our airlines, we will continue to fetch each individual airline's details
    if (airlinesResponse.status === 200 &&
      airlinesResponse?.data) {
        // create promise array to hold all of our 700+ http requests to be called in Promise.all
        const promiseArray = [];

        // iterate thorugh all airlines to construct an airline details call using it's iata code
        airlinesResponse.data.forEach(airline => {
          const airlineDetailsConfig = {
            method: 'GET',
            url: 'https://iata-and-icao-codes.p.rapidapi.com/airline',
            params: { iata_code: airline.iata_code },
            headers: {
              'X-RapidAPI-Key': APIKEY,
              'X-RapidAPI-Host': HOST
            }
          }
          // building array of promises to make for every airline. we are not calling these promises yet, no data is fetch at this time
          promiseArray.push(axios.request(airlineDetailsConfig));
        });
        // using Promise.all with await to fetch all airline details, must use await as seeders are async and will cancel if we do not use await here
        const airlineResponses = await Promise.all(promiseArray);
        console.log(airlineResponses);

        // check if we got any airline details back, this will be an array of response objects
        if (Array.isArray(airlineResponses) &&
        airlineResponses.length) {
          // iterate thorugh our responses and for each response, check that the request was successful and that there is data to add to db
          airlineResponses.forEach(airlineRes => {
            if (airlineRes.status === 200 &&
              airlineRes.data) {
                // adding a json object for each row to be added to our airlines table
              airlinesToUpload.push({
                iata_code: airlineRes.data[0].iata_code,
                icao_code: airlineRes.data[0].icao_code,
                lowCostCarrier: airlineRes.data[0].low_cost_carrier,
                name: airlineRes.data[0].name,
                website: airlineRes.data[0].website,
                createdAt: seedDate,
                updatedAt: seedDate
              })
            }
          });
          // pushing our models to the db
          // using queryInterface to bulk add all of our airlines
          await queryInterface.bulkInsert('airlines', airlinesToUpload, {})
        } else {
          console.log('FAILED to fetch individual airline data');
        }
      } else {
        console.log('FAILING in fetching all airlines');
      }
  },

  async down (queryInterface, Sequelize) {
    // when you undo this seed, we would like to clear out our airlines db table
    await queryInterface.bulkDelete('airlines', null, {});
  }
};
