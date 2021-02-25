let usersHave = 0

$(".users").click(function(){
	if($(".users").css('background-color') === 'rgb(0, 0, 0)'){
		
		$(".s").css({
			'background-color': 'black',
			'color': 'white'
		})
		$(".users").css({
			'background-color': '#4CF077',
			'color': 'black'
		})
		$(".sect").css({
			'display': 'none'
		})
		$(".usersSect").css({
			'display': 'block'
		})
		$("title").html('Пользователи')
	if(usersHave === 0){
		usersHave = 1
		let req = new XMLHttpRequest()
		req.open("GET", '/getAllUsers', false)
		req.send()
		let res = JSON.parse(req.responseText)
		

		for(i=0;i<res.length;i++){
			let m = '...'
			if(res[i].about.length < 40){m = ''}
			$(`<div class="userFrom">
			<div class="userFromName">${res[i].login}</div>
			<div class="userFromAbout">${res[i].about.substr(0, 40)}${m}</div>
			<div class="userFromSubs">${res[i].subs} подписчиков</div>
			<div class="userFromNotes">${res[i].notes} записей</div>
		</div>`).appendTo('.allUsers')
		}
	}
	else{
		$(".allUsers").remove()
		$("<div class='allUsers'></div>").appendTo('.usersSect')
		let req = new XMLHttpRequest()
		req.open("GET", '/getAllUsers', false)
		req.send()
		let res = JSON.parse(req.responseText)
		

		for(i=0;i<res.length;i++){
			$(`<div class="userFrom">
			<div class="userFromName">${res[i].login}</div>
			<div class="userFromAbout">${res[i].about}</div>
			<div class="userFromSubs">${res[i].subs} подписчиков</div>
			<div class="userFromNotes">${res[i].notes} записей</div>
		</div>`).appendTo('.allUsers')
		}
	}
	}

	

})

$(".myProfile").click(function(){
	if($(".myProfile").css('background-color') === 'rgb(0, 0, 0)'){
		$(".sect").css({
			'display': 'none'
		})
		$(".s").css({
			'background-color': 'black',
			'color': 'white'
		})
		$(".myProfile").css({
			'background-color': '#4CF077',
			'color': 'black'
		})
		$(".myProfileSect").css({
			'display': 'block'
		})
		$("title").html('Мой профиль')
		$(".subscribesSp").html(Me.subscribes.length)

	}
})



$(".usersSect").click(function(e){
	if(e.target.className === 'userFromName'){
		let name = $(e.target).html()

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
			$(".writeBut").css({
				'display': 'none'
			})
		}
		else{
			$(".subscribeBut").css({
				'display': 'block'
			})
			$(".writeBut").css({
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
})

$(".createBack2").click(function(){
	if($(".users").css("background-color") === 'rgb(76, 240, 119)'){
		$(".sect").css({
		    'display': 'none'
	    })
	    $(".usersSect").css({
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
})

document.querySelector(".searchText").addEventListener('input', function(){
	let all = document.querySelectorAll(".userFromName")
	let text = $(".searchText").val()
	if(text != ''){
		all.forEach(function(elem){
		    if(elem.innerText.search(text) != -1){
			    $(elem.parentNode).css({
			    	'display': 'block'
			    })
		    }
		    else{
		    	 $(elem.parentNode).css({
			    	'display': 'none'
			    })
		    }
	    })
	}
	else{
		all.forEach(function(elem){
		 $(elem.parentNode).css({
		 	'display': 'block'
		 })
	    })
	}
})


$(".subscribeBut").click(function(){
	if($(".subscribeBut").html() === 'Подписаться'){
	    let login = $(".name2").html()
	    let req = new XMLHttpRequest()
	    req.open("POST", '/subscribe', false)
	    req.setRequestHeader("mylogin", encodeURIComponent(Me.login))
	    req.setRequestHeader("login", encodeURIComponent(login))
	    req.send()
	    Me.subscribes.push({
	    	login: login
	    })

	    $(".subscribeBut").css({
	    	'background-color': '#4F4F4F',
	    	'color:': '#4CF077'
	    }).html('Вы подписаны')
	    $(".subsSp2").html(+$(".subsSp2").html() + +1)
    }
    else{
    	let login = $(".name2").html()
	    let req = new XMLHttpRequest()
	    req.open("POST", '/unsubscribe', false)
	    req.setRequestHeader("mylogin", encodeURIComponent(Me.login))
	    req.setRequestHeader("login", encodeURIComponent(login))
	    req.send()
	    for(i=0;i<Me.subscribes.length;i++){
			if(Me.subscribes[i].login === login){
			    Me.subscribes.splice(i, 1)
			}
		}

	   $(".subscribeBut").css({
	        'background-color': ' #4CF077',
	        'color:': 'black'
	    }).html('Подписаться')
	    $(".subsSp2").html(+$(".subsSp2").html() - +1)
    }
})

