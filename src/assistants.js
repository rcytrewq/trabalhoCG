import * as THREE from "../build/three.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";





export class InfoBox2 {
  constructor() {
    this.infoBox2 = document.createElement("div");
    this.infoBox2.id = "InfoxBox2";
    this.infoBox2.style.padding = "6px 14px";
    this.infoBox2.style.position = "fixed";
    this.infoBox2.style.bottom = "0";
    this.infoBox2.style.left = "0";
    this.infoBox2.style.backgroundColor = "gray";
    this.infoBox2.style.color = "white";
    this.infoBox2.style.fontFamily = "sans-serif";
    this.infoBox2.style.userSelect = "none";
    this.infoBox2.style.textAlign = "left";
  }

  addParagraph() {
    const paragraph = document.createElement("br");
    this.infoBox2.appendChild(paragraph);
  }

  add(text) {
    var textnode = document.createTextNode(text);
    this.infoBox2.appendChild(textnode);
    this.addParagraph();
  }

  show() {
    document.body.appendChild(this.infoBox2);
  }
  
}

export class InfoBoxLoad {
  constructor() {
    this.infoBoxLoad = document.createElement("div");
    this.infoBoxLoad.id = "InfoxBoxLoad";
    this.infoBoxLoad.style.padding = "6px 14px";
    this.infoBoxLoad.style.position = "fixed";
    this.infoBoxLoad.style.bottom = "360px";
    this.infoBoxLoad.style.left = "540px";
    //this.infoBoxLoad.style.backgroundColor = "rgba(255,255,255,0.2)";
    this.infoBoxLoad.style.color = "white";
    this.infoBoxLoad.style.fontFamily = "fira-code";
    this.infoBoxLoad.style.fontSize = "25px";
    this.infoBoxLoad.style.userSelect = "none";
    this.infoBoxLoad.style.textAlign = "left";
  }

  addParagraph() {
    const paragraph = document.createElement("br");
    this.infoBoxLoad.appendChild(paragraph);
  }

  add(text) {
    var textnode = document.createTextNode(text);
    this.infoBoxLoad.appendChild(textnode);
    this.addParagraph();
  }

  show() {
    document.body.appendChild(this.infoBoxLoad);
  }

  hide() {
    document.body.delete();
  }
}

/**
 * ...
 *
 */
export class SecondaryBox {
  constructor(defaultText) {
    this.box = document.createElement("div");
    this.box.id = "box";
    this.box.style.padding = "6px 14px";
    this.box.style.bottom = "0";
    this.box.style.left = "0";
    this.box.style.position = "fixed";
    this.box.style.backgroundColor = "rgba(100,100,255,0.3)";
    this.box.style.color = "white";
    this.box.style.fontFamily = "fira-code";
    this.box.style.fontSize = "26px";

    this.textnode = document.createTextNode(defaultText);
    this.box.appendChild(this.textnode);
    document.body.appendChild(this.box);
  }
  changeMessage(newText) {
    this.textnode.nodeValue = newText;
  }
}