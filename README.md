# booking-system

## Run locally
Run in docker
```console
npm run docker:build

npm run docker:start
```

Run with ts-node-dev
```console
npm install

npm run start
```

## Not included
This API does not contain any authentication or authorization. 
Authentication could be handled by a middleware.
Authorization should be handled by the different services in the application.

The relationship between property managers and properties is not implemented. 
Property managers should be stored in a database and connected to a property. Maybe the guests table could be replaced with a user table to include both managers and guests depending on reqirements.
This will support more granular authorization so that managers only get access to their properties and messages. 

This server uses a SQLITE database due to time constrains. This database would not be a good choise for a production ready application but serves well for demonstration. For a real application, a stand alone SQL-database would be a good choise. MySQL, Postgres or similar. For this application to scale, it need a singel source of truth database, not tied to the server it self.

Improvements to endpoint is documented in each router.

## Database
Table definitions can be found in the sql folder. 

## Endpoints
This api have four main endpoint paths; `guests`, `properties`, `reservations` and `messages`.

`guests`, `properties` and `reservations` supports the same base endpoints for CRUD operations.

| Method | Path         | Operation                     |
| ------ | ------------ | ----------------------------- |
| GET    | /            | Get all entities              |
| GET    | /:id         | Get a specific entity by id   |
| POST   | /create      | Create a new entity           |
| PUT    | /update/:id  | Update a specific entity      |
| DELETE | /delete/:id  | Delete a specific entity      |


`guests` supports the following extra enpoints.

| Method | Path              | Operation                                 |
| ------ | ----------------- | ----------------------------------------- |
| GET    | /:id/reservations | Get all reservations for a specific guest |


`properties` supports the followint extra endponts.

| Method | Path              | Operation                                                 |
| ------ | ----------------- | --------------------------------------------------------- |
| GET    | /:id/reservations | Get all reservations for a specific property              |
| GET    | /:id/guests       | Get all guests with a reservation for a specific property |


`messages` support the following endpoints.

| Method | Path         | Operation                                     |
| ------ | ------------ | --------------------------------------------- |
| GET    | /guest/:id   | Get all messages to and from a specific guest |
| POST   | /create      | Create a new message                          |
| PUT    | /update/:id  | Update a specific message                     |
| DELETE | /delete/:id  | Delete a specific message                     |


## Examples

Create a new guest
```console
curl --location --request POST 'localhost:3000/guests/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jane Doe",
    "phoneNumber": "0709876543210"
}
'
```

Fetch all guests
```console
curl --location --request GET 'localhost:3000/guests'
```

Update a guest 
```console
curl --location --request PUT 'localhost:3000/guest/update/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jane Doe",
    "phoneNumber": "0730000000"
}
'
```

Delete a guest 
```console
curl --location --request DELETE 'localhost:3000/guest/delete/1'
```

Create a property 
```console
curl --location --request POST 'localhost:3000/properties/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "House 1"
}
'
```

Create a reservation 
```console
curl --location --request POST 'localhost:3000/reservations/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "startDate": "2023-02-05",
    "endDate": "2023-02-07",
    "propertyId": "1",
    "guestId": "2",
    "status": "BOOKED"
}
'
```

Get all guests booked for a property
```console
curl --location --request GET 'localhost:3000/properties/1/guests'
```


Get all messages for a guest
```console
curl --location --request GET 'localhost:3000/messages/guest/1'
```
