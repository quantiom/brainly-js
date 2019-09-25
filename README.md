# Brainly-JS
Interact with [brainly.com](https://brainly.com) in NodeJS.
Logging in with an account is optional.

## Example
```js
const Brainly = require('@quantiom/brainly-js');
let client = new Brainly('email', 'password'); // logging in is optional

// logging in is not required for these functions
client.searchQuestions('square root of 4', 10).then(questions => { /* ex: question.answers */ });
client.getQuestion('question ID').then(question => { /* ex: question.answers */ });

// being logged in is required for responding and asking questions
client.on('logged_in', token => { // token is the 'x-b-token-long' header used for authorization in requests
  client.addResponse('question ID', 'This is a response.').then(console.log); // respond to a question
  client.askQuestion('This is a question.', 'Mathematics', 10).then(console.log); // ask question for 10 points in the Mathematics category
});
```

## Requirements
- `node` (https://nodejs.org)

## Installing
`npm i @quantiom/brainly-js` , or clone the git repo.
