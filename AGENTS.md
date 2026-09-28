# Vending Machine Project

## Start here

- Client application: `client/src`
- Mock API: `server`
- Initial product data: `server/data/products.json`
- Domain logic: `client/src/domain`
- State logic: `client/src/state`
- Setup and commands: `README.md`

## Required business rules

- Store money as integer cents.
- Accepted coins are 10, 20, 50, 100, and 200 cents.
- Product quantity must be an integer from 0 through 15.
- Initial products must be fetched from `GET /api/products`.
- Product creation, editing, and deletion update client state only.
- Failed purchases must not change stock or remove inserted credit.
- Successful purchases decrease stock by exactly one.
- Successful purchases add inserted coins to the finite cashbox and remove dispensed change.
- Purchases that cannot return exact change leave stock, credit, and cashbox unchanged.
- Reset returns all inserted coins without changing stock.
- Keep domain logic outside React components.

## Validation

Before considering a change complete, run `npm run lint`, `npm test`, and `npm run build`.
