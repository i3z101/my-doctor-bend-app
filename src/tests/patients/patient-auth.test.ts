import { expect } from "chai";
import request from 'supertest';
import app, { GROUPING_PATIENTS_URL } from '../../index';

describe("TEST CASES FOR PATIENT AUTH API REGISTRATION ENDPOINTS", ()=> {
    it("TC001: It should send validation error of patient phone with code 422 and validation message length > 0 ", async ()=> {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code-registration`).send({
            patientPhone: '+966533813106',
            patientName: "Aziz"
        });
        expect(response.body.statusCode).to.equal(422);
        expect(response.body.validations).length.greaterThan(0);
    })
    it("TC002: It should send validation error of patient name with code 422 and validation message length > 0 ", async ()=> {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code`).send({
            patientPhone: '966533813106',
            patientName: "Aziz_)0"
        });
        expect(response.body.statusCode).to.equal(422)
        expect(response.body.validations).length.greaterThan(0);
    })
    it("TC003: It should send validation error of patient phone with code 422 and validation message length > 0", async ()=> {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code`).send({
            patientPhone: '966533813106',
            patientName: "Aziz", 
            patientEmail: "azxd@sd"
        });
        expect(response.body.statusCode).to.equal(422)
        expect(response.body.validations).length.greaterThan(0);
    })
    it("TC004: It should find the patient registered in the database", async ()=> {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code`).send({
            patientPhone: '966533813106',
            patientName: "Aziz",
            patientEmail: "azxd@gmail.com"
        });
        expect(response.body.statusCode).to.equal(422)
    })

    it("TC005: It should send the sms code to the registered patient", async ()=> {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code`).send({
            patientPhone: '966533813106',
            patientName: "Aziz",
            patientEmail: "azxd@gmail.com"
        });
        expect(response.body.statusCode).to.equal(200)
    })

    it("TC006: It should register patient successfully", async ()=> {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/register`).send({
            code: "572844",
            patientPhone: '966533813106',
            patientName: "Aziz",
            patientEmail: "azxd@gmail.com"
        });
        expect(response.body.statusCode).to.equal(201)
    })
})


describe("TEST CASES FOR PATIENT AUTH API LOGIN ENDPOINTS", ()=> {
    it("TC007: It should send validation error of patient phone with code 422 and validation message length > 0", async() => {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code-login`).send({
            patientPhone: "+966533813106",
            code: "0000"
        })
        expect(response.body.statusCode).to.equal(422)
        expect(response.body.validations).length.greaterThan(0);
    })
    it("TC008: It should send patient not found with status code 404", async() => {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code-login`).send({
            patientPhone: "966500877840",
            code: "0000"
        })
        expect(response.body.statusCode).to.equal(404);
    })
    it("TC009: It should send code successfully", async() => {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/send-sms-code-login`).send({
            patientPhone: "966533813106"
        })
        expect(response.body.statusCode).to.equal(200);
    })
    it("TC010: It should send code is expired message", async() => {
        const response = await request(app).post(`${GROUPING_PATIENTS_URL}/login`).send({
            patientPhone: "966500877840",
            code: "322867"
        })
        expect(response.body.statusCode).to.equal(500);
        expect(response.body.message).to.equal("Code is expired")
    })
    it("TC011: It should login patient successfully", async() => {
            const response = await request(app).post(`${GROUPING_PATIENTS_URL}/login`).send({
            patientPhone: "966533813106",
            code: "516334"
        })
        expect(response.body.statusCode).to.equal(200);
    })
})
