import { Contact, User } from "@prisma/client";
import { ContactResponse, CreateContactRequest, UpdateContactRequest, toContactResponse, SearchContactRequest } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";




export class ContactService  {
    
    static async create(user : User , request : CreateContactRequest) : Promise <ContactResponse> {
        const createRequest = Validation.validate(ContactValidation.CREATE, request)
        
        
        const record = {
            ...createRequest,
            ...{username: user.username}
        }

        const result : Contact = await prismaClient.contact.create({
            data : record as Contact
        })

        return toContactResponse(result)
    }

    static async checkContactExist (username : string, contactId : number ) : Promise <Contact> {
        const contact = await prismaClient.contact.findUnique({
            where : {
                id : contactId,
                username : username
            }
        })

        if(!contact) {
            throw new ResponseError(404,"CONTACT NOT FOUND");
        }

        return contact
    }
    
    static async get(user : User, id : number) : Promise <ContactResponse> {
        const result = await this.checkContactExist(user.username, id)
        return toContactResponse(result)
    }
    
    static async update(user : User, request : UpdateContactRequest) : Promise <ContactResponse> {
        const updateRequest = Validation.validate(ContactValidation.UPDATE, request)
        await this.checkContactExist(user.username, updateRequest.id)
        
        const result = await prismaClient.contact.update({
            where : {
                id : updateRequest.id,
                username : user.username
            },
            data : updateRequest
        })
        
        return toContactResponse(result)
    }

    
    static async delete (user : User, id : number) : Promise <ContactResponse> {
        await this.checkContactExist(user.username, id)
        const result = await prismaClient.contact.delete({
            where : {
                id : id,
                username : user.username
            }
        })

        return toContactResponse(result)
    }

    static async search (user : User , request : SearchContactRequest) : Promise <Pageable<ContactResponse>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request)
        const skip  = (searchRequest.page - 1) * searchRequest.size

        const filters = []
        // CHECK IF NAME EXIST
        if(searchRequest.name) {
            filters.push({
              OR: [
                {
                  first_name: {
                    contains: searchRequest.name
                  },
                },
                {
                  last_name: {
                    contains: searchRequest.name
                  },
                },
              ],
            });
        }
        // CHECK IF PHONE EXIST AND PUSH
        if (searchRequest.phone) {
            filters.push({
                phone : {
                    contains : searchRequest.phone
                }
            })
        }
        // CHECK IF EMAIL EXIST AND PUSH
        if (searchRequest.email) {
          filters.push({
            email: {
              contains: searchRequest.email,
            },
          });
        }

        const result = await prismaClient.contact.findMany ({
            where : {
                username : user.username,
                AND : filters,
            },
            take : searchRequest.size,
            skip : skip,
        })

        const total = await prismaClient.contact.count({
          where: {
            username: user.username,
            AND: filters,
          },
        });

        

        return {
            data : result.map(contact => toContactResponse(contact)),
            paging : {
                current_page : searchRequest.page,
                total_page : Math.ceil(total / searchRequest.size),
                size : searchRequest.size
            }
        }
    }

}