# Ways of Data lose in Serverless 

### 1. Duplicate and Unordered events
**Duplication**:Make your system *Idempotent*. When multiple events are triggered for the same data, it can lead to duplicate data being stored. This can happen if the events are not properly deduplicated, or if there is a race condition between the events.

**Unordered events**: When events are not processed in the order in which they were received, it can lead to data being processed out of order. This can be a problem if the data is dependent on being processed in a specific order. Old records shouldn't be over written by new records.

To prevent data loss due to duplication and unordered events, it is important to take steps to deduplicate events and to process them in the order in which they were received.

<!-- Here are some specific things you can do to prevent data loss in serverless by duplication and unordered events: -->

- Use a deduplication service to eliminate duplicate events.

- Use a message queue to ensure that events are processed in the order in which they were received (FIFO).

- Implement event retry logic to ensure that events are processed even if they are lost or delayed.


### 2. Bulk Operation
#### 2.1 Bulk insert

SDK does not return throw an error when an item fails to insert but rather returns a list of failed records and you will have to check that list to know which record failed to insert.

#### 2.2 Bulk get

With bulk get, you might eventually think that the records that have been retrieved are the only records that exist in dynamodb. This is not true because the SDK returns the records it manage to get and also the record that it failed to process in `field: UnprocessedKey`.

SDK for EventBridge does not even have a non-bulk operation. So even if you put one record in, you still use a bulk approach and may lose the data if you do not check the result (FailedEntryCount field).

Lost of data by during bulk operations happen more frequently than regular expressions because sending a lot of data could overload the system which could fail on one or more records.


To avoid this, customize with the service how the SDK communicates with services and how the retry and backoff mechanism should work.

### 3. Eventually Consistent.

Then lost of data is common in this case more when using [Single Table design](sdjlkfsjdfslkdfj). 

Check single table design practices [here]().

























By taking these steps, you can help to ensure that your data is safe and secure in a serverless environment.



The specific steps you need to take to prevent data loss will depend on your specific application and use case.
It is important to test your application to make sure that it is resistant to data loss.
You should also monitor your application for any signs of data loss.
