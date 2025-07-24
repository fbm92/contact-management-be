# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Headers :
-   Authorization : token

Request Body : 

```json
    {
        "first_name" : "Aulian",
        "last_name" : "Danishwarman",
        "email" : "aulian@gmail.com",
        "phone" : "081212341234"
    }
```

Response Body ( success ) : 
```json
{
    "data" : {
        "id" : 1,
        "first_name" : "Aulian",
        "last_name" : "Danishwarman",
        "email" : "aulian@gmail.com",
        "phone" : "081212341234"
    }
}
```

Response Body ( failed ) :
```json
{
    "errors" : " not blank, ..."
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request Headers :
-   Authorization : token


Response Body ( success ) : 
```json
{
    "data" : {
        "id" : 1,
        "first_name" : "Aulian",
        "last_name" : "Danishwarman",
        "email" : "aulian@gmail.com",
        "phone" : "081212341234"
    }
}
```

Response Body ( failed ) :
```json
{
    "errors" : " not found, ..."
}
```

## Update Contact

Endpoint : PUT /api/contacts/:id

Request Headers :
-   Authorization : token

Request Body : 

```json
    {
        "first_name" : "Aulian",
        "last_name" : "Danishwarman",
        "email" : "aulian@gmail.com",
        "phone" : "081212341234"
    }
```

Response Body ( success ) : 
```json
{
    "data" : {
        "id" : 1,
        "first_name" : "Aulian",
        "last_name" : "Danishwarman",
        "email" : "aulian@gmail.com",
        "phone" : "081212341234"
    }
}
```

Response Body ( failed ) :
```json
{
    "errors" : " not blank, ..."
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:id

Request Headers :
-   Authorization : token

Response Body ( success ) : 
```json
{
    "data" : "success"
}
```

Response Body ( failed ) :
```json
{
    "errors" : "NOT FOUND, ..."
}
```

## Search Contact

Endpoint : GET /api/contacts

Querry Param :

-   name : string , contact firstname or contact lastname (optional)
-   phone : string , contact phone  (optional)
-   email : string  , contact email
-   page : number , default 1
-   size : number, default 10



Request Headers :
-   Authorization : token

Response Body ( success ) : 
```json
{
    "data" : [
        {
        "id" : 1,
        "first_name" : "Aulian",
        "last_name" : "Danishwarman",
        "email" : "aulian@gmail.com",
        "phone" : "081212341234"
    },
    {
        "id" : 2,
        "first_name" : "Cinthya",
        "last_name" : "Limaran",
        "email" : "cinthya@gmail.com",
        "phone" : "085208520852"
    }
    ],

    "page" : {
        "current_page" : 1 ,
        "total_page" : 10,
        "size" : 10

    }
}
```

Response Body ( failed ) :
```json
{
    "errors" : " UNAUTHORIZED, ..."
}
```