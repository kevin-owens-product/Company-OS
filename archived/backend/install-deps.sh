#!/bin/bash

# Install dependencies
npm install

# Install NestJS dependencies
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/typeorm @nestjs/swagger @nestjs/jwt @nestjs/passport

# Install TypeORM and database dependencies
npm install typeorm pg

# Install authentication dependencies
npm install passport passport-jwt passport-local bcrypt
npm install --save-dev @types/passport-jwt @types/passport-local @types/bcrypt

# Install validation dependencies
npm install class-validator class-transformer

# Install Redis dependencies
npm install redis

# Install Kafka dependencies
npm install kafkajs

# Install Stripe dependencies
npm install @stripe/stripe-js

# Install additional type definitions
npm install --save-dev @types/node 