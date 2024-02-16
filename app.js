const express = require('express')
// import {express} from "express";
const app = express()
app.use(express.json())

const sqlite3 = require('sqlite3')
// import {sqlite3} from "sqlite3";
const {open} = require('sqlite')
// import {open} from "sqlite";

const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server is Running at http:localhost:3000/'),
    )
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

initializeDBAndServer()
// GET API 1
app.get('/players', async (request, response) => {
  const getBookQuery = `
        SELECT * FROM cricket_team;
    `
  const playersArray = await db.all(getBookQuery)
  // console.log(playersArray)
  response.send(playersArray)
})

// POST API 2
app.post('/players/', async (request, response) => {
  const newPlayerDetails = request.body
  console.log(newPlayerDetails)
  const {player_name, jerseyNumber, role} = newPlayerDetails
  const newPlayerQuery = `
    INSERT INTO cricket_team(
      player_name, jersey_number, role
    ) 
    VALUES 
    ("${player_name}", ${jerseyNumber}, "${role}");
  `
  const dbResponse = await db.run(newPlayerQuery)
  response.send('Player Added to Team')
})

// Get a player by Id
app.get('/players/:playerID/', async (request, response) => {
  const {playerID} = request.params
  const getPlayerQuery = `
    SELECT * FROM cricket_team WHERE player_id = ${playerID}
  `
  const playerArray = await db.get(getPlayerQuery)
  response.send(playerArray)
})

// Put API 4
app.put('/players/:playerID', async (request, response) => {
  const {playerID} = request.params
  const updatePlayerDetails = request.body
  const {playerName, jerseyNumber, role} = updatePlayerDetails
  const updatePlayerQuery = `
    UPDATE cricket_team
    SET 
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  `
  const dbResponse = await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

// Delete API 5
app.delete('/players/:playerID', async (request, response) => {
  const {playerID} = request.params
  const deletePlayerQuery = `
    DELETE FROM cricket_team 
    WHERE 
    player_id = ${playerID};
  `
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
