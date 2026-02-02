---
name: shopify
description: |
  Shopify GraphQL API integration with managed OAuth. Manage products, orders, customers, and inventory. Use this skill when users want to interact with Shopify stores.
compatibility: Requires network access and valid Maton API key
metadata:
  author: maton
  version: "1.0"
---

# Shopify

Access the Shopify GraphQL Admin API with managed OAuth authentication. Manage products, orders, customers, collections, and inventory.

## Quick Start

```bash
# Get shop info
curl -X POST 'https://gateway.maton.ai/shopify/admin/api/2026-01/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"query":"{ shop { name email } }"}'
```

## Base URL

```
https://gateway.maton.ai/shopify/admin/api/{version}/graphql.json
```

The gateway proxies requests to your Shopify store and automatically injects your access token.

## Important: GraphQL API

Shopify uses GraphQL. All requests are POST with a JSON body containing the `query` field.

## API Versioning

Use the latest stable version: `2026-01`

Fallback versions if needed: `2025-10`, `2025-07`, `2025-04`

## Authentication

All requests require the Maton API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

**Environment Variable:** Set your API key as `MATON_API_KEY`:

```bash
export MATON_API_KEY="YOUR_API_KEY"
```

### Getting Your API Key

1. Sign in at [maton.ai](https://maton.ai)
2. Go to [maton.ai/settings](https://maton.ai/settings)
3. Copy your API key

## Connection Management

Manage your Shopify OAuth connections at `https://ctrl.maton.ai`.

### List Connections

```bash
curl -s -X GET 'https://ctrl.maton.ai/connections?app=shopify&status=ACTIVE' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

### Create Connection

```bash
curl -s -X POST 'https://ctrl.maton.ai/connections' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"app": "shopify"}'
```

### Get Connection

```bash
curl -s -X GET 'https://ctrl.maton.ai/connections/{connection_id}' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

**Response:**
```json
{
  "connection": {
    "connection_id": "21fd90f9-5935-43cd-b6c8-bde9d915ca80",
    "status": "ACTIVE",
    "url": "https://connect.maton.ai/?session_token=...",
    "app": "shopify"
  }
}
```

Open the returned `url` in a browser to complete OAuth authorization.

### Delete Connection

```bash
curl -s -X DELETE 'https://ctrl.maton.ai/connections/{connection_id}' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

## API Reference

### Shop Info

```graphql
{
  shop {
    name
    email
    myshopifyDomain
    currencyCode
  }
}
```

### List Products

```graphql
{
  products(first: 10) {
    edges {
      node {
        id
        title
        handle
        status
        vendor
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Get Product

```graphql
{
  product(id: "gid://shopify/Product/123456") {
    id
    title
    handle
    status
    descriptionHtml
    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
}
```

### Create Product

```graphql
mutation {
  productCreate(input: {
    title: "New Product"
    vendor: "My Store"
    productType: "Clothing"
  }) {
    product {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
```

### Update Product

```graphql
mutation {
  productUpdate(input: {
    id: "gid://shopify/Product/123456"
    title: "Updated Title"
  }) {
    product {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
```

### Delete Product

```graphql
mutation {
  productDelete(input: {
    id: "gid://shopify/Product/123456"
  }) {
    deletedProductId
    userErrors {
      field
      message
    }
  }
}
```

### List Orders

```graphql
{
  orders(first: 10) {
    edges {
      node {
        id
        name
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

### List Customers

```graphql
{
  customers(first: 10) {
    edges {
      node {
        id
        createdAt
        numberOfOrders
        state
      }
    }
  }
}
```

### List Collections

```graphql
{
  collections(first: 10) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}
```

## Code Examples

### JavaScript

```javascript
const response = await fetch(
  'https://gateway.maton.ai/shopify/admin/api/2026-01/graphql.json',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MATON_API_KEY}`
    },
    body: JSON.stringify({
      query: `{ shop { name email } }`
    })
  }
);
```

### Python

```python
import os
import requests

response = requests.post(
    'https://gateway.maton.ai/shopify/admin/api/2026-01/graphql.json',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ["MATON_API_KEY"]}'
    },
    json={'query': '{ shop { name email } }'}
)
```

## Global IDs

Shopify uses Global IDs (GIDs):
- Products: `gid://shopify/Product/123456`
- Orders: `gid://shopify/Order/123456`
- Customers: `gid://shopify/Customer/123456`
- Collections: `gid://shopify/Collection/123456`

## Pagination

Use cursor-based pagination:

```graphql
{
  products(first: 10, after: "cursor_from_previous_page") {
    edges {
      node { id title }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Notes

- All requests use POST method with GraphQL query
- Check `userErrors` array in mutation responses
- Some customer fields require protected customer data approval
- Store subdomain is automatically determined from your connection

## Error Handling

| Status | Meaning |
|--------|---------|
| 400 | Missing Shopify connection |
| 401 | Invalid or missing Maton API key |
| 429 | Rate limited (10 req/sec per account) |
| 4xx/5xx | Passthrough error from Shopify API |

## Resources

- [GraphQL API Overview](https://shopify.dev/docs/api/admin-graphql/latest)
- [Products](https://shopify.dev/docs/api/admin-graphql/latest/queries/products.md)
- [Orders](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders.md)
- [Customers](https://shopify.dev/docs/api/admin-graphql/latest/queries/customers.md)
- [Collections](https://shopify.dev/docs/api/admin-graphql/latest/queries/collections.md)
- [API Versioning](https://shopify.dev/docs/api/usage/versioning.md)
- [Rate Limits](https://shopify.dev/docs/api/usage/limits.md)
