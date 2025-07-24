# Address API Spec

## Create Address

ENDPOINT : POST /api/contact/:idContact/addresses

Request Header :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan Apa",
  "city": "kota apa",
  "province": "provinsi apa",
  "country": "Negara apa",
  "postal_code": "76114"
}
```

Response Body (success) :

```json
{
  "data": {
    "id" : 1,
    "street": "Jalan Apa",
    "city": "kota apa",
    "province": "provinsi apa",
    "country": "Negara apa",
    "postal_code": "76114"
  }
}
```

Response Body (Failed) :
```json
{
    "errors" : "must filled, not blank,...."
}
```

## Get Address

ENDPOINT : GET /api/contact/:idContact/addresses/:idAddress

Request Header :

- Authorization : token

Response Body (success) :

```json
{
  "data": {
    "id" : 1,
    "street": "Jalan Apa",
    "city": "kota apa",
    "provience": "provinsi apa",
    "country": "Negara apa",
    "postal_code": "76114"
  }
}
```

Response Body (Failed) :
```json
{
    "errors" : "must filled, not blank,...."
}
```

## Update Address

ENDPOINT : PUT /api/contact/:idContact/addresses/:idAddress

Request Header :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan Apa",
  "city": "kota apa",
  "provience": "provinsi apa",
  "country": "Negara apa",
  "postal_code": "76114"
}
```

Response Body (success) :

```json
{
  "data": {
    "id" : 1,
    "street": "Jalan Apa",
    "city": "kota apa",
    "provience": "provinsi apa",
    "country": "Negara apa",
    "postal_code": "76114"
  }
}
```

Response Body (Failed) :
```json
{
    "errors" : "must filled, not blank,...."
}
```

## Remove Address

ENDPOINT : DELETE /api/contact/:idContact/addresses/:idAddress

Request Header :

- Authorization : token

Response Body (success) :

```json
{
  "data": "OK"
}
```

Response Body (Failed) :
```json
{
    "errors" : "Contact Not Found"
}
```

## List Address


ENDPOINT : GET /api/contact/:idContact/addresses

Request Header :

- Authorization : token

Response Body (success) :

```json
{
  "data": [
    {
    "id" : 1,
    "street": "Jalan Apa",
    "city": "kota apa",
    "provience": "provinsi apa",
    "country": "Negara apa",
    "postal_code": "76114"
  },
  {
    "id" : 2,
    "street": "Jalan Apa",
    "city": "kota apa",
    "provience": "provinsi apa",
    "country": "Negara apa",
    "postal_code": "76114"
  }
  ]
}
```

Response Body (Failed) :
```json
{
    "errors" : "CONTACT IS NOT FOUND"
}
```