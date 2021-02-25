class Room{
	constructor(id, messages, login){
		this.id = id;
		this.messages = [{
			login: login,
			text: messages
		}]
	}
}
class Message{
	constructor(name, text){
		this.login = name;
		this.text = text;
	}
}
class Key{
	constructor(login, key){
		this.login = login;
		this.key = key;
	}
}
let socket = new WebSocket("wss://messanger/");
socket.onopen = function(e) {

};
socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};
socket.onmessage = function(message) {
	let mess = JSON.parse(message.data)
	let x = 0
	Me.keys.forEach(function(elem){
		if(elem.key === mess.id || elem.login === mess.toUser){
			x = 1
		}
	})
if(x === 0){

	if(mess.fromUser == Me.login){
		let y = 0
		Me.keys.forEach((elem) =>{
			if(elem.login == mess.key.login){
				y = 1
			}
		})
		if(y === 0){
			Me.keys.push(mess.key)
		}
	}

	else if(mess.toUser === Me.login){
		let y = 0
		Me.keys.forEach((elem) =>{
			if(elem.login == mess.fromUser){
				y = 1
			}
		})
		if(y === 0){
			Me.keys.push(new Key(mess.fromUser, mess.id))
		}
	}
}
	if(mess.fromUser === $(".chatName").html() && mess.toUser === Me.login || mess.fromUser === Me.login && mess.toUser === $(".chatName").html()){
		$(".chatAllMessages").append(`<div class="chatMessage">
		<div class="chatMessageName">${mess.fromUser}</div>
		<div class="chatMessageText">${mess.text}</div></div>`)
	}
}; 
let sendMess = function(message){
		if(!socket.readyState){
			setTimeout(function(){
				sendMess(message)
			}, 100)
		}
		else{
			console.log("send message")
			socket.send(message)
		}
}


$(".mess").click(() => {

	    $(".s").css({
			'background-color': 'black',
			'color': 'white'
		})
		$(".mess").css({
			'background-color': '#4CF077',
			'color': 'black'
		})
		$(".sect").css({
			'display': 'none'
		})
		$(".messSect").css({
			'display': 'block'
		})
		$("title").html("Собщения")

		$(".allMessangers").remove()
		$(".messSect").append(`<div class="allMessangers"></div>`)


		Me.keys.forEach((elem)=>{
			$(`<div class="messUser">
				<div class="messUserName">${elem.login}</div>
				<div class="messUserText">Сообщение</div>
			</div>`).appendTo(".allMessangers")
		})

		if($(".messSect").height() == 2){
		    	let bl = document.querySelector('.allMessangers')
		         $(bl).append('<div style="color: #757575; font-size: 25px; text-align: center;margin-top: 30px">Пока что у вас нет сообщений</div>')   
		}

})

$(document).click((e)=>{
	if(e.target.className === "writeBut"){
		$(".sect").css({
			'display': 'none'
		})
		$(".chatWithOther").css({
			'display': 'block'
		})
		$(".chatName").html($(e.target.parentNode.children[1]).html())
		$(".chatAllMessages").remove()
		$(".chatWithOther").append(`<div class="chatAllMessages"></div>`)

		let id = 1
		Me.keys.forEach(function(elem){
			if(elem.login === $(".chatName").html()){
				id = elem.key
			}
		})
		if(id != 1){
		    let req = new XMLHttpRequest()
		    req.open("GET", '/getRoom', false)
		    req.setRequestHeader("idd", id)
		    req.send()

		    let res = JSON.parse(req.responseText)
		    res.messages.forEach(function(elem){
		    	$(".chatAllMessages").append(`<div class="chatMessage">
		        <div class="chatMessageName">${elem.login}</div>
		        <div class="chatMessageText">${elem.text}</div></div>`)
		    })
		}
		




	}
	else if(e.target.className === "createBack createBack3"){
		if($(".users").css("background-color") === 'rgb(76, 240, 119)' || $(".main").css("background-color") === 'rgb(76, 240, 119)'){
		$(".sect").css({
		    'display': 'none'
	    })
	    $(".otherUser").css({
		    'display': 'block'
	    })
	    }
	    else if($(".mess").css("background-color") === 'rgb(76, 240, 119)'){
	    $(".sect").css({
		    'display': 'none'
	    })
	    $(".messSect").css({
		    'display': 'block'
	    })
	    }
	    else{
		$(".sect").css({
		    'display': 'none'
	    })
	    $(".mainSect").css({
		    'display': 'block'
	    })
	    $(".mainSubs").css({
		    'display': 'block'
	    })
	    }
	}
	else if(e.target.className === 'textSendBut' && $(".textInp").val().replace(/ +/g, ' ').trim() != ''){
		let id = Me.login + $(".chatName").html()
		let room = new Room(id, $(".textInp").val(), Me.login)
		room.toUser = $(".chatName").html()
		room.fromUser = Me.login
		room.text = $(".textInp").val()
		room.id2 = $(".chatName").html() + Me.login
		room.key = new Key($(".chatName").html(), id)
		console.log(room)
		let a = 0
		sendMess(JSON.stringify(room))
		window.scrollBy(10000000000000000, 10000000000000000)


		$(".textInp").val('')


	}
	else if(e.target.className === "messUserText"){
		let name = e.target.parentNode.children[0].innerHTML

		$(".sect").css({
			'display': 'none'
		})
		$(".chatWithOther").css({
			'display': 'block'
		})
		$(".chatName").html(name)
		$(".chatAllMessages").remove()
		$(".chatWithOther").append(`<div class="chatAllMessages"></div>`)

		let id = 1
		Me.keys.forEach(function(elem){
			if(elem.login === name){
				id = elem.key
			}
		})
		if(id != 1){
		    let req = new XMLHttpRequest()
		    req.open("GET", '/getRoom', false)
		    req.setRequestHeader("idd", id)
		    req.send()

		    let res = JSON.parse(req.responseText)
		    res.messages.forEach(function(elem){
		    	$(".chatAllMessages").append(`<div class="chatMessage">
		        <div class="chatMessageName">${elem.login}</div>
		        <div class="chatMessageText">${elem.text}</div></div>`)
		    })
		}
		window.scrollBy(10000000000000000, 10000000000000000)

	}
})
