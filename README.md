# TASK UPDATES

## Current Challenges

- Managing high customer traffic and product browsing
  <br>UPDATE: all client, products, sellers, invoices saved in database, so any browsing pages api and pages can be builded
- Inefficient inventory tracking relying on paper records
  <br>UPDATE: all products that client have in inventory saved in database. it's possible to add some log saving on inventory update event, to keep tracking history
- Applying variable discounts to total order sales
  <br>UPDATE: created 3 type of sales:
  <br>`normal` - just sale for some products, visible for everyone
  <br>`individal` - sale for list of clients, visible for assigned clients
  <br>`limit` - sale works if some client by enough items to reach sale `orderAmount` limit
- Pricing products based on weight
  <br>UPDATE: created 2 type of products:
  <br>`products sold by piece` - they have fixed `weight` and `price` for it
  <br>`products sold by weight` - they have no weight and `price` defined for 1000g
- Implementing daily discounts on specific products
  <br>UPDATE: all types of sale can be used as daily sales. May be integrated same active date period feature for sales
- Managing rewards for customers with frequent visits
  <br>UPDATE: `individual` sale type is perfect for it

## What We're Looking For

Design a data model and API for the order creation and sending paycheck to client.
The technology stack should include Node.js and Prisma preferred for the database.

UPDATED: `Compleated`

created api's:

- `POST /seller` - create a new seller
- `POST /client` - create a new client
- `POST /product` - seller create a new product
- `POST /sale` - seller create a sale
- `GET /inventories` - get client inventories (uniq for each seller)
- `PUT /inventories/update` - update user inventory, add, remove, edit invenoty items. It may aslo remove or create a new inventory
- `POST /inventories/pay` - client pay for inventory and create an invoice
- `POST /invoice/refund` - client refund some items from invoice (new `refund` type invocie created with negative total)

created kappy test scenario, execution example:

```
Happy case, check whole platform functionality
    √ Create a new Seller (199 ms)
    √ Create a new Client (65 ms)
    √ Create a product Eggs (76 ms)
    √ Create a product Carrots (27 ms)
    √ Create a product Rice (21 ms)
    √ Create a product Chicken (20 ms)
    √ Create a product Cheese (23 ms)
    √ Create a Normal sale (74 ms)
    √ Create a Individual sale (25 ms)
    √ Create a Limit sale (20 ms)
    √ Check client empty inventories list (59 ms)
    √ Add Eggs to inventory (33 ms)
    √ Add Carrots to inventory (35 ms)
    √ Update inventory Carrots (32 ms)
    √ Remove inventory Carrots (29 ms)
    √ Remove inventory Eggs (26 ms)
    √ Add Eggs to inventory (34 ms)
    √ Add Carrots to inventory (39 ms)
    √ Add Cheese to inventory (30 ms)
    √ Add Rice to inventory (31 ms)
    √ Pay for all items in inventory (Create Invoice) (78 ms)
    √ Return some Items (Create Return Invoice) (27 ms)
    √ Return same Items again (Create Return Invoice) (13 ms)

Test Suites: 1 passed, 1 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        6.424 s
```

# Pogos LLC Software Engineering Exercise - Pipe17 project

## Overview

Let us imagine we operate a highly popular product stand at the local farmer’s market, offering a variety of products that customers love.
However, managing inventory, sales, loyalty programs, and customer interactions has become a major challenge.
To streamline operations and eliminate paper-based processes, we seek an application to simplify these tasks.

## Core Use Case

- Customers select products
- Products are weighed and priced
- Customers make payments and receive the receipts and change
- The same customers may return for additional purchases

## Current Challenges

- Managing high customer traffic and product browsing
- Inefficient inventory tracking relying on paper records
- Applying variable discounts to total order sales
- Pricing products based on weight
- Implementing daily discounts on specific products
- Managing rewards for customers with frequent visits

## What We're Looking For

Design a data model and API for the order creation and sending paycheck to client.
The technology stack should include Node.js and Prisma preferred for the database.

## Possible Scenarios

- Customer management
- Employee tracking
- Product inventory management
- Inventory tracking
- Variable pricing based on weight
- Daily discounts on specific products
- Loyalty program management
- Customer, inventory, and sales reporting
- Digital receipts
- Returns processing
