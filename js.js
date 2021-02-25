let express = require("express")
let app = express()
let http = require("http")
let MongoClient = require("mongodb").MongoClient
let bodyParser = require('body-parser')
app.set("view engine", "ejs");
let mongoClient = new MongoClient('mongodb+srv://user1:user@example.7j3yd.mongodb.net/admin?retryWrites=true&w=majority',  {useNewUrlParser: true, useUnifiedTopology: true})

let mongo = require('./mongo')
let connectToMongoDb = async () => {
	await mongo().then(MongoClient => {
		try{
			console.log('Connected to mongoDB!')
		} finally{
			console.log("ok")
		}
	})
}
connectToMongoDb()

let PORT = process.env.PORT || 80

let server = http.createServer(app).listen(PORT)

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('scripts'))
app.use(express.static('imgs'))
app.use(express.static('styles'))

class User {
	constructor(login, about, subs, subscribes, notes, keys){
		this.login = login;
		this.about = about;
		this.subs = subs;
		this.subscribes = subscribes;
		this.notes = notes;
		this.keys = keys;
	}
}

class Room{
	constructor(id, messages){
		this.id = id;
		this.messages = [messages]
	}
}
class Message{
	constructor(name, text){
		this.login = name;
		this.text = text
	}
}
class Key{
	constructor(login, key){
		this.login = login;
		this.key = key;
	}
}
app.get("/", function(req, res){
	res.sendFile(__dirname + '/index.html')
})

app.get("/register", function(req, res){
	res.sendFile(__dirname + '/register.html')
})

app.post('/signup', urlencodedParser, function(req, res){
	let login = req.body.name
	let pass = req.body.password
	console.log(login + ' ' + pass)
	mongoClient.connect(function(err, client){
	    if(err){
		    console.log(err)
	    }
	    client.db("Blog").collection('users').find().toArray(function(err, result){
	    	if(err){
	    		console.log(err)
	    	}
	    	console.log(result)
	    	if(result.length == 0){
	    		res.render('index.ejs', {
	    			text: 'Такого аккаунта не существует.'
	    		})
	    	}
	    	else{
	    	    let x = 0
	    	    let y = 0
	    	    for(i=0;i<result.length;i++){
	    	    	if(result[i].login === login && result[i].password === pass){
	    	    		res.render('main.ejs', {
						login: login,
						notes: JSON.stringify(result[i].notes),
						subs: JSON.stringify(result[i].subs),
						subscribes: JSON.stringify(result[i].subscribes),
						about: result[i].about,
						keys: JSON.stringify(result[i].keys)
					})
	    	    		x = 1
	    	    		console.log(result[i])
	    	    	}
	    	    	else if(result[i].login === login && result[i].password != pass){
	    	    		res.render('index.ejs', {
	    		 	    text: 'Неверный пароль.'
	    		        })
	    		        x = 1
	    	    	}
	    	    }
	    	    if(x == 0){
	    	    	res.render('index.ejs', {
	    			text: 'Такого аккаунта не существует.'
	    		})
	    	    }
	    	}    
	    })
    })
})

app.post('/reg', urlencodedParser, function(req, res){
	let login = req.body.name
	let pass1 = req.body.password1
	let pass2 = req.body.password2
	console.log(login + " " + pass1 + ' ' + pass2 + ' регистрация')

	if(pass1 != pass2){
		res.render('register.ejs', {
			text: "Вы ввели разные пароли!"
		})
	}
	else if(pass1 === '' || login === '' || pass2 == ''){
		res.render('register.ejs', {
			text: 'Заполните все поля!'
		})
	}
	else{
		mongoClient.connect(function(err, client){
			if(err){
				console.log(err)
			}
			client.db('Blog').collection('users').find().toArray(function(err, data){
				if(err){
					console.log(err)
				}
				console.log(data)
				let x = 0
				for(i=0;i<data.length;i++){
					if(data[i].login === login){
						x = 1
						res.render('register.ejs', {
							text: 'Такой логин уже существует.'
						})
					}
				}
				if(x === 0){
					client.db("Blog").collection('users').insertOne({login: login, password: pass1, notes: [], subs: [], about: 'Описание', subscribes: [], keys: []}, function(err, data){
						if(err){
							console.log(err)
						}
						console.log(data)
					})
					res.render('main.ejs', {
						login: login,
						notes: "[]",
						subs: '[]', 
						subscribes: '[]',
						about: "Описание",
						keys: '[]'
					})
				}
			})
		})
	}
})

