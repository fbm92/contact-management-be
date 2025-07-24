
import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import { Address, Contact, User } from "@prisma/client";
export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "testing",
      },
    });
  }
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "testing",
        name: "testing",
        password: await bcrypt.hash("testing", 10),
        token: "testing",
      },
    });
  }


  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        username: "testing",
      },
    });

    if (!user) {
      throw new Error("User Not Fond");
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "testing",
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: "aulian",
        last_name: "danishwarman",
        email: "aulian@gmail.com",
        phone: "082108210821",
        username: "testing",
      },
    });
  }

  static async get(): Promise<Contact> {
    const result = await prismaClient.contact.findFirst({
      where: {
        username: "testing",
      },
    });

    if (!result) {
      throw new Error("Contact Not Fond");
    }

    return result;
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "testing",
        },
      },
    });
  }

  static async create() {
    const contact = await ContactTest.get()
    await prismaClient.address.create({
      data: {
        contact_id : contact.id,
        street : "Jalan Test",
        city : "Kota Test",
        province : "Provinsi Test",
        country : "Negara Test",
        postal_code : "76114"
      }
    });
  }

  static async get() : Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where : {
        contact : {
          username : "testing"
        }
      }
    })

    if(!address) {
      throw new Error("Address Not Found");
    }

    return address

  }
}
