//Firebase connection
const firebaseConfig = {
  apiKey: "AIzaSyC-pq5AD30JW5UKGVT-z3zTwHGMf-eRRVk",
  authDomain: "slovickaapp.firebaseapp.com",
  databaseURL: "https://slovickaapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slovickaapp",
  storageBucket: "slovickaapp.appspot.com",
  messagingSenderId: "266980177563",
  appId: "1:266980177563:web:37ecded428ab450df2383e",
  measurementId: "G-FPSZ1X5SME"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

const db = firestore.collection("groups");

let submitButton = document.getElementById("submit");

//Event Listener for Submit Button
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  let groupName = document.getElementById("groupname").value;
  let groupCode = FirebaseClass.prototype.GenereteGroupShareCode();
  //let groupCode = "A1B2C3";
  let firstLang = document.getElementById("firstlang").value;
  let secondLang = document.getElementById("secondlang").value;
  let translates = document.getElementById("translates").value;
  

  //Save Data To Firebase
  if(groupName.length > 0) {
    if(firstLang != secondLang){
      if(translates.length >= 5){
        var checkerr = true;
        while(checkerr){
          checkerr = false;
          await firestore
            .collection("groups")
            .get()
            .then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                const gc = doc.data().GroupCode;
                if (groupCode === gc) {
                  console.log("Skupina již existuje!");
                  checkerr = true;
                }
              });
              
              if(checkerr){
                console.log("Generuji nový kód!");
                groupCode = FirebaseClass.prototype.GenereteGroupShareCode();
                console.log(groupCode);
              }
              else {
                console.log("Vše v pořádku!");
              }
            })
        }

        db.doc(groupCode)
        .set({
          AppName: "Slovicka_WEB",
          AppVersion: "0.8",
          GroupCode: groupCode,
          GroupName: groupName,
          FirstLang: firstLang,
          SecondLang: secondLang,
          Translates: translates,
        })
        .then(() => { })
        .catch((error) => {
          console.log(error);
        });

        //Vytvoření QR kódu
        var container = document.querySelector(".container");
        var qr_string = "Slovicka_WEB; AppVersion: 0.7; GroupCode: " + groupCode + "; GroupName: " + groupName + ";";
        //var qr_result = strEncodeUTF16(qr_string);
        var qr_result = Base64.encode(qr_string);
        console.log(qr_string); console.log(qr_result);
        var qrImg = document.querySelector(".qr-image");

        qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=" + qr_result;
        document.getElementById("lb_code").innerHTML = groupCode;
  
        alert("Skupina byla úspěšně vytvořena a vložena!");
  
        function clearForm() {
          document.getElementById("clearFrom").reset();
        }
        clearForm() 
      }
      else {
        alert("Musíte vložit alespoň 1 překlad!");
      }
    }
    else {
      alert("Musíte vybrat 2 různé jazyky překladu!");
    }
  }
  else {
    alert("Zadejte název skupiny!");
  } 
});

var Base64 = {

  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }
      return output;
  },

  // public method for decoding
  decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }
      }

      output = Base64._utf8_decode(output);

      return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }
      }
      return string;
  }
}


//Generating unique Group code
"use strict";
var FirebaseClass = /** @class */ (function () {
    function FirebaseClass() {
    }
    FirebaseClass.prototype.GenereteGroupShareCode = function () {
        var groupCode = "";
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < 6; i++) {
            var type = Math.floor(Math.random() * 2);
            if (type == 0) {
                groupCode += Math.floor(Math.random() * 9);;
            }
            else {
                var i0 = alphabet.length;
                groupCode += alphabet[Math.floor(Math.random() * 25)];
            }
        }
        return groupCode;
    };
    return FirebaseClass;
}());
