import supertest from "supertest"
import { ContactTest, UserTest } from "./test-util"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { log } from "winston"
import { response } from "express"


describe('POST /api/contacts', () => { 

    beforeEach ( async () => {
        await UserTest.create()
    })

    afterEach ( async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('CREATE CONTACT' ,  async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'testing')
            .send({
                first_name: "aulian",
                last_name: "danishwarman",
                email: "aulian@gmail.com",
                phone :"082151640100"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.first_name).toBe('aulian')
        expect(response.body.data.last_name).toBe('danishwarman');
        expect(response.body.data.email).toBe('aulian@gmail.com');
        expect(response.body.data.phone).toBe('082151640100');
    })
    it('CREATE CONTACT IF INVALID DATA' ,  async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "testing")
            .send({
                first_name: "",
                last_name: "",
                email: "aulian",
                phone: "082151640100082151640100082151640100"
            });

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
 })

describe('GET /api/contacts', () => {
     beforeEach(async () => {
       await UserTest.create();
       await ContactTest.create()
     });

     afterEach(async () => {
       await ContactTest.deleteAll();
       await UserTest.delete();
     });
    it('VALID GET' , async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}`)
            .set("Authorization", "testing")

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.first_name).toBe(contact.first_name)
        expect(response.body.data.last_name).toBe(contact.last_name)
        expect(response.body.data.email).toBe(contact.email)
        expect(response.body.data.phone).toBe(contact.phone)
    })
    it('INVALID GET' , async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}`)
            .set("Authorization", "testing")

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
        
    })
  })

describe('PUT /api/contacts/:id', () => { 
    
    beforeEach(async () => {
      await UserTest.create();
      await ContactTest.create();
    });

    afterEach(async () => {
      await ContactTest.deleteAll();
      await UserTest.delete();
    });
    it('VALID UPDATE' , async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set("Authorization", "testing")
            .send({
                first_name: "cinthya",
                last_name: "wahyuning",
                email: "cwl@gmail.com",
                phone: "085708570857",
        });
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe("cinthya");
        expect(response.body.data.last_name).toBe("wahyuning");
        expect(response.body.data.email).toBe("cwl@gmail.com");
        expect(response.body.data.phone).toBe("085708570857");

    })
    it('FAILED UPDATE CONTACT' , async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set("Authorization", "testing")
            .send({
                first_name: "",
                last_name: "",
                email: "cwl@gmail",
                phone: "08570850857",
        });
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()

    })
})

describe('DELETE /api/contacts/:idContact', () => { 

    beforeEach(async () => {
      await UserTest.create();
      await ContactTest.create();
    });

    afterEach(async () => {
      await ContactTest.deleteAll();
      await UserTest.delete();
    });

    it("VALID DELETE", async () => {
      const contact = await ContactTest.get();
      const response = await supertest(web)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", "testing");

      logger.debug(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe("OK");
     
    });
    it("FAILED DELETE CONTACTS", async () => {
      const contact = await ContactTest.get();
      const response = await supertest(web)
        .delete(`/api/contacts/${contact.id + 1}`)
        .set("Authorization", "testing");

      logger.debug(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined()
     
    });
 })

describe('GET SEARCH /api/contacts', () => { 

    beforeEach(async () => {
      await UserTest.create();
      await ContactTest.create();
    });

    afterEach(async () => {
      await ContactTest.deleteAll();
      await UserTest.delete();
    });

    it('SUCCESS SEARCH CONTACT', async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set('Authorization', 'testing')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(1)
        expect(response.body.paging.current_page).toBe(1)
        expect(response.body.paging.total_page).toBe(1)
        expect(response.body.paging.size).toBe(10)
    })
    it('SUCCESS SEARCH CONTACT USING KEYWORD NAME', async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                name: 'ian'
            })
            .set('Authorization', 'testing')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(1)
        expect(response.body.paging.current_page).toBe(1)
        expect(response.body.paging.total_page).toBe(1)
        expect(response.body.paging.size).toBe(10)
    })
    it('SUCCESS SEARCH CONTACT USING KEYWORD EMAIL', async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                email: 'gmail'
            })
            .set('Authorization', 'testing')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(1)
        expect(response.body.paging.current_page).toBe(1)
        expect(response.body.paging.total_page).toBe(1)
        expect(response.body.paging.size).toBe(10)
    })
    it('SUCCESS SEARCH CONTACT USING KEYWORD PHONE', async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                phone: '0'
            })
            .set('Authorization', 'testing')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(1)
        expect(response.body.paging.current_page).toBe(1)
        expect(response.body.paging.total_page).toBe(1)
        expect(response.body.paging.size).toBe(10)
    })
    it('SUCCESS SEARCH CONTACT USING PAGE', async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                page : 1,
                size : 1
            })
            .set('Authorization', 'testing')

    
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(1)
        expect(response.body.paging.current_page).toBe(1)
        expect(response.body.paging.total_page).toBe(1)
        expect(response.body.paging.size).toBe(1)
    })
 })