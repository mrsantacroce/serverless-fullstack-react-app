# serverless-fullstack-react-app
Full-Stack REST API Application on AWS

This was built to complete the following coding challenge: https://github.com/serverless-guru/code-challenges/tree/master/code-challenge-6

## Instructions for Challenge

### First Part: Serverless Backend
1. Build a Serverless Framework REST API with AWS API Gateway which supports CRUD functionality (Create, Read, Update, Delete) *don't use service proxy integration directly to DynamoDB from API Gateway

1. Please use GitHub Actions CI/CD pipeline, AWS CodePipeline, or Serverless Pro CI/CD to handle deployments.

1. You can take screenshots of the CI/CD setup and include them in the README.

1. The CI/CD should trigger a deployment based on a git push to the master branch which goes through and deploys the backend Serverless Framework REST API and any other resources e.g. DynamoDB Table(s).

### Second Part: React Frontend
1. Build a frontend application in React that connects to the serverless backend application. The React application must use all 4 CRUD functionality.

1. The frontend should be visually appealing and utilizes modern web design. Please use widely practiced CSS library instead of using your own custom CSS

1. Application must follow responsive web design for at least 4 different device sizes.

1. Deployment of the React application is up to your choice. Please provide your entry point url of the react application when finished.

### Requirements
1. All application code must be written using Javascript. Typescript is acceptable as well. Backend application is written in Node.js and frontend application written in React

1. Backend AWS Infrastructure needs to be automated with IAC using Serverless Framework

1. The API Gateway REST API should store data in DynamoDB

1. There should be 4-5 lambdas that include the following CRUD functionality (Create, Read, Update, Delete) *don't use service proxy integration directly to DynamoDB from API Gateway

1. Build the CI/CD pipeline to support multi-stage deployments e.g. dev, prod

1. The template should be fully working and documented

1. A public GitHub repository must be shared with frequent commits

1. A video should be recorded (www.loom.com) of you talking over the application code, IAC, and any additional areas you want to highlight in your solution to demonstrate additional skills

NOTE: Please spend only what you consider a reasonable amount of time for this.

### Optionally
Please feel free to include any of the following to show additional experience:

1. Make the project fit a specific business case, instead of a skeleton CRUD request/response.

1. AWS Lambda packaging

1. Organization of YAML files

1. Bash/other scripts to support deployment

1. Unit tests, integration tests, load testing, etc

1. Setup AWS Cognito as part of the backend task and use it for app signup/login. All pages accessible only to authorized users except signup/login

## How to Run App
TODO

## References and Inspiration
- [Node API on Serverless with DynamoDB](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb-and-offline)
- [GitHub Deployment](https://github.com/serverless/github-action)