app.get("/getMe", function(req, res){
	let login = decodeURIComponent(req.headers['login'])
	console.log(login)

	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
		client.db("Blog").collection("users").find({login: login}).toArray(function(err, doc){
			console.log('this user is: ' + doc)
			res.send(JSON.stringify(doc))
		})
	})
})

app.get("/createNote", function(req, res){
	let notes = JSON.parse(decodeURIComponent(req.headers['notes']))
	let login = decodeURIComponent(req.headers['login'])
	res.send('got')

	console.log(notes)

	mongoClient.connect(function(err, client){
		if(err){
			console.log(err)
		}

		client.db("Blog").collection('users').updateOne(
		{login: login},
		{ $set: {notes: notes}},
		function(err, result){
			if(err){
				console.log(err)
			}
			console.log('ok')
			console.log(notes)
		}
		)
	})
})

app.post("/changeUser", function(req, res){
	let login = decodeURIComponent(req.headers['login'])
	let newLogin = decodeURIComponent(req.headers['login2'])
	let about = decodeURIComponent(req.headers['about'])
	console.log('All: ' + login + ' ' + newLogin + ' ' + about)
	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
		let x = 0

		client.db("Blog").collection("users").find().toArray(function(err, result){
			for(i=0;i<result.length;i++){
				if(result[i].login === newLogin){
					x = +x + +1 
				}
			}
			if(x === 1 || x === 0){
				res.send('ok')

				client.db("Blog").collection('users').findOneAndUpdate(
				{login: login},
				{ $set: {login: newLogin, about: about}},
				function(err, result){
					if(err){console.log('1111111: ' + err)}
						console.log(result)
				}
			    )
			}
			else{
				res.send('thereIsNameLikeThis')
			}
		})
	})
})

app.get("/getAllUsers", function(req, res){
	mongoClient.connect(function(err, client){
		client.db("Blog").collection("users").find().toArray(function(err, doc){
			if(err){console.log(err)}
			let arr = []
		    for(i=0;i<doc.length;i++){
		    	arr.push({
		    		login: doc[i].login,
		    		about: doc[i].about,
		    		subs: doc[i].subs.length,
		    		notes: doc[i].notes.length
		    	})
		    }
			res.send(JSON.stringify(arr))
		})
	})
})

app.get('/getDataAboutOtherUser', function(req, res){
	let login = decodeURIComponent(req.headers['login'])
	let user;
	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
		client.db("Blog").collection("users").findOne({login: login}, function(err, doc){
			if(err){console.log(err)}
			console.log(doc)
		    user = new User(doc.login, doc.about, doc.subs, doc.subscribes, doc.notes)
		    console.log(user)
		    res.send(JSON.stringify(user))
		})		
	})
})

app.post('/subscribe', function(req, res){
	let myLogin = decodeURIComponent(req.headers['mylogin'])
	let login = decodeURIComponent(req.headers['login'])
	console.log('logins =====' + myLogin + ' ' + login)
	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
			let subscribes = [];
		client.db("Blog").collection("users").findOne({login: myLogin}, function(err, doc){
			if(err){console.log(err)}
				console.log('User ====' + doc)
			subscribes = doc.subscribes
			subscribes.push({
				login: login
			})
			console.log('subscribes======s' +  JSON.stringify(subscribes))
			    client.db("Blog").collection("users").findOneAndUpdate(
			{login: myLogin},
			{ $set: {subscribes: subscribes}},
			function(err, result){
				if(err){console.log(err)}
					console.log(result)
			}
		)
		})

		    let subs = [];
		client.db("Blog").collection("users").findOne({login: login}, function(err, doc){
			subs = doc.subs
			subs.push({
				login: login
			})
			console.log( '111111' + JSON.stringify(doc))
			console.log( '2222222' + JSON.stringify(subs))
			    client.db("Blog").collection("users").findOneAndUpdate(
			{login: login},
			{ $set: {subs: subs}},
			function(err, result){
				if(err){console.log(err)}
				console.log('result99999999999999999999' + JSON.stringify(result))
			}
		)
		})
		res.send()
	})
})

