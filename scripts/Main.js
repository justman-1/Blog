let allMainNotesHave = 0

$(".main").click(function(){
		$(".sect").css({
			'display': 'none'
		})
		$(".s").css({
			'background-color': 'black',
			'color': 'white'
		})
		$(".main").css({
			'background-color': '#4CF077',
			'color': 'black'
		})
		$("title").html('Главная')
		$(".mainSect").css({
			'display': 'block'
		})
		$(".mainSubs").css({
			'display': 'block'
		})

		let req = new XMLHttpRequest()
		req.open("GET", '/getNotesOfSubscribes', false)
		req.setRequestHeader("subscribes", encodeURIComponent(JSON.stringify(Me.subscribes)))
		req.send()

		let notes = JSON.parse(req.responseText)
		

		let req2 = new XMLHttpRequest()
		req2.open("GET", '/getAllSubInfo', false)
		req2.setRequestHeader("subs", encodeURIComponent(JSON.stringify(Me.subscribes)))
		req2.send()

		let res2 = JSON.parse(req2.responseText)
		

		if(allMainNotesHave != 0){
			$(".allMainNotes").remove()
			$('<div class="allMainNotes"><div></div></div>').appendTo('.mainSect')
			$(".mainSubsAll").remove()
			$('<div class="mainSubsAll"></div>').appendTo('.mainSubs')
		}
		allMainNotesHave = 1
			notes.forEach(function(elem){
			let login = elem.login
			let notes = elem.notes
			let bl = document.querySelector('.allMainNotes')
			notes.forEach(function(note){
				$($(bl.children[0])).before(`<div class="note">
					<div class="noteName">${login}</div>
					<div class="noteText">${note.text}</div>
					<img class="noteComm noteBut" src="/comments.png">
					<img class="noteLike noteBut" src="/like.svg">
					<div class="noteDate">${note.date}</div>
				</div>`)
			})
		    })
		    if($(".mainSect").height() == 2){
		    	let bl = document.querySelector('.allMainNotes')
		         $(bl).append('<div style="color: #757575; font-size: 25px; text-align: center;margin-top: 30px">Пока что тут нет записей</div>')   
		    }

		    res2.forEach(function(elem){
		  	$(".mainSubsAll").append(`<div class="mainSub"><div class="mainSubName">${elem.login}</div>
		    		<br><span class="mainSubSubs">${elem.subs}</span> подписчиков<span class="mainSubNotes">${elem.notes}</span> записей</div>`)
		    })
})

$(document).click(function(event){
	if(event.target.className === 'noteName' || event.target.className === 'mainSubName' ){
		let name = $(event.target).html()

		let req = new XMLHttpRequest()
		req.open("GET", '/getDataAboutOtherUser', false)
		req.setRequestHeader('login', encodeURIComponent(name))
		req.send()
		let user = JSON.parse(req.responseText)
		$('.sect').css({
			'display': 'none'
		})
		$('.otherUser').css({
			'display': 'block'
		})

		$(".name2").html(user.login)
		$(".amountNotesSp2").html(user.notes.length)
		$(".subsSp2").html(user.subs.length)
		$(".subscribesSp2").html(user.subscribes.length)
		$(".about2").html(user.about)
		$(".allNotes2").remove()
		$(".notes2").append(`<div class="allNotes allNotes2">
				<div></div>
			</div>`)
		if($(".name2").html() === Me.login){
			$(".subscribeBut").css({
				'display': 'none'
			})
		}
		else{
			$(".subscribeBut").css({
				'display': 'block'
			})
		}
		let bl = document.querySelector('.allNotes2')
		for(i=0;i<user.notes.length;i++){
			$($(bl.children[0])).before(`<div class="note">
					<div class="noteName">${user.login}</div>
					<div class="noteText">${user.notes[i].text}</div>
					<img class="noteComm noteBut" src="/comments.png">
					<img class="noteLike noteBut" src="/like.svg">
					<div class="noteDate">${user.notes[i].date}</div>
				</div>`)
		}
		let x = 0
		Me.subscribes.forEach(function(elem){
			if(elem.login === user.login){
				 x = 1
			}
		})
		if(x == 1){
				 $(".subscribeBut").css({
	    	        'background-color': '#4F4F4F',
	    	         'color:': '#4CF077'
	             }).html('Вы подписаны')
			}
			else{
				$(".subscribeBut").css({
	    	        'background-color': ' #4CF077',
	    	         'color:': 'black'
	             }).html('Подписаться')
			}
	    }
	//else if(event.target.className == 'noteLike noteBut'){
	//	let login = event.target.parentNode.children[0].innerHTML
	//	let note = event.target.parentNode.children[1].innerHTML
	//	let req = new XMLHttpRequest()
	//	req.open("POST", '/sendLikeNote', false)
	//	req.setRequestHeader("login", encodeURIComponent(login))
	//	req.setRequestHeader("note", encodeURIComponent(note))
	//	req.send()
	//}
})