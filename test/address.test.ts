import { AddressTest, ContactTest, UserTest } from "./test-util";
import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { add } from "winston";

describe("POST /api/contacts/:idContact/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("CREATE ADDRESS", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).post(`/api/contacts/${contact.id}/addresses`).set("Authorization", "testing").send({
      street: "Jalan Siaga",
      city: "Balikpapan",
      province: "Kalimantan Timur",
      country: "Indonesia",
      postal_code: "76114",
    });
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("Jalan Siaga");
    expect(response.body.data.city).toBe("Balikpapan");
    expect(response.body.data.province).toBe("Kalimantan Timur");
    expect(response.body.data.country).toBe("Indonesia");
    expect(response.body.data.postal_code).toBe("76114");
  });
  it("UNABLE CREATE ADDRESS", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).post(`/api/contacts/${contact.id}/addresses`).set("Authorization", "testing").send({
      street: "Jalan Siaga",
      city: "Balikpapan",
      province: "Kalimantan Timur",
      country: "",
      postal_code: "",
    });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("UNABLE CREATE ADDRESS IF CONTACT NOT FOUND", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("Authorization", "testing")
      .send({
        street: "Jalan Siaga",
        city: "Balikpapan",
        province: "Kalimantan Timur",
        country: "Indonesia",
        postal_code: "76114",
      });
    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:idContact/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it(" SUCCESS GET ADDRESS", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web).get(`/api/contacts/${contact.id}/addresses/${address.id}`).set("Authorization", "testing");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe(address.street);
    expect(response.body.data.city).toBe(address.city);
    expect(response.body.data.province).toBe(address.province);
    expect(response.body.data.country).toBe(address.country);
    expect(response.body.data.postal_code).toBe(address.postal_code);
  });
  it(" FAILED GET ADDRESS IF ADDRESS NOT FOUND", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("Authorization", "testing");

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
  it(" FAILED GET ADDRESS IF CONTACT NOT FOUND", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set("Authorization", "testing");

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:idContact/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("ABLE TO UPDATE ADDRESS", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("Authorization", "testing")
            .send({
                    street: "Jalan Update",
                    city: "Kota Update",
                    province: "Provinsi Update",
                    country: "Negara Update",
                    postal_code: "76999",
            });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("Jalan Update");
    expect(response.body.data.city).toBe("Kota Update");
    expect(response.body.data.province).toBe("Provinsi Update");
    expect(response.body.data.country).toBe("Negara Update");
    expect(response.body.data.postal_code).toBe("76999");
  });
  it("UNABLE TO UPDATE ADDRESS IF COUNTRY & POSTALCODE IS NULL", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set("Authorization", "testing")
        .send({
            street: "Jalan Update",
            city: "Kota Update",
            province: "Provinsi Update",
            country: "",
            postal_code: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

   it("UNABLE TO UPDATE ADDRESS IF CONTACT NOT FOUND", async () => {
     const contact = await ContactTest.get();
     const address = await AddressTest.get();
     const response = await supertest(web)
       .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
       .set("Authorization", "testing")
       .send({
         street: "Jalan Update",
         city: "Kota Update",
         province: "Provinsi Update",
         country: "Negara Update",
         postal_code: "76999",
       });

     logger.debug(response.body);
     expect(response.status).toBe(404);
     expect(response.body.errors).toBeDefined();
   });
   it("UNABLE TO UPDATE ADDRESS IF ADDRESS NOT FOUND", async () => {
     const contact = await ContactTest.get();
     const address = await AddressTest.get();
     const response = await supertest(web)
       .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
       .set("Authorization", "testing")
       .send({
         street: "Jalan Update",
         city: "Kota Update",
         province: "Provinsi Update",
         country: "Negara Update",
         postal_code: "76999",
       });

     logger.debug(response.body);
     expect(response.status).toBe(404);
     expect(response.body.errors).toBeDefined();
   });
});

describe('DELETE /api/contacts/:idContact/addresses/:addressId', () => {

    beforeEach(async () => {
      await UserTest.create();
      await ContactTest.create();
      await AddressTest.create();
    });
    afterEach(async () => {
      await AddressTest.deleteAll();
      await ContactTest.deleteAll();
      await UserTest.delete();
    });

    it('ABLE TO DELETE', async() => {
        const contact = await ContactTest.get()
        const address = await AddressTest.get()

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'testing')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK SUKSES DI DELETE");
    })

    it("UNABLE TO DELETE IF CONTACT NOT FOUND", async () => {
      const contact = await ContactTest.get();
      const address = await AddressTest.get();

      const response = await supertest(web).delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`).set("Authorization", "testing");

      logger.debug(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined()
    });

    it("UNABLE TO DELETE IF ADDRESS NOT FOUND", async () => {
      const contact = await ContactTest.get();
      const address = await AddressTest.get();

      const response = await supertest(web).delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`).set("Authorization", "testing");

      logger.debug(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined()
    });
 })

describe("GET /api/contacts/:idContact/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("ABLE TO LIST", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
        .get(`/api/contacts/${contact.id}/addresses`)
        .set("Authorization", "testing");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

});