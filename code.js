"use strict";

const agregado = document.getElementById("name");
const añadir = document.querySelector(".añadir");
const span = document.querySelector(".span2");
const span1 = document.querySelector(".span22");

IDBRequest = indexedDB.open("todoBase", 1);

IDBRequest.addEventListener("upgradeneeded", ()=>{
	const db = IDBRequest.result
	db.createObjectStore("todos", {
		keyPath: "id",
		autoIncrement: true,
	});
}); 

IDBRequest.addEventListener("success", ()=>{
	console.log("todo salió correctamente");
	leerObjetos();
	contador(span, span1);

});

IDBRequest.addEventListener("error", e => {
	console.log(e.target.error);
})

const IDBdata = (mode)=>{
	const db = IDBRequest.result;
	const IDBtransaction = db.transaction("todos", mode);
	const objectStore = IDBtransaction.objectStore("todos");
	return [IDBtransaction, objectStore]
}

const contador = (span, span1) => {
	const data = IDBdata("readonly");
	const countObjetos = data[1].count();
	countObjetos.addEventListener("success", e => {
		let count = countObjetos.result;
		span.innerHTML = count;
		span.value = count;
		span1.innerHTML = span.value;
	})
}

const addObjeto = objeto =>{
	const data = IDBdata("readwrite");
	const agregarObjeto = data[1].add(objeto);
	contador(span, span1);
};

const eliminarObjeto = key => {
	const data = IDBdata("readwrite");
	data[1].delete(key);
	contador(span, span1);
}

let keyMarcada;
const HTMLnombre = (key , name)=>{
	const container1 = document.createElement("DIV");
	const label = document.createElement("LABEL");
	const checkbox = document.createElement("INPUT");
	const eliminar = document.createElement("BUTTON");

	if(document.body.classList.contains("light")){
		container1.classList.add("tarea");
		container1.classList.add("tareaLight");
		label.classList.add("name");
		checkbox.classList.add("enmarcar");
		eliminar.classList.add("delete");
		eliminar.classList.add("deleteLight");
	}
	else{
		container1.classList.add("tarea");
		label.classList.add("name");
		checkbox.classList.add("enmarcar");
		eliminar.classList.add("delete");
	}

	container1.appendChild(checkbox);
	container1.appendChild(label);
	container1.appendChild(eliminar);
	label.textContent = name.nombre;
	eliminar.textContent = "X";
	checkbox.type= "checkbox";

	eliminar.addEventListener("click", ()=>{
		eliminarObjeto(key);
		document.querySelector(".tareasContainer").removeChild(container1);
	})

	keyMarcada = key;
	return [container1, checkbox]
}

const leerObjetos = ()=>{
	const data = IDBdata("readonly");
	const cursor = data[1].openCursor();
	const fragment = document.createDocumentFragment();
	document.querySelector(".tareasContainer").innerHTML = "";
	cursor.addEventListener("success", ()=>{
		if (cursor.result){
			let element = HTMLnombre(cursor.result.key, cursor.result.value)
			fragment.appendChild(element[0]);
			element[1].dataset.value = cursor.result.key;
			cursor.result.continue();

		}
		else document.querySelector(".tareasContainer").appendChild(fragment);
	})
}


añadir.addEventListener("click", e => {
	let valor = agregado.value;
	if(valor.length > 0){
		addObjeto({nombre: valor});
		leerObjetos();
		agregado.value = "";
	}
})

agregado.addEventListener('keypress', e => {
	let valor = agregado.value;
    if(e.charCode === 13 && valor.length > 0){
        addObjeto({nombre: valor});
		leerObjetos();
		agregado.value = "";
    }
})


// FILTERS

const filterTodo = id => {
	const allItems = document.querySelectorAll('.tarea');
	if(id === "All"){
		allItems.forEach(item =>{
        	item.classList.remove('hidden');
        })   
        return
	}
	else if (id === "Active"){
		allItems.forEach(item =>{
			if(item.querySelector("input").checked == null){
				console.log("nada!")
			}
       		else if(item.querySelector('input').checked){
            	item.classList.add('hidden')
           	}else{
            	item.classList.remove('hidden')
            }
       	})
       	return
	}
	else if(id === "Completed"){
		allItems.forEach(item =>{
        	if(item.querySelector('input').checked){
   		        item.classList.remove('hidden')
           	}else{
               	item.classList.add('hidden')
            }
        })
        return
	}
}

document.querySelectorAll(".boton").forEach(btn =>{
    btn.addEventListener('click',(e)=>{
        filterTodo(e.target.id);
    })
})

	// CLEAR

const clear = document.querySelector(".clear");

clear.addEventListener('click', () => {
	const markedCheckboxes = document.querySelectorAll('.tarea input[type="checkbox"]:checked');
  	markedCheckboxes.forEach(checkbox => {
    	const key = parseInt(checkbox.getAttribute('data-value'));
    	eliminarElemento(checkbox);
    	eliminarObjeto(key);
    });
});

const eliminarElemento = checkbox => {
	const container1 = checkbox.closest('div');
    container1.remove();
}

// Cambio de color

const theme = document.querySelector(".theme");

theme.addEventListener("click", e => {
	document.body.classList.toggle("light");
	const fondo = document.querySelector(".fondo");
	const tareas = document.querySelectorAll(".tarea");
	const botonesContainer  = document.querySelector(".botonesContainer");
	const botones = document.querySelectorAll(".boton");
	const eliminares = document.querySelectorAll(".delete");
	// RESPONSIVE
	const filters = document.querySelector(".filters");
	const displayMob = document.querySelector(".displayMob");
	const mob_clear = document.querySelector(".mob-clear");
	if(document.body.classList.contains("light")){
		fondo.classList.toggle("fondoLight", true);
		agregado.classList.toggle("nameLight", true);
		// añadir.classList.toggle("añadirLight", true);
		tareas.forEach(tarea => {
			tarea.classList.toggle("tareaLight", true);
		});
		eliminares.forEach(eliminar => {
			eliminar.classList.toggle("deleteLight", true);
		})
		botonesContainer.classList.toggle("botonesContainerLight", true);
		botones.forEach(boton => {
			boton.classList.toggle("botonLight", true);
		})
		clear.classList.toggle("clearLight", true);
		mob_clear.classList.toggle("clearLight", true);
		filters.classList.toggle("filtersLight", true);
		displayMob.classList.toggle("displayMob_light", true);
		theme.src = 'images/icon-moon.svg'
	}
	else{
		fondo.classList.remove("fondoLight");
		agregado.classList.remove("nameLight");
		// añadir.classList.remove("añadirLight");
		tareas.forEach(tarea => {
			tarea.classList.remove("tareaLight");
		});
		eliminares.forEach(eliminar => {
			eliminar.classList.remove("deleteLight");
		})
		botonesContainer.classList.remove("botonesContainerLight");
		botones.forEach(boton => {
			boton.classList.remove("botonLight");
		})
		clear.classList.remove("clearLight");
		mob_clear.classList.remove("clearLight");
		filters.classList.remove("filtersLight");
		displayMob.classList.remove("displayMob_light");
		theme.src = 'images/icon-sun.svg';
	}
})

// MOBILE

const clear_mob = document.querySelector(".mob-clear");

clear_mob.addEventListener('click', () => {
	const markedCheckboxes = document.querySelectorAll('.tarea input[type="checkbox"]:checked');
  	markedCheckboxes.forEach(checkbox => {
    	const key = parseInt(checkbox.getAttribute('data-value'));
    	eliminarElemento(checkbox);
    	eliminarObjeto(key);
    });
});

const span_mob = document.querySelector(".span22");
document.querySelector("DOMContentLoaded", e => {
	const data = IDBdata("readonly");
	const countObjetos = data[1].count();
	countObjetos.addEventListener("success", e => {
		let count = countObjetos.result;
		span_mob.innerHTML = count;
	})
}) 

