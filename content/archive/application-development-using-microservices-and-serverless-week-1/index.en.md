---
title: "Application Development using Microservices and Serverless Week 1"
image: "cover.png"
date: 2023-03-28T22:25:06Z
lastmod: 2023-03-28T22:25:07Z
categories: ["IBM fullstack"]
draft: false
aliases:
  - /application-development-using-microservices-and-serverless-week-1/
---

## Twelve-Factor App

### Modern software development

- Delivered as a service
- Centrally hosted and accessed through the internet
- Web apps, software-as-a-service (SaaS)
- Twelve-factor app methodology is suited for these types of applications
    - Frequently used with microservices

### Grouping the twelve factors

The twelve factors can be grouped according to the following phases of the software delivery lifecycle:

- Code
- Deploy
- Operate

#### Code factors

Factor 1: Codebase

- Tracked in a version control system (VCS)
- One-to-one relationship between the codebase and an app
- Multiple deploys of the app
- Different versions of the codebase can be in each deploy

Factor 5: Build, release, run

- Build: Transform a codebase into an executable unit called a build
- Release: Combine build with configuration so that it's ready to run
- Run: Runs the application

Factor 10: Dev/prod prod parity

- Minimize differences between development and production environments
- Backing services should be the same across environment

#### Deploy factors

Factor 2: Dependencies

- An app is only as reliable as its least reliable dependency
- Code explicitly declares any dependencies

Factor 3: Config

- Config contains everything that varies between deploys such as credentials and backing service locations
- Keep separate from the code
- Store config in environment variables

Factor 4: Backing services

- Apps should not distinguish between local and third-party services
- All services should be accessed by a URL and credentials so that they can be swapped without changing code

Factor 6: Processes

- Stateless and share nothing
- Backing services store persistent data since memory and filesystems aren't shared across processes
- Data is centrally stored

Factor 7: Port binding

- Export services by port binding
- HTTP and other services are exported this way
- Declare a webserver library dependency
- Apps can now become backing services for other apps

#### Operate factors

Factor 9: Disposability

- Minimal process start time and graceful termination
- Quickly deploy code or config changes
- Easily scale apps

Factor 11: Logs

- App should not concern itself with storing logs
- Treat logs as an event stream written to stdout
- Execution environment captures the stream for all apps, aggregates the logs, and routes logs to their destination

Factor 8: Concurrency

- Concurrent processes can be used to scale an application
- Stateless processes can be spun up without creating dependencies on other processes

Factor 12: Admin processes

- Enable one-off app management processes such as database migration
- Run against a release, using same codebase and config
- Are included in application code

## Microservices

### Monolith programs

- Server-side system based on single application
- Easy to develop, deploy and manage

#### Challenge

- Highly dependent
- Language/Framework
- Growth
- Hero Deployment
- Scaling

### Microservices

- Every app function is its own service
- Own container
- Communicate via APIs

#### Advantage

- Language diversity
- Iterate at will/ Develop pipeline
- Less risk in challenge
- Independent scaling

## Advantages of Microservices

### Background

- Microservices are used and discussed extensively in cloud computing
- Service oriented architecture (SOA) is often compared to microservices
- There is debate about the relationship between these two technologies and which technology you should use

### Microservices architecture

- Decouple application components to be independently deployable, scalable, maintainable, and more
- Decompose large application into smaller applications
- Enable smaller apps to work together to perform the function of the one large app

### Service Oriented Architecture

- Make software components reusable via service interfaces
- Uses common communication standards to enable rapid integration of components into applications
- Each services performs a complete business function
- Little to no knowledge of how the integration is implemented is needed to call service interfaces
- Service publication helps developers find and reuse services to assemble new applications

#### SOA benefits

- Greater business agility means faster time to market
- Improved collaboration between the business and IT

### The relationship between Microservices and SOA

SOA relates to enterprise service exposure Microservices relate to application architecture

Architecture

Focus

Results

SOA

Reuse

Enables multiple applications to use the same services

Microservices

Decomposing monolithic apps

Enables more flexible and faster development of one application

## Microservices Patterns and Anti-patterns

### Patterns for microservices

Created to enable more efficient DevOps Examples:

- Single page application pattern
    - Enabled by more powerful browsers, faster networks, and client-side languages
    - Loads one interface-side languages
    - Updates dynamically using calls to backing REST-based services
    - Simplifies the front-end experience
    - Places greater performance responsibility on backing services
- Backend for Frontend (BFF) pattern
    - Provides superior support compared to a generic backend
    - Inserts a layer between user experience and the resources that call the user experience
    - Enables customized user experiences for different channels such as mobile, desktop, and laptop
    - Enables desktop app and mobile app to have specific backend microservices
- Strangler pattern
    - Helps manage the refactoring of monolithic apps in stages
    - Get name from a vine that strangles a tree
    - Splits the application into functional domains and replaces those domains with microservice-based implementations one at a time
    - Separate applications live side-by-side until the new app can completely replace the original app
    - Transform
        
        Coexist
        
        Eliminate
        
        Create a parallel new site
        
        Leave the existing site where it is for a time Incrementally redirect from the existing site to the new site for newly implemented functionality
        
        Remove the old functionality from the existing site as traffic is redirected away from that portion of the old site
        

#### Other patterns

Numerous patterns help address challenges and opportunities:

- Entity and aggregate patterns
- Service discovery patterns
- Adapter microservices patterns
- Others

### Anti-patterns

Anti-patterns are action microservices that can quickly get development teams into trouble

#### Don't start with microservices

- Microservices help manage complexity once the applications have gotten too unwieldy
- Implement microservices only when you feel the pain and complexity of monolith

#### Don't use without DevOps or Cloud

Microservices require:

- DevOps for proper deployment cloud services
- Cloud services for monitoring automation

### Avoid overly small microservices

- Overly small microservices create time-consuming overhead
- Learn toward creating larger services and create smaller services when
    - Deploying changes becomes difficult
    - The common data model becomes overly complex
    - Loading and scaling requirements no longer synchronize and affect application performance
