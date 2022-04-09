import express from "express";
import { paymentPageController, paymentStatusController, appointmentsPageController, emergencyPageController } from "../../controller/extra-controller/extra-controller";
import checkAuthorizationMiddleWare from "../../middleware/checkAuthorization-middleware";

const htmlPages = express.Router();

htmlPages.get('/payment', paymentPageController);

htmlPages.get('/payment-status', paymentStatusController);

htmlPages.get('/appointments/:roomId', appointmentsPageController)

htmlPages.get('/emergency/:roomId', emergencyPageController)

export default htmlPages;