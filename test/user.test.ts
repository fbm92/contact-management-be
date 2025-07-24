import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";
import bcrypt from "bcrypt"

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("INVALID REGISTER NEW USER", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("VALID REGISTER NEW USER", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "testing",
      password: "testing",
      name: "testing",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("testing");
    expect(response.body.data.name).toBe("testing");
  });
});

describe("LOGIN", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it ('INVALID LOGIN USER IF USERNAME WRONG' , async () => {
    const response = await supertest(web).post("/api/users/login").send({
        username : "salah",
        password : "testing"
    })

    logger.debug(response.body)
    expect(response.status).toBe(401)
    expect(response.body.errors).toBeDefined()
  })
  it ('INVALID LOGIN USER IF PASSWORD WRONG', async () => {
    const response = await supertest(web).post("/api/users/login").send({
        username : "testing",
        password : "testing123"
    })

    logger.debug(response.body)
    expect(response.status).toBe(401)
    expect(response.body.errors).toBeDefined()
  })
  it ('VALID LOGIN USER' , async () => {
    const response = await supertest(web).post("/api/users/login").send({
        username : "testing",
        password : "testing"
    })

    logger.debug(response.body)
    expect(response.status).toBe(200)
    expect(response.body.data.username).toBe("testing")
    expect(response.body.data.name).toBe("testing")
    expect(response.body.data.token).toBeDefined()
  })


});


describe('GET /api/users/current', () => { 

    beforeEach(async () => {
      await UserTest.create();
    });
    afterEach(async () => {
      await UserTest.delete();
    });

    it('GET USER', async ()=> {
        const response = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'testing')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe('testing')
        expect(response.body.data.name).toBe('testing')
    })
    it('INVALID GET USER WHEN TOKEN WRONG', async ()=> {
        const response = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'testingGG')

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    })
 })

 describe('PATCH /api/users/current', () => { 

      beforeEach(async () => {
        await UserTest.create();
      });
      afterEach(async () => {
        await UserTest.delete();
      });
    it ('UPDATE USER IF NAME A& PASSWORD IS EMPTY', async () => {
        const response = await supertest(web)
        .patch("/api/users/current")
        .set("Authorization", "testing")
        .send({
            name: "",
            password : ""
        })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
    it ('UPDATE USER IF INVALID TOKEN', async () => {
        const response = await supertest(web)
        .patch("/api/users/current")
        .set("Authorization", "testingGG")
        .send({
            name: "asdasdasd",
            password : "asdasdasd"
        })

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    })

    it(" ABLE TO UPDATE USER NAME", async () => {
      const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "testing")
      .send({
        name: "aulian",
      });

      logger.debug(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("aulian");
    });


    it(" ABLE TO UPDATE USER PASSWORD", async () => {
      const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "testing")
      .send({
        // password: await bcrypt.hash('aulian' , 10)
        password : "gantipass"
      });

      const user = await UserTest.get()

      logger.debug(response.body);
      expect(response.status).toBe(200);
      expect( await bcrypt.compare("gantipass", user.password)).toBe(true)


    });

  })

  describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
      await UserTest.create();
    });
    afterEach(async () => {
      await UserTest.delete();
    });
    it("LOGOUT", async () => {
        const response = await supertest(web)
        .delete('/api/users/current')
        .set('Authorization', 'testing')
        

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")

        const user = await UserTest.get()
        expect(user.token).toBeNull()

    })
    it("LOGOUT FAILED WHEN TOKEN IS WRONG", async () => {
        const response = await supertest(web)
        .delete('/api/users/current')
        .set('Authorization', 'testingGG')
        

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()


    })
   })
