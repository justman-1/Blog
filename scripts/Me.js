	function makeNotes(){
		let bl = document.querySelector('.allNotes')
		if(Me.notes.length != 0){
			for(i=0;i<Me.notes.length;i++){
			 $(`<div class="note">
					<div class="noteName">${Me.login}</div>
					<div class="noteText">${Me.notes[i].text}</div>
					<img class="noteComm noteBut" src="/comments.png">
					<img class="noteLike noteBut" src="/like.svg">
					<div class="noteDate">${Me.notes[i].date}</div>
				</div>`).insertBefore($(bl.children[0]))
		    }
		}
	}
	makeNotes()
	$(".amountNotesSp").html(Me.notes.length)
	$('.subsSp').html(Me.subs.length)
	$(".subscribesSp").html(Me.subscribes.length)
	$(".changeUserName").val(Me.login)
	$(".changeUserAbout").val(Me.about)

	$(".createNoteBut").click(function(){
		$(".createParams").css({
			'top': '200px'
		})
		$(".nav").css({
		    'filter': 'brightness(0.2)'
	    })
	    $(".myProfileSect").css({
	 	    'filter': 'brightness(0.2)'
	    })
	    $(".createText").focus()

	})

	$(".createBack").click(function(){
		$(".createParams").css({
			'top': '-1000px'
		})
		$(".nav").css({
		    'filter': 'brightness(1)'
	    })
	    $(".myProfileSect").css({
		    'filter': 'brightness(1)'
	    })
	    $(".createText").blur()
	    setTimeout(function(){
	    	$(".createText").val('')
	    }, 500)
	})

	$(".createSend").click(function(){
		let bl = document.querySelector('.allNotes')
		let data = $(".createText").val()

		if($(".createText").val() != ''){
			Me.notes.push({
			    date: now,
			    text: $(".createText").val()

		    })

		let req = new XMLHttpRequest()
		req.open('GET', '/createNote')
		req.setRequestHeader('notes', encodeURIComponent(JSON.stringify(Me.notes)))
		req.setRequestHeader('login', encodeURIComponent(Me.login))
		req.setRequestHeader('Content-type', 'charset=utf-8')
		req.send()

		$(".createParams").css({
			'top': '-1000px'
		})
		$(".nav").css({
		    'filter': 'brightness(1)'
	    })
	    $(".myProfileSect").css({
		    'filter': 'brightness(1)'
	    })
	    $(".createText").blur()
	    setTimeout(function(){
	    	$(".createText").val('')
	    }, 500)

	    $(".amountNotesSp").html(Me.notes.length)

	    $($(bl.children[0])).before(`<div class="note">
					<div class="noteName">${Me.login}</div>
					<div class="noteText">${data}</div>
					<img class="noteComm noteBut" src="/comments.png">
					<img class="noteLike noteBut" src="/like.svg">
					<div class="noteDate">${now}</div>
				</div>`)	    }
	})

	    $(".changePencil").click(function(){
	    	$(".changeUser").css({
	    		'top': '150px'
	    	})
	    	$(".nav").css({
		        'filter': 'brightness(0.1)'
	        })
	        $(".myProfileSect").css({
		        'filter': 'brightness(0.1)'
	        })
	    })
	    $(".changeUserBack").click(function(){
	    	$(".changeUser").css({
	    		'top': '-1000px'
	    	})
	    	$(".nav").css({
		        'filter': 'brightness(1)'
	        })
	        $(".myProfileSect").css({
		        'filter': 'brightness(1)'
	        })
	    })
	    $(".changeUserSave").click(function(){
	    	if($(".changeUserName").val() == ''){
	    		alert("Введите название вашего профиля!")
	    	}
	    	else{
	    		let req = new XMLHttpRequest()
	    		req.open("POST", '/changeUser', false)
	    		req.setRequestHeader("login", encodeURIComponent(Me.login))
	    		req.setRequestHeader("login2", encodeURIComponent($(".changeUserName").val()))
	    		req.setRequestHeader("about", encodeURIComponent($(".changeUserAbout").val()))
	    		req.send()
	    		let res = req.responseText
	    		if(res === 'ok'){
	    			Me.login = $(".changeUserName").val()
	    			Me.about = $(".changeUserAbout").val()
	    			$(".changeUser").css({
	    		        'top': '-1000px'
	    	        })
	    	        $(".nav").css({
		                'filter': 'brightness(1)'
	                })
	                $(".myProfileSect").css({
		                'filter': 'brightness(1)'
	                })
	                $(".about").html($(".changeUserAbout").val())
	                $(".name").html($(".changeUserName").val())
	    		}
	    		else if(res === 'thereIsNameLikeThis'){
	    			alert("Такое имя занято!")
	    		}
	    	}
	    })