/*
    Author: Timothy Hong, Antonio Irizarry
    Class: CS 340
    Date: 04/26/21
    Title: Crabshack
    Description: Crabshack homepage JS
*/

function openNav() {
  document.getElementById("sidenav-menu").style.width = "250px";
  document.getElementById("main-body").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("sidenav-menu").style.width = "0";
  document.getElementById("main-body").style.marginLeft= "0";
}

function openSubMenu(id) {
	// close existing open submenus
	let submenus = document.getElementsByClassName("submenu");
	Array.prototype.forEach.call(submenus, element => element.style.display = "none");
	// display current submenu
	document.getElementById(id).style.display = "block";
}