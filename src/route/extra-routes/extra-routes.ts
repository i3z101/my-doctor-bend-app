import express from "express";
import { paymentPageController, paymentStatusController, socketPageController } from "../../controller/extra-controller/payment-controller";
import checkAuthorizationMiddleWare from "../../middleware/checkAuthorization-middleware";

const htmlPages = express.Router();

htmlPages.get('/payment', paymentPageController);

htmlPages.get('/payment-status', paymentStatusController);

htmlPages.get('/test-socket', socketPageController)

export default htmlPages;