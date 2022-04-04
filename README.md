# LGA-Events
A website which uses a webscraper in order to list various events from Local Government Area websites around Sydney

## Table of contents
* [Project Status](#project-status)
* [Installation](#installation)
* [Reflection](#reflection)

# Project Status
This project is currently in development. Parramatta's website is the only website scrapped. This will be the case until the client-side design and functionality has been finalised.

# Installation
We use Yarn for this project
```
#Install dependencies
yarn install

#Run server
yarn start
```

# Reflection
After graduating from TAFE NSW with a Diploma in Software Development, we wanted to develop something which will test our understanding of various techonlogies while looking for employment. 

We decided to develop a webscraper which will extract event data from Local Government Area (LGA) websites with the end goal of being an aggregator for events listed on LGA websites around Sydney.

The challenges we have faced throughout this project have been implementing Google Cloud Storage between multiple people using API keys and storing them in a shell profile which took a lot of research into environment variables and shell profiles. Type guarding and null checking is something we have been introduced to with Typescript however after a lot of time creating the scraper we have a more thorough understanding.

We used React with Typescript for the front-end. Originally we used .NET for the back-end however we ran into problems with the webscraper package we were using. We decided to pivot to using Node.js with Typescript for the back-end using <a href="https://playwright.dev/">Playwright</a> which has better support. Google Cloud Storage is used to store the events in a JSON file and called using an `Axios.get()` method in the front-end to display the events. <a href="https://styled-components.com/">Styled-Components</a> is used for front-end design as we wanted to build onto our CSS fundamentals without a framework.
