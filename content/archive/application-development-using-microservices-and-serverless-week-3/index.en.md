---
title: "Application Development using Microservices and Serverless Week 3"
image: "cover.png"
date: 2023-03-28T22:26:08Z
categories: ["IBM fullstack"]
draft: false
aliases:
  - /application-development-using-microservices-and-serverless-week-3/
---

## Create and Invoke Actions - Part 1

- You can create Cloud Functions actions using source code
- You can invoke Actions using either blocking or non-blocking invocations
- Activation records are stored for each invocation and can be used to obtain the invocation's response

## Create and Invoke Actions - Part 2

- Parameters can be passed to actions and given default values
- Actions can call other actions by using a pre-installed OpenWhisk library

Fuck stupid IBM. I hate your service. Congratulations! You have completed this module. At this point in the course, you know that:

- You can create Cloud Functions actions using source code
- Actions can pass parameters and apply default values. Actions can call other actions by using a pre-installed OpenWhisk library. Sequences are a type of action and are created by chaining together existing actions. You can invoke actions using either blocking or non-blocking invocations. Activation records are stored for each invocation and you can use the activation record to obtain the invocation’s response
- Functions provides packages that you can use and bind to specify default parameters. You can create packages to group your actions, manage default parameters, and share entities with other users.
- A rule associates one trigger with one action. When the associated trigger is fired, rules invoke actions. Using multiple rules can cause a trigger to invoke multiple actions or an action to be invoked by multiple triggers
- Web actions create a public URL that you can use to invoke an action rather than using triggers and rules. After creating a web action, you can use the Cloud Functions integrated API Gateway to expose web actions via an API.
- You can use the API Gateway to perform robust API management on your behalf, such as routing and rate limiting.

## Microservices, Serverless, OpenShift Module 3 Glossary: ORM: Microservices with Serverless

Term

Definition

API Gateway

An API management tool that sits between a client and a backend service. An API gateway accepts all application programming interface (API) calls, aggregates services required to fulfill them, and returns results.

Blocking Invocation

A function that invokes an action and waits for a result.

Event Source

The entity that generated the event.

Feed

A special type of action that monitors a specified Cloudant instance and fires triggers when changes are made to documents, allowing actions to react and perform work.

Non-Blocking Invocation

A function that invokes an action immediately but does not wait for a response.

Rate Limiting

A strategy for limiting the number of incoming requests in a given time period.

RESTful API

The Representational State Transfer API, also known as a RESTful API, conforms to the REST architectural style and allows interaction with RESTful web services.

Routing

The process of selecting a path for an incoming request within a network of services.

Web Action

An action that a user takes from one web page to another. They can be invoked from anywhere without defining a trigger or a rule. The can be accessed through a REST interface without credentials. They support all content types on an HTTP response so that functions can return HTML, XML, SVG, PNG, and others, with intelligent defaults for JSON. They also support all HTTP methods.
