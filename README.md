# Micro-services
## Description générale
Ce projet est un projet de micro-services. Il est composé de 6 micro-services qui sont :
- Books
- Authors
- Categories
- Reviews
- Users
Chacun de ces micro-services est un CRUD qui permet de gérer les données de la base de données.
Chacun d'entre eux comprend ces fonctionnalités : 
- Pagination
- Tests unitaires
- Recherche
## Books
CRUD > Port 3000
### Test
```bash
cd books
npm run test
```
### Run
```bash
npm run start-books
```
## Authors
CRUD > Port 4000
### Test
```bash
cd authors
npm run test
```
### Run
```bash
npm run start-authors
```
## Categories
CRUD > Port 5000
### Test
```bash
cd categories
npm run test
```
### Run
```bash
npm run start-categories
```
## Reviews
CRUD > Port 6000
### Test
```bash
cd reviews
npm run test
```
### Run
```bash
npm run start-reviews
```
## Users
CRUD > Port 7000
### Test
```bash
cd users
npm run test
```
### Run
```bash
npm run start-users
```