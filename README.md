# "Back End Web Development Final Project"

**Description:**

This repository shares the code for Node.js REST API for US States data using both Express and MongoDB.
Please use the following link to test the API on postman: https://usstatesdatanodejs-api-esthermande.replit.app/

### Endpoints

note: use state abbreviation for :state. For example, use KS for Kansas.
**GET /states/**
Returns data from states.json initially.
Handles all, contiguous, or non-contiguous states based on query parameters(**GET /states/?contig=true or GET /states/?contig=false**).
Fetches "funfacts" from MongoDB and attaches them to the response.

**GET /states/:state**
Retrieves data for a specific state from states.json.
Includes "funfacts" from MongoDB if available.

**GET /states/:state/funfact**
Provides a random fun fact for the specified state.
Handles cases where no fun facts are available.

capital, nickname, population, admission endpoints
Returns specific state data from states.json.

**POST /states/:state/funfact**
Adds new fun facts for a state to MongoDB.

**PATCH /states/:state/funfact**
Updates existing fun facts for a state in MongoDB.
Required request body properties: index and funfact
The index parameter value should not be zero-based.

**DELETE /states/:state/funfact**
Removes fun facts for a state from MongoDB.
Required request body property: index
The index parameter value should not be zero-based.
