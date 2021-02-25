let MongoClient = require('mongodb').MongoClient
let mongoPath = 'mongodb+srv://user1:user@example.7j3yd.mongodb.net/admin?retryWrites=true&w=majority'

module.exports = async () => {
	await MongoClient.connect(mongoPath, {useNewUrlParser: true, useUnifiedTopology: true})
	return MongoClient
}