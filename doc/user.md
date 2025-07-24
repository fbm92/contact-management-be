## User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "aulian",
    "password" : "rahasia",
    "name" : "aulian danishwarman"
}
```

Response Body ( Success )

```json
    {
        "data": {
            "username": "aulian",
            "name" : "aulian danishwarman"
        }
    }
```

Response Body ( Failed )

```json
    {
        "errors": "tidak boleh kosong, ...."
    }
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "aulian",
    "password" : "rahasia"
    
}
```

Response Body ( Success )

```json
    {
        "data": {
            "username": "aulian",
            "name" : "aulian danishwarman",
            "token" : "uuid"
        }
    }
```

Response Body ( Failed )

```json
    {
        "errors": "username or password wrong, ...."
    }
```

## Get User

Endpoint : GET /api/users/current

Request Header :
-   Authorization : token


Response Body ( Success )

```json
    {
        "data": {
            "username": "aulian",
            "name" : "aulian danishwarman"
        }
    }
```

Response Body ( Failed )

```json
    {
        "errors": " UNAUTHORIZED, ...."
    }
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
-   Authorization : token

Request Body :

```json
{
    
    "password" : "updaterahasia",
    "name" : "danishwarman aulian"
}
```

Response Body ( Success )

```json
    {
        "data": {
            "username": "aulian",
            "name" : "aulian danishwarman"
        }
    }
```

Response Body ( Failed )

```json
    {
        "errors": "UNAUTHORIZED, tidak boleh kosong, ...."
    }
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
-   Authorization : token

Response Body ( Success )

```json
    {
        "data": "ok"
    }
```

Response Body ( Failed )

```json
    {
        "errors": "UNAUTHORIZED, ...."
    }
```

