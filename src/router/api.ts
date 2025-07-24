import express from 'express'
import { authMiddleware } from '../middleware/auth-middleware'
import { UserController } from '../controller/user-controller'
import { ContactController } from '../controller/contact-controller'
import { AddressController } from '../controller/address-controller'

export const apiRouter  = express.Router()


apiRouter.use(authMiddleware)

//users api
apiRouter.get("/api/users/current", UserController.get)
apiRouter.patch("/api/users/current", UserController.update)
apiRouter.delete("/api/users/current", UserController.logout)

//contacts api
apiRouter.post('/api/contacts', ContactController.create)
apiRouter.get('/api/contacts/:idContact(\\d+)', ContactController.get)
apiRouter.put("/api/contacts/:idContact(\\d+)", ContactController.update);
apiRouter.delete("/api/contacts/:idContact(\\d+)", ContactController.delete);
apiRouter.get("/api/contacts", ContactController.search);

// ADDRESS API

apiRouter.post("/api/contacts/:idContact(\\d+)/addresses", AddressController.create);
apiRouter.get("/api/contacts/:idContact(\\d+)/addresses/:addressId(\\d+)", AddressController.get);
apiRouter.put("/api/contacts/:idContact(\\d+)/addresses/:addressId(\\d+)", AddressController.update);
apiRouter.delete("/api/contacts/:idContact(\\d+)/addresses/:addressId(\\d+)", AddressController.remove);
apiRouter.get("/api/contacts/:idContact(\\d+)/addresses", AddressController.list);