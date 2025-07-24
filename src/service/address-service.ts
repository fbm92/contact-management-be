import { User, Address } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, toAddressResponse, UpdateAddressRequest } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";




export class AddressService {
    static async create (user : User, request : CreateAddressRequest) : Promise <AddressResponse> {
        const createAddressRequest = Validation.validate(AddressValidation.CREATE, request)
        await ContactService.checkContactExist(user.username, request.contact_id)
        
        const address = await prismaClient.address.create({
            data : createAddressRequest
        })
        
        return toAddressResponse(address)
    }

    static async checkAddressExist (idContact : number , addressId : number ) : Promise <Address> {
        const address  = await prismaClient.address.findFirst({
            where : {
                id : addressId,
                contact_id : idContact
            }
        })

        if (!address) {
            throw new ResponseError(404,"NOT FOUND");
        }

        return address
    }
    
    static async get (user : User, request : GetAddressRequest) : Promise <AddressResponse> {
        const getAddressRequest = Validation.validate(AddressValidation.GET, request)
        await ContactService.checkContactExist(user.username, request.contact_id)
        const address = await this.checkAddressExist(getAddressRequest.contact_id, getAddressRequest.id)

        return toAddressResponse(address)

    }

    static async update (user : User, request : UpdateAddressRequest) : Promise <AddressResponse> {
        const updateRequest = Validation.validate(AddressValidation.UPDATE, request)
        await ContactService.checkContactExist(user.username, request.contact_id)
        await this.checkAddressExist(updateRequest.contact_id, updateRequest.id)

        const address = await prismaClient.address.update({
            where : {
                id : updateRequest.id,
                contact_id : updateRequest.contact_id
            },
            data : updateRequest
        })

        return toAddressResponse(address)
    }

    static async remove (user : User, request : RemoveAddressRequest) : Promise <AddressResponse> {
        const removeRequest = Validation.validate(AddressValidation.REMOVE, request)
        await ContactService.checkContactExist(user.username, request.contact_id)
        await this.checkAddressExist(removeRequest.contact_id, removeRequest.id)

        const address = await prismaClient.address.delete({
            where : {
                id : removeRequest.id
            }
        })

        return toAddressResponse(address)
    }

    static async list (user: User, idContact : number) : Promise <Array<AddressResponse>> {
        await ContactService.checkContactExist(user.username, idContact)

        const result = await prismaClient.address.findMany({
            where : {
                contact_id : idContact
            }
        })

        return result.map(address => toAddressResponse(address))
    }


}