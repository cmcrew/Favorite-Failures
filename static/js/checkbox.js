See the code below:

//**************************************************
// Copyright 2005 - Andrew Burns
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.
//**************************************************
//**************************************************
// CheckBox Control
// ---------------
// By Andrew Burns, June 2005
// Modified Bruce Sandeman, June 2005
//
// Javascript file for creating a 'Checkbox' using images.
// Degrades softly to normal checkboxes if JavaScript is unsupported.
//**************************************************
// Function to attach an event handler function to an object
function attachCheckEvent ( oTarget, cEvType, fnHandler, bForceOneFn ){
if( bForceOneFn == null ) {
bForceOneFn = false;
}
if( bForceOneFn ) {
oTarget["on" + cEvType] = fnHandler;
} else {
if (oTarget.addEventListener) {
oTarget.addEventListener( cEvType, fnHandler, true );
} else if (oTarget.attachEvent){
oTarget.attachEvent( "on" + cEvType, fnHandler );
}
}
// Note: No assignment of form below:
// oTarget["on" + cEvType] = fnHandler;
// I don't want to overwrite any other javascript that is applied, so instead
// I'll not do anything. This way, we just fail softly...
}
// Create a closed OnClick function. This will deal with changing the image, and the hidden CheckBox field
function createCheckClickEventHandler( oImg ) {
obj = function( e ) {
if( oImg.chkBox.checked == true ) {
oImg.chkBox.checked = false;
oImg.src = oImg.offImage.src;
} else {
oImg.chkBox.checked = true;
oImg.src = oImg.onImage.src;
}
};
return obj;
}
function createKeyEventHandler( o ) {
obj = function( e ) {
var bSpaceKey = false;
if( e ) {
if( e.which == 32) {
bSpaceKey = true;
}
} else {
if( window.event.keyCode ) {
bSpaceKey = true;
}
}
if( bSpaceKey ) {
var oImg = o.oImg;
if( oImg.chkBox.checked == true ) {
oImg.chkBox.checked = false;
oImg.src = oImg.offImage.src;
} else {
oImg.chkBox.checked = true;
oImg.src = oImg.onImage.src;
}
}
};
return obj;
}
// Function to create checkboxes. Reads the the DOM attributes of text input tags.
function prepareCheck () {
// Get Input elements
var x = document.getElementsByTagName('INPUT');

// For each input element, if it is a checkbox, and has replacement images…
for (var i=0;i
if( (x[i].type == ‘checkbox’) && x[i].getAttribute(‘imgOn’) && x[i].getAttribute(‘imgOff’) ){

// Find Checkbox Location on screen. Hide the Checkbox
xpos = 0;
obj = x[i];
if (obj.offsetParent) {
while (obj.offsetParent) {
xpos += obj.offsetLeft;
obj = obj.offsetParent;
}
} else if (obj.x) {
xpos += obj.x;
}

ypos = 0;
obj = x[i];
if (obj.offsetParent) {
while (obj.offsetParent) {
ypos += obj.offsetTop;
obj = obj.offsetParent;
}
} else if (obj.y) {
ypos += obj.y;
}

x[i].style.visibility = ‘hidden’;

// Add a new image, and cache ‘checked’ and ‘unchecked’ images.
var oAnchor = document.createElement( “A” );
oAnchor.tabIndex = i+1;
oAnchor.href=”null”;
var oImg = document.createElement( “IMG” );
oImg.onImage = new Image();
oImg.onImage.src = x[i].getAttribute(‘imgOn’);
oImg.offImage = new Image();
oImg.offImage.src = x[i].getAttribute(‘imgOff’);
// Make it visibile, and absolutely positioned, so we can replace the CheckBox
oAnchor.style.visibility = ‘visible’;
oAnchor.style.position = ‘absolute’;
// Link between Hidden Checkbox and Image
oImg.chkBox = x[i];
x[i].oImg = oImg;

// Decide on the Initial image used for the image
// IE and Opera

if( document.all ) {
bOn = !( x[i].getAttribute( “CHECKED” ) == false );
} else {
bOn = ( x[i].getAttribute(“CHECKED” ) == “”);
}

if( bOn ) {
oImg.src = oImg.onImage.src;
} else {
oImg.src = oImg.offImage.src;
}
// Attach the click event hander. This should swap the image and the checkbox state
oImg.style.left = xpos + ( ( x[i].offsetWidth – oImg.width ) / 2);
oImg.style.top = ypos + ( ( x[i].offsetHeight – oImg.height ) / 2);
attachCheckEvent( oImg, ‘click’, createCheckClickEventHandler( oImg ) );
oAnchor.oImg = oImg;
attachCheckEvent( oAnchor, ‘keydown’, createKeyEventHandler( oAnchor ), true );
attachCheckEvent( oAnchor, ‘click’, function (e) { return false; }, true );
oAnchor.style.left = xpos + ( ( x[i].offsetWidth – oImg.width ) / 2);
oAnchor.style.top = ypos + ( ( x[i].offsetHeight – oImg.height ) / 2);
oAnchor.appendChild( oImg );
document.body.appendChild( oAnchor );
}
// if
}
// for
}
// Clear the elements used on page exit
function clearCheck () {
var x = document.getElementsByTagName(‘INPUT’);
for (var i=0;i
if( (x[i].type == ‘checkbox’) && x[i].oImg ){
x[i].oImg.onclick = null;
x[i].oImg.onImage = null;
x[i].oImg.offImage = null;

x[i].oImg.chkBox = null;

x[i].oImg.src = null;
x[i].oImg.parentNode.removeChild( x[i].oImg );
x[i].oImg = null;
}
}
}
// Attach Events on page load to prepare the Checkboxes.
attachCheckEvent( window, ‘load’, prepareCheck);
attachCheckEvent( window, ‘unload’, clearCheck);