app.post('/unsubscribe', function(req, res){
	let myLogin = decodeURIComponent(req.headers['mylogin'])
	let login = decodeURIComponent(req.headers['login'])
	console.log('logins это' + myLogin + ' ' + login)
	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
		client.db("Blog").collection("users").findOne({login: myLogin}, function(err, doc){
			if(err){console.log(err)}
				let subscribes = doc.subscribes
			    for(i=0;i<subscribes.length;i++){
			    	if(subscribes[i].login === login){
			    		subscribes.splice(i, 1)
			    	}
			    }
			    console.log("было" + JSON.stringify(subscribes))
			    client.db("Blog").collection("users").findOneAndUpdate(
			    	{login: myLogin},
			    	{ $set: {subscribes: subscribes}},
			    	function(err, doc){
			    		if(err){console.log(err)}
			    		console.log("стало" + JSON.stringify(doc))
			    	}
			    	)
		})
	    client.db("Blog").collection("users").findOne({login: login}, function(err, doc){
			if(err){console.log(err)}
				let subs = doc.subs
			    for(i=0;i<subs.length;i++){
			    	if(subs[i].login === login){
			    		subs.splice(i, 1)
			    	}
			    }
			    console.log("было" + JSON.stringify(subs))
			    client.db("Blog").collection("users").findOneAndUpdate(
			    	{login: login},
			    	{ $set: {subs: subs}},
			    	function(err, doc){
			    		if(err){console.log(err)}
			    		console.log("стало" + JSON.stringify(doc))
			    	}
			    	)
		})
		res.send('ok')
	})
})

app.get("/getNotesOfSubscribes", function(req, res){
	let subs = JSON.parse(decodeURIComponent(req.headers['subscribes']))
	class Note{
		constructor(login, note){
			this.login = login;
			this.note = note;
		}
	}
	let notes = []
	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
		client.db('Blog').collection("users").find().toArray(function(err, doc){
			if(err){console.log(err)}
			doc.forEach(function(elem){
				subs.forEach(function(user){
					if(user.login === elem.login){
						notes.push({
							login: elem.login,
							notes: elem.notes
						})
						console.log()
					}
				})
			})
		    res.send(JSON.stringify(notes))
		})
	})
})

app.get("/getAllSubInfo", function(req, res){
	let subs = JSON.parse(decodeURIComponent(req.headers['subs']))
	console.log(subs)
	mongoClient.connect(function(err, client){
		let subsInfo = []
		if(err){console.log(err)}
		client.db("Blog").collection("users").find().toArray(function(err, doc){
			if(err){console.log(err)}
				console.log(doc)
			doc.forEach(function(elem){
				subs.forEach(function(user){
					if(elem.login === user.login){
						subsInfo.push({
							login: elem.login,
							subs: elem.subs.length,
							notes: elem.notes.length
						})

					}
				})
			})
			console.log(subsInfo)
			res.send(JSON.stringify(subsInfo))
		})
	})
})

const WebSocket = require('ws');
let wss = new WebSocket.Server({server})

wss.on('connection', function(ws){
	ws.on('message', function(message){
		let obj = JSON.parse(message)

		mongoClient.connect(function(err, client){
			client.db("Blog").collection("rooms").find().toArray(function(err, doc){

				let a = 0

				doc.forEach(function(elem){
					if(elem.id === obj.id || elem.id === obj.id2){

						let messages = elem.messages
						let id = elem.id
						a = 1

						messages.push(new Message(obj.fromUser, obj.text))

						client.db("Blog").collection("rooms").updateOne(
							{id: elem.id},
							{$set: {messages: messages}},
							function(err){
								if(err){console.lof(err)}
							}

							)
					}
				})
				if(a === 0){

					client.db("Blog").collection("rooms").insertOne({id: obj.id,
						messages: obj.messages
					}, function(err){
						if(err){console.log(err)}
					})

					client.db("Blog").collection("users").find().toArray(function(err, doc){
						doc.forEach(function(elem){
							if(elem.login == obj.fromUser){
								let keys = elem.keys

								keys.push(obj.key)
								client.db("Blog").collection("users").updateOne(
									{login: obj.fromUser},
									{ $set: {keys: keys}},
									function(err){
										if(err){console.log(err)}
									}
								)
							}
							else if(elem.login == obj.toUser){
								let keys = elem.keys

								keys.push(new Key(obj.fromUser, obj.id))
								client.db("Blog").collection("users").updateOne(
									{login: obj.toUser},
									{ $set: {keys: keys}},
									function(err){
										if(err){console.log(err)}
									}
								)
							}
						})
					})
				}
			})
		})
		wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    })
})

app.get("/getRooms", function(req, res){
	let login = req.headers['login']
	mongoClient.connect(function(err, client){
		if(err){console.log(err)}
		client.db("Blog").collection("rooms").find().toArray(function(err, doc){
			if(err){console.log(err)}
			console.log(doc)
		res.send(JSON.stringify(doc))
		})
	})
})

app.get("/getRoom", (req, res) => {
	let id = req.headers['idd']
	mongoClient.connect((err, client) => {
		if(err){console.log(err)}
		client.db("Blog").collection("rooms").findOne({id: id}, function(err, doc){
			if(err){console.log(err)}
			res.send(JSON.stringify(doc))
		console.log(doc)
		})
	})
})