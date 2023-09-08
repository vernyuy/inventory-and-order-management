{
    "Comment": "Order api step function",
    "StartAt": "Place order",
    "States": {
        "Place order":{
            "Comment": " Place an order on cart Items",
            "Type": "Pass",
            "Next": "OrderItemAvailable"
        },
        "OrderItemAvailable":{
            "Comment": "Verifies if the requested Items are available",
            "Type": "Choice",
            "Choices": [
                {
                    "Variable": "$.itemAvailable",
                    "BooleanEquals": true,
                    "Next": "Yes"
                },
                {
                    "Variable": "$.itemAvailable",
                    "BooleanEquals": false,
                    "Next": "No"
                }
            ],
            "Default": "Yes"
        },
        "Yes":{
            "Type": "Pass",
            "Next": "Payment"
        },
        "No": {
            "Type": "Fail",
            "Cause": "Requested Items are out of stock"
        },
        "Payment": {
            "Comment": "User makes payment",
            "Type": "Wait",
            "Seconds": 5,
            "Next": "Payment Success"
        },
        "Payment Success":{
            "Comment": "Verifies if uer successfull made the payment",
            "Type": "Choice",
            "Choices": [
                {
                    "Variable": "$.paymentIsSuccess",
                    "BooleanEquals": true,
                    "Next": "Success"
                },
                {
                    "Variable": "$.paymentIsSuccess",
                    "BooleanEquals": false,
                    "Next": "Payment failed"
                }
            ],
            "Default": "Success"
        },
        "Success": {
            "Type": "Parallel",
            "Next": "Ordered",
            "Branches": [
                {
                    "StartAt": "send email",
                    "States": {
                        "send email":{
                            "Type": "Pass",
                            "End": true
                        }
                    }
                },
                {
                    "StartAt": "Delivery",
                    "States": {
                        "Delivery":{
                            "Type": "Wait",
                            "Seconds": 20,
                            "End": true
                        }
                    }
                }
            ]
        },
        "Payment failed":{
            "Type": "Fail",
            "Cause": "Payment failed"
        },
        "Ordered":{
            "Type": "Pass",
            "End": true
        }
        
    }
}