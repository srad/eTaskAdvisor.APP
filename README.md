# eTaskAdvisor.App

[![Build Status](https://jenkins.sedrad.com/buildStatus/icon?job=eTaskAdvisor.App)](https://jenkins.sedrad.com/job/eTaskAdvisor.App/)

This project is part of a `Learning Technologies` university course.

The goal was to research the literature of `cognitive psychology` and `learning` about the effects of environmental factors on learning tasks and to develop a framework to capture and categorize the effects to feed the knowledge into a system and provide an API to access the knowledge for recommendations. 

For this purpose this project provides a web frontend. The data is provided by a Web API implemented by [eTaskAdvisor.WebApi](https://github.com/srad/eTaskAdvisor.WebApi)

This project is implemented in Vue.js 2.x and JavaScript and can consume any RESTFul endpoint.

## Screenshots

<img src="/../master/docs/ui0.png?raw=true" width="30%"> <img src="/../master/docs/ui1.png?raw=true" width="30%"> <img src="/../master/docs/ui2.png?raw=true" width="30%">

## Setup

First install node.js >=10.x and Vue.js 2.x

```bash
git clone https://github.com/srad/eTaskAdvisor.App
cd eTaskAdvisor.App
npm install
npm run serve
```

## Commands

Command                    | Description
---------------------------|---------------------------------------------------------------------------------------
npm install                | Install dependencies
npm run serve              | Compiles and hot-reloads for development
npm run build              | Compiles and minifies for production
npm run test:unit          | Run your unit tests
npm run lint               | Lints and fixes files
