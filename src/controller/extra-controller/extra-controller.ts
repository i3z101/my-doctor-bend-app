import Expo from "expo-server-sdk";
import { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import HelperClass from "../../helper/helper-class";
import Appointment from "../../model/appointments";
import Bill from "../../model/bills";

export const paymentPageController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {amount, doctorFullName, date, time} = req.query;
    
    return res.render('payment/index', {
        amount,
        doctorFullName: doctorFullName?.toString().replace(/-/g, " "),
        date: date?.toString().replace(/-/g, " "),
        time: time?.toString().replace(/-/g, " "),
        callbackUrl: `https://${req.hostname}`
    });
}

export const paymentStatusController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {status, date, time, appointmentAmount} = req.query;
    try {
        if(status == "paid") {
            await new Bill({
                date,
                time,
                amount: appointmentAmount
            }).save()
        }
        //In front end we send a request every 1 second to check the status of payment in order to close the payment page automatically in the fornt end
        const bill = await Bill.findOne({status: "paid", date: date?.toString().replace(/-/g, " "), time: time?.toString().replace(/-/g, " ")});
        if(bill) {
            HelperClass.responseHandler(res, "Succeed", 200, {billId: bill._id});
        }else {
            HelperClass.errorHandler("Failed", 500);
        }
        
    }catch(err: any) {
        return next(err);
    }
}

export const appointmentsPageController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {receiver, pushToken} = req.query;
    const {roomId} = req.params;
    
    if(receiver) {
        return res.render('socket/appointments/receiver', {
            roomId
        })
    }
    return res.render('socket/appointments/caller', {
        pushToken,
        roomId
    });
}

export const appointmentsIo = (client: Socket) => {

    // let connectedPeers = new Map()
    
    client.join(client.handshake.query.roomId as any)

        client.on('patient-join', (args)=> {
            
            client.broadcast.to(client.handshake.query.roomId as any).emit('patient-join', args.payload)
        })

        client.on('doctor-join', (args)=> {
            
            client.broadcast.to(client.handshake.query.roomId as any).emit('doctor-join', args.payload)
        })

        client.on('pushToken', data => {
            client.broadcast.to(client.handshake.query.roomId as any).emit('pushToken', data.payload)
        })

        // connectedPeers.set(client.id, client)

        
        client.on('offer', async (data) => {
            
            //To send call notification only one time to avoid repeating sending.....
            
            if(data.payload.onlyOne) {
                const expo = new Expo();
                
                await expo.sendPushNotificationsAsync([{
                    to: data.payload.pushToken,
                    title: 'A new call',
                    body: "You have a call",
                    sound: 'default',
                    subtitle: 'Respond'
                }])
            }
            
            client.broadcast.to(client.handshake.query.roomId as any).emit('call-user', data.payload)

            // for (const [clientID, client] of connectedPeers.entries()) {
            //     // send to the other peer(s) if any
            //     if (clientID !== data.clientID) {
            //     }
            // }
        })

        client.on('answer', (data) => {
            
            client.broadcast.to(client.handshake.query.roomId as any).emit('answer-made', data.payload)
            // for (const [clientID, client] of connectedPeers.entries()) {
            //     // send to the other peer(s) if any
            //     if (clientID !== data.clientID) {
            //     }
            // }
        })
        
        client.on('candidate', (data) => {

            client.broadcast.to(client.handshake.query.roomId as any).emit('candidate', data.payload)
            
            // for (const [clientID, client] of connectedPeers.entries()) {
            //     // send to the other peer(s) if any
            //     if (clientID !== data.clientID) {
            //     }
            // }
        })

}

export const emergencyPageController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {receiver, pushToken} = req.query;
    const {roomId} = req.params;
    
    if(receiver) {
        return res.render('socket/emergency/receiver', {
            roomId
        })
    }
    return res.render('socket/emergency/caller', {
        pushToken,
        roomId
    });
}

export const emergencyIo = (client: Socket) => {
    client.on('doctor-join', args => {
        client.broadcast.emit('doctor-join', {
            
            ...args,
            doctorSocketId: client.id
        });
    })

    client.on('patient-join', () => {
        client.broadcast.emit('patient-join');
    })

    client.on('disconnect', () => {
        client.broadcast.emit('doctor-left', client.id);
    })

    client.on('call-doctor', roomId => {
        client.broadcast.emit('patient-calling', roomId )
    })

    client.on('offer', async (data) => {

        if(data.payload.onlyOne) {
            const expo = new Expo();
            
            await expo.sendPushNotificationsAsync([{
                to: data.payload.pushToken,
                title: 'A new call',
                body: "You have a call",
                sound: 'default',
                subtitle: 'Respond'
            }])
        }
        
        
        client.broadcast.emit('call-user', data.payload)
    })

    client.on('answer', (data) => {
            
        client.broadcast.emit('answer-made', data.payload)
        
    })
    
    client.on('candidate', (data) => {

        client.broadcast.emit('candidate', data.payload)

    })
}