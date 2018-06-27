document.addEventListener('DOMContentLoaded', function () {

	let table = document.querySelector('#tournament-table'),
		thAll = table.querySelectorAll('thead th'),
		trAll = table.querySelectorAll('tbody tr');

	function changeToArr(nodeList) {

		let arr = [];

		for (let i = 0; i < nodeList.length; i++) {
			arr.push(nodeList[i]);
		}

		return arr;
	}

	let thArr = changeToArr(thAll),
		trArr = changeToArr(trAll),
		result = 0;

	function countPoitns() {

		for (let i = 0; i < trArr.length; i++) {

			for (let j = 3; j <= 14; j++) {
				if (trArr[i].children[j].textContent !== '') {
					result += parseInt(trArr[i].children[j].textContent);

				} else {
					result += 0;
				}
			}

			trArr[i].children[thArr.length - 1].textContent = result;
			result = 0;
		}

	}

	countPoitns();
	setPosition();

	

	function resetClassOrder(nodeList) {
		for (let i = 0; i < nodeList.length; i++) {
			nodeList[i].classList.remove('ascending', 'descending');
		}
	}

	let df = document.createDocumentFragment();
	let df2 = document.createDocumentFragment();

	function addContentToDF(indexItemDel) {

		let toDelete = typeof indexItemDel === 'number' && indexItemDel !== -1 ? true : false

		trArr.forEach(function (tr, index) {
			df.appendChild(tr);
		});

		if (toDelete) {
			df.removeChild(trArr[indexItemDel]);
			trArr.splice(indexItemDel, 1);
		}

		document.querySelector('tbody').appendChild(df);
	}

	function sortByColumn(e) {

		let index = thArr.indexOf(e.target),
			sequence = thArr[index].classList.contains('ascending') ? 'descending' : 'ascending';

		resetClassOrder(thArr);

		trArr.sort(function (a, b) {
			
			let tdOfA = a.children[index].textContent,
				tdOfB = b.children[index].textContent;

			if (Number(tdOfA) && Number(tdOfB)) {
				tdOfA = parseInt(tdOfA);
				tdOfB = parseInt(tdOfB);
			}

			if (tdOfA < tdOfB) {
				return sequence == 'ascending' ? -1 : 1;
			} else if (tdOfA > tdOfB) {
				return sequence == 'ascending' ? 1 : -1;
			} else {
				return 0;
			}
			
		});

		addContentToDF();
		
		thArr[index].classList.add(sequence);

	}

	for (let i = 0; i < thArr.length; i++) {
		thArr[i].addEventListener('click', sortByColumn);
	}

	function showFieldCreatePlayer(e) {

		e.stopPropagation();

		let field = document.querySelector('#new-player-form');

		field.classList.add('show');
		field.classList.remove('hide');

		document.body.addEventListener('click', function (e) {
			if ((e.target.id || e.target.parentNode.id) !== 'new-player-form') {
				field.classList.add('hide');
				field.classList.remove('show');
			}
		})

	}

	function createPlayer(e) {

		e.preventDefault();

		let newTr = document.createElement('tr'),
			formCreatePlayer = document.querySelector('#new-player-form'),
			valFirstName = formCreatePlayer.firstName.value,
			valLastName = formCreatePlayer.lastName.value;

		for (let i = 0; i < thArr.length; i++) {
			let newTd = document.createElement('td');
			newTr.appendChild(newTd);
		}

		newTr.children[1].textContent = valFirstName;
		newTr.children[2].textContent = valLastName;

		trArr.push(newTr);
		table.querySelector('tbody').appendChild(newTr);
	}

	function addBtnsDel() {

		trArr.forEach(function (tr, index, arr) {

			let btnDel = document.createElement('button');
			btnDel.classList.add('del', 'show');
			btnDel.innerHTML = '<i class="fas fa-times"></i>';
			tr.appendChild(btnDel);

		});

	}

	function removePlayer() {

		addBtnsDel();

		let btnsDel = table.querySelectorAll('tbody .del');

		document.body.addEventListener('click', function(e) {
			if(!e.target.parentNode.classList.contains('del') && (e.target.id || e.target.parentNode.id) != 'del-player') {
				for(let i = 0; i < btnsDel.length; i++) {
					btnsDel[i].classList.remove('show');
					btnsDel[i].classList.add('hide');
				}
			}
		});
		
		for (let i = 0; i < btnsDel.length; i++) {

			btnsDel[i].addEventListener('click', function () {
				addContentToDF(trArr.indexOf(this.parentNode));
			});
			
		}
		
	}
	
	function setPosition() {
		
		let newTrArr  = trArr.slice(0);
		
		newTrArr.sort(function(a,b) {
			let newTdOfA = a.children[thArr.length-1].textContent;
			let newTdOfB = b.children[thArr.length-1].textContent;
			
			return newTdOfA - newTdOfB;
		});
		
		newTrArr.forEach(function(tr, index, arr){
		
			if(index > 0 && index <= newTrArr.length -1 && tr.children[thArr.length-1].textContent == newTrArr[index-1].children[thArr.length-1].textContent) {
				tr.children[0].textContent = index;
			} else {
				tr.children[0].textContent = ++index;
			}
			
		});
	}

	function saveRound(e) {
		e.preventDefault();
		
		
		
		let formSaveRound = document.querySelector('#save-round-form'),
			 holesSelect = document.querySelector('#choice-hole'),
			selectedHole = holesSelect.options[holesSelect.selectedIndex].value;

		let findHoleInArr = thArr.filter(function (th, index) {
			return th.textContent == selectedHole;
		});


		let indexHole = thArr.indexOf(findHoleInArr[0]),
			inputsPoints = document.querySelectorAll('.container-player input');

		for (let i = 0; i < trArr.length; i++) {
			
			let numValInput = parseFloat(inputsPoints[i].value);

			if( inputsPoints[i].value == "") {
				continue;
			} else if (numValInput < -5) {
				trArr[i].children[indexHole].textContent = -5;
				continue;
			} else if(numValInput > 10) {
				trArr[i].children[indexHole].textContent = 10;
				continue;
		 }
			
			trArr[i].children[indexHole].textContent = inputsPoints[i].value;
		}
		
		countPoitns();
		setPosition();
		
	}

	function showManagmentRound(e) {

		let managmentRound = document.querySelector('#managment-round'),
			 formSaveRound = document.querySelector('#save-round-form'),
			 containerPlayer = formSaveRound.querySelector('.container-player');

		containerPlayer.innerHTML = '';

		for (let i = 0; i < trArr.length; i++) {

			let div = document.createElement('div');
			let span = document.createElement('span');
			let input = document.createElement('input');

			div.classList.add('person');
			span.classList.add('name-person');
			input.setAttribute('type', 'number');
			input.setAttribute('min', '-5');
			input.setAttribute('max', '10');
			
	
			span.textContent = trArr[i].children[1].textContent + " " + trArr[i].children[2].textContent;

			div.appendChild(span);
			div.appendChild(input);

			containerPlayer.appendChild(div);
		}

		managmentRound.classList.remove('hide');
		managmentRound.classList.add('show');

		document.addEventListener('click', function (e) {
			if (!e.target.closest('#managment-round') && e.target.id !== 'show-managment-round') {
				managmentRound.classList.remove('show');
				managmentRound.classList.add('hide');
			}
		})
	}


	let btnAddPlayer = document.querySelector('#add-player');
	let btnDelPlayer = document.querySelector('#del-player');
	let btnConfirmPlayer = document.querySelector('#confirm-add-player');

	let btnShowMangmentRound = document.querySelector('#show-managment-round');
	let btnSaveRound = document.querySelector('#save-round');
	let btnCloseRound = document.querySelector('#save-round-form .close');
	let btnCloseInfo = document.querySelector('#info-tournament .close');
	let btnInfoTournament = document.querySelector('#info-tournament .info');


	btnConfirmPlayer.addEventListener('click', createPlayer);
	btnDelPlayer.addEventListener('click', removePlayer);
	btnAddPlayer.addEventListener('click', showFieldCreatePlayer);

	btnShowMangmentRound.addEventListener('click', showManagmentRound);
	btnSaveRound.addEventListener('click', saveRound);
	
	
	btnCloseRound.addEventListener('click', function(e) {
		let managmentRound = document.querySelector('#managment-round');
		
		managmentRound.classList.add('hide');
		managmentRound.classList.remove('show');
		
		e.preventDefault();
		
	});
	
	
	let infoTournament = document.querySelector('#info-tournament');
	
	
	btnInfoTournament.addEventListener('click', function() {
		infoTournament.style.left = '0';
		this.classList.add('hide');
	});
	
	btnCloseInfo.addEventListener('click', function(e) { 
		infoTournament.style.left = '-100vw';
		btnInfoTournament.classList.remove('hide');
	}) 

});
