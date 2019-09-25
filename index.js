const { request } = require('graphql-request');
const EventEmitter = require('events');
const queries = require('./queries');
const rp = require('request-promise');

const URLs = {
    login: 'https://brainly.com/api/28/api_account/authorize',
    answerQuestion: 'https://brainly.com/api/28/api_responses/add',
    askQuestion: 'https://brainly.com/api/28/api_tasks/add',
    graphQL: 'https://brainly.com/graphql/us'
};

const subjects = { 
    Mathematics: '2',
    History: '5',
    English: '1',
    Biology: '8',
    Chemistry: '18',
    Physics: '15',
    Social: '3',
    Advanced: '31',
    SAT: '32',
    Geography: '7',
    Health: '6',
    Arts: '21',
    Business: '4',
    Computers: '19',
    French: '29',
    German: '30',
    Spanish: '28',
    World: '22',
    Medicine: '33',
    Law: '34',
    Engineering: '35' 
};

module.exports = class Brainly extends EventEmitter {
    /**
     * @param {string} [email] 
     * @param {string} [password] 
     */
    constructor(email = '', password = '') {
        super();

        if (email && password) {
            this.login(email, password).then((token) => {
                this.token = token;
                this.emit('logged_in', token);
            });
        }
    }

    /**
    * @description Log into brainly.com
    * @param {string} email
    * @param {string} password
    * @returns {Promise<string>}
    */
    login(email, password) {
        return new Promise((resolve, reject) => {
            rp({
                uri: URLs.login,
                method: 'POST',
                body: `{"username":"${email}","password":"${password}","client_type":5}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'Accept': '*/*',
                    'Cache-Control': 'no-cache',
                    'Host': 'brainly.com',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive'
                },
                resolveWithFullResponse: true
            }).then(res => {
                if (!res.toJSON().headers['x-b-token-long'])
                    reject('Invalid login.');

                resolve(res.toJSON().headers['x-b-token-long']);
            });
        });
    }

    /**
    * @description Searches for questions/answers
    * @param {string} query The query to search for
    * @param {amount} amount The amount of results to get (limit: 100)
    * @returns {Promise<Object>}
    */
    searchQuestions(query, amount = 10) {
        return new Promise(resolve => {
            request(URLs.graphQL, queries.search, { query, first: amount, after: null }).then(data => {
                resolve(
                    data.questionSearch.edges.map(e => ({ ...e, ...e.node }))
                    .map(e => { delete e.node; return e; })
                    .map(e => ({ ...e, answers: [ ...e.answers.nodes ] }))
                );
            });
        });
    }

    /**
    * @description Gets question data by ID
    * @param {*} id The question ID, either base64 encoded, or raw
    * @returns {Promise<Object>}
    */
    getQuestion(id) {
        return new Promise(resolve => {
            id = id.toString();

            if ((Buffer.from(id, 'base64').toString('ascii')).startsWith('question'))
                id = Number((Buffer.from(id, 'base64').toString('ascii')).split(':')[1]);

            request(URLs.graphQL, queries.getQuestionByID, { id }).then(data => {
                data.questionById = { ...data.questionById, answers: [...data.questionById.answers.nodes]};
                resolve(data.questionById);
            });
        });
    }

    /**
     * @description Responds to a question
     * @param {*} id The question ID, either base64 encoded, or raw 
     * @param {string} response The question response
     */
    addResponse(id, response) {
        return new Promise((resolve, reject) => {
            if (!this.token) return reject('Not logged in.');

            id = id.toString();

            if ((Buffer.from(id, 'base64').toString('ascii')).startsWith('question'))
                id = Number((Buffer.from(id, 'base64').toString('ascii')).split(':')[1]);

            rp({
                uri: URLs.answerQuestion,
                method: 'POST',
                body: `{"task_id":${id},"content":"${response}","attachments":[]}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'Accept': '*/*',
                    'Cache-Control': 'no-cache',
                    'Host': 'brainly.com',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'x-b-token-long': this.token,
                    'Referrer': `https://brainly.com/question/${id}`
                }
            }).then(resolve).catch(reject);
        });
    }

    /**
     * @description Asks a question
     * @param {string} question
     * @param {string} subject
     * @param {int} points
     */
    askQuestion(question, subject, points = 10) {
        return new Promise((resolve, reject) => {
            if (!this.token) return reject('Not logged in.');
            console.log(`{"content":"${question}","subject_id":${subjects[subject]},"points":${points},"attachments":[]}`)
            rp({
                uri: URLs.askQuestion,
                method: 'POST',
                body: `{"content":"${question}","subject_id":${subjects[subject]},"points":${points},"attachments":[]}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'Accept': '*/*',
                    'Cache-Control': 'no-cache',
                    'Host': 'brainly.com',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'x-b-token-long': this.token,
                    'Referrer': `https://brainly.com/`
                }
            }).then(resolve).catch(reject);
        });
    }
};