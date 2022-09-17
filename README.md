# Example project for seeding large amounts of data using seeders

# Setup

1. run 'npm i'
2. create the seeding_example database and update your config.json file for your local machine
3. create your .env file and add your APIKEY and RAPIDHOST properties, this will be used inside the seeder
3. run 'sequelize db:migrate'
4. run 'sequelize db:seed:all'

# what API are we going ot use

this one: https://rapidapi.com/vacationist/api/iata-and-icao-codes/ 

# What did this all do

This process will use our seed airlines seeder file to generate records for each airline inside of the airlines table. After you run the seed all command, explore the airlines db table to see what was produced. 