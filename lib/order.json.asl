{
    "Comment": "Order api step function",
    "StartAt": "Place order",
    "States": {
        "Place order":{
            "Comment": " Place an order on cart Items",
            
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "OutputPath": "$.Payload",
            "Parameters": {
              "Payload.$": "$"
            },
            "Retry": [
              {
                "ErrorEquals": [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                  "Lambda.TooManyRequestsException"
                ],
                "IntervalSeconds": 2,
                "MaxAttempts": 6,
                "BackoffRate": 2
              }
            ],
            "Next": "OrderItemAvailable"
        },
        "OrderItemAvailable":{
            "Comment": "Verifies if the requested Items are available",
            "Type": "Choice",
            "Choices": [
                {
                    "Variable": "$.itemAvailable",
                    "BooleanEquals": true,
                    "Next": "Payment"
                },
                {
                    "Variable": "$.itemAvailable",
                    "BooleanEquals": false,
                    "Next": "No"
                }
            ],
            "Default": "Payment"
        },
        "No": {
            "Type": "Fail",
            "Cause": "Requested Items are out of stock"
        },
        "Payment": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "OutputPath": "$.Payload",
            "Parameters": {
              "Payload.$": "$"
            },
            "Retry": [
              {
                "ErrorEquals": [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                  "Lambda.TooManyRequestsException"
                ],
                "IntervalSeconds": 2,
                "MaxAttempts": 6,
                "BackoffRate": 2
              }
            ],
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
            "Next": "Delivery",
            "Branches": [
                {
                    "StartAt": "send email",
                    "States": {
                        "send email":{
                            "Type": "Task",
                            "Resource": "arn:aws:states:::lambda:invoke",
                            "OutputPath": "$.Payload",
                            "Parameters": {
                              "Payload.$": "$"
                            },
                            "Retry": [
                              {
                                "ErrorEquals": [
                                  "Lambda.ServiceException",
                                  "Lambda.AWSLambdaException",
                                  "Lambda.SdkClientException",
                                  "Lambda.TooManyRequestsException"
                                ],
                                "IntervalSeconds": 2,
                                "MaxAttempts": 6,
                                "BackoffRate": 2
                              }
                            ],
                            "End": true
                        }
                    }
                },
                {
                    "StartAt": "Process Order",
                    "States": {
                        "Process Order":{
                            "Type": "Task",
                            "Resource": "arn:aws:states:::lambda:invoke",
                            "OutputPath": "$.Payload",
                            "Parameters": {
                              "Payload.$": "$"
                            },
                            "Retry": [
                              {
                                "ErrorEquals": [
                                  "Lambda.ServiceException",
                                  "Lambda.AWSLambdaException",
                                  "Lambda.SdkClientException",
                                  "Lambda.TooManyRequestsException"
                                ],
                                "IntervalSeconds": 2,
                                "MaxAttempts": 6,
                                "BackoffRate": 2
                              }
                            ],
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
        "Delivery":{
            "Type": "Wait",
            "Seconds": 20,
            "End": true
        }
        
    }
}