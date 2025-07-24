import { ResponseError } from "../error/response-error";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import bcrypt from 'bcrypt'

import {v4 as uuid} from 'uuid'
import { User } from "@prisma/client";


export class UserService {
    
    // REGISTER SERVICE
    static async register (request : CreateUserRequest): Promise<UserResponse> {
        const registerUser = Validation.validate(UserValidation.REGISTER, request)

        const totalSameUser = await prismaClient.user.count({
            where : {
                username : registerUser.username
            }
        })

        if(totalSameUser != 0) {
            throw new ResponseError(400, 'username already exist');
            
        }

        registerUser.password = await bcrypt.hash(registerUser.password, 10)

        const user = await prismaClient.user.create({
            data : registerUser
        })

        return toUserResponse(user)
    }

    // LOGIN SERVICE
    static async login (request : LoginUserRequest) : Promise <UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request)

        let user = await prismaClient.user.findUnique({
            where : {
                username : loginRequest.username
            }
        })

        if (!user) {

            throw new ResponseError(401, "Username or Password is Wrongg");
            
        }
        
        const isValidPassword = await bcrypt.compare(loginRequest.password, user.password)
        
        if(!isValidPassword) {

            throw new ResponseError(401, "Username or Password is Wrong");
            
        }

        user = await prismaClient.user.update({
            where : {
                username : loginRequest.username
            },

            data : {
                token : uuid()
            }
        })
        console.log(user);

        const response = toUserResponse(user)
        response.token = user.token!

        console.log(response);
        
        return response

    }

    static async get(user : User) : Promise <UserResponse> {
        console.log(user);
        
        return toUserResponse(user)
    }

    static async update(user : User, request : UpdateUserRequest) : Promise <UserResponse> {
        const updateUserRequest = Validation.validate(UserValidation.UPDATE , request)

        if(updateUserRequest.name) {
            user.name = updateUserRequest.name
        }

        if(updateUserRequest.password) {
            user.password = await bcrypt.hash(updateUserRequest.password, 10)
        }

        const result = await prismaClient.user.update({
            where : {
                username : user.username
            },
            data : user
        })

        return toUserResponse(result)
    }

    static async logout (user : User)  : Promise <UserResponse> {
        const result = await prismaClient.user.update({
            where : {
                username : user.username
            },
            data : {
                token : null
            }
        })

        return toUserResponse(result)
    }

}