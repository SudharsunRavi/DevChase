const razorpayInstance = require('../RazorpayConfig')
const paymentModel = require('../models/payment.model')
const PaymentModel = require('../models/payment.model')
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
const userModel = require('../models/user.model')

const createOrder= async (req, res) => {
    try {
        const {username, email} = req.user

        const result = await razorpayInstance.orders.create({
            amount: "100", //1.00
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                username: username,
                emailId: email,
            },   
        })

        //console.log(result)
        
        const payment = new PaymentModel({
            userId: req.user._id,
            orderId: result.id,
            amount: result.amount,
            currency: result.currency,
            receipt: result.receipt,
            notes: result.notes,
            status: 'created'
        })

        const saved=await payment.save()
        res.status(200).json({...saved._doc})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}

const verifyPayment = async (req, res) => {
    try {
        // const webhookSignature = req.headers['x-razorpay-signature']
        const webhookSignature=req.get('x-razorpay-signature')
        const webhook=validateWebhookSignature(JSON.stringify(req.body), webhookSignature, "susansecret")

        if(!webhook) return res.status(400).json({message: "Webhook signature verification failed"});

        const paymentDetails = req.body.payload.payment.entity
        const checkPayment = await paymentModel.findOne({orderId: paymentDetails.order_id})
        if(!checkPayment) return res.status(400).json({message: "Payment not found"});
        checkPayment.status = paymentDetails.status;
        await checkPayment.save();

        const updateUser=await userModel.findOne(checkPayment.userId)
        updateUser.premium="true";
        await updateUser.save();


        return res.status(200).json({message: "Webhook signature verified"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})   
    }
}

module.exports = {createOrder, verifyPayment}