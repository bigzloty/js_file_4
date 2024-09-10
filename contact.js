// Import the MongoClient class from the mongodb package
const { MongoClient } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'contact'; // Database name

// Main function to perform CRUD operations
async function main() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log("Connected to MongoDB server");

        const db = client.db(dbName);
        const contactList = db.collection('contactlist');

        // 1. Insert documents into "contactlist"
        const contacts = [
            { lastName: 'Ben', firstName: 'Moris', email: 'ben@gmail.com', age: 26 },
            { lastName: 'Kefi', firstName: 'Seif', email: 'kefi@gmail.com', age: 15 },
            { lastName: 'Emilie', firstName: 'brouge', email: 'emilie.b@gmail.com', age: 40 },
            { lastName: 'Alex', firstName: 'brown', age: 4 },
            { lastName: 'Denzel', firstName: 'Washington', age: 3 }
        ];

        await contactList.insertMany(contacts);
        console.log("Inserted documents into the contactlist");

        // 2. Display all of the contacts list
        console.log("All contacts:");
        let allContacts = await contactList.find({}).toArray();
        console.log(allContacts);

        // 3. Display all the information about only one person using their ID
        const idToFind = allContacts[0]._id; // Assuming you want to find the first contact
        console.log("Contact with ID ${idToFind}:");
        let person = await contactList.findOne({ _id: idToFind });
        console.log(person);

        // 4. Display all the contacts with an age > 18
        console.log("Contacts with age > 18:");
        let contactsOver18 = await contactList.find({ age: { $gt: 18 } }).toArray();
        console.log(contactsOver18);

        // 5. Display all the contacts with an age > 18 and name containing "ah"
        console.log('Contacts with age > 18 and name containing "ah":');
        let contactsWithAh = await contactList.find({
            age: { $gt: 18 },
            firstName: /ah/
        }).toArray();
        console.log(contactsWithAh);

        // 6. Change the contact's first name from "Kefi Seif" to "Kefi Anis"
        await contactList.updateOne(
            { lastName: 'Kefi', firstName: 'Seif' },
            { $set: { firstName: 'Anis' } }
        );
        console.log("Updated Kefi Seif to Kefi Anis");

        // 7. Delete the contacts that are aged under 5
        await contactList.deleteMany({ age: { $lt: 5 } });
        console.log("Deleted contacts aged under 5");

        // 8. Display all of the contacts list after deletion
        console.log("All contacts after deletion:");
        allContacts = await contactList.find({}).toArray();
        console.log(allContacts);

    } catch (err) {
        console.error(err);
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
}

// Call the main function
main();