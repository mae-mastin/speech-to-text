var langs = [
  ["Afrikaans", ["af-ZA"]],
  ["Bahasa Indonesia", ["id-ID"]],
  ["Bahasa Melayu", ["ms-MY"]],
  ["Català", ["ca-ES"]],
  ["Čeština", ["cs-CZ"]],
  ["Deutsch", ["de-DE"]],
  [
    "English",
    ["en-AU", "Australia"],
    ["en-CA", "Canada"],
    ["en-IN", "India"],
    ["en-NZ", "New Zealand"],
    ["en-ZA", "South Africa"],
    ["en-GB", "United Kingdom"],
    ["en-US", "United States"],
  ],
  [
    "Español",
    ["es-AR", "Argentina"],
    ["es-BO", "Bolivia"],
    ["es-CL", "Chile"],
    ["es-CO", "Colombia"],
    ["es-CR", "Costa Rica"],
    ["es-EC", "Ecuador"],
    ["es-SV", "El Salvador"],
    ["es-ES", "España"],
    ["es-US", "Estados Unidos"],
    ["es-GT", "Guatemala"],
    ["es-HN", "Honduras"],
    ["es-MX", "México"],
    ["es-NI", "Nicaragua"],
    ["es-PA", "Panamá"],
    ["es-PY", "Paraguay"],
    ["es-PE", "Perú"],
    ["es-PR", "Puerto Rico"],
    ["es-DO", "República Dominicana"],
    ["es-UY", "Uruguay"],
    ["es-VE", "Venezuela"],
  ],
  ["Euskara", ["eu-ES"]],
  ["Français", ["fr-FR"]],
  ["Galego", ["gl-ES"]],
  ["Hrvatski", ["hr_HR"]],
  ["IsiZulu", ["zu-ZA"]],
  ["Íslenska", ["is-IS"]],
  ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]],
  ["Magyar", ["hu-HU"]],
  ["Nederlands", ["nl-NL"]],
  ["Norsk bokmål", ["nb-NO"]],
  ["Polski", ["pl-PL"]],
  ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]],
  ["Română", ["ro-RO"]],
  ["Slovenčina", ["sk-SK"]],
  ["Suomi", ["fi-FI"]],
  ["Svenska", ["sv-SE"]],
  ["Türkçe", ["tr-TR"]],
  ["български", ["bg-BG"]],
  ["Pусский", ["ru-RU"]],
  ["Српски", ["sr-RS"]],
  ["한국어", ["ko-KR"]],
  [
    "中文",
    ["cmn-Hans-CN", "普通话 (中国大陆)"],
    ["cmn-Hans-HK", "普通话 (香港)"],
    ["cmn-Hant-TW", "中文 (台灣)"],
    ["yue-Hant-HK", "粵語 (香港)"],
  ],
  ["日本語", ["ja-JP"]],
  ["Lingua latīna", ["la"]],
];

var select_language = document.getElementById("select_language");
var select_dialect = document.getElementById("select_dialect");

var speechChunks = [""];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 6;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo("info_start");

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? "hidden" : "visible";
}

var create_email = false;
var final_transcript = "";
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!("webkitSpeechRecognition" in window)) {
  upgrade();
} else {
  start_button.style.display = "inline-block";
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function () {
    recognizing = true;
    showInfo("info_speak_now");
    // start_img.src = 'mic.png';
  };

  recognition.onerror = function (event) {
    if (event.error == "no-speech") {
      //   start_img.src = 'mic.png';
      showInfo("info_no_speech");
      ignore_onend = true;
    }
    if (event.error == "audio-capture") {
      //   start_img.src = 'mic.png';
      showInfo("info_no_microphone");
      ignore_onend = true;
    }
    if (event.error == "not-allowed") {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo("info_blocked");
      } else {
        showInfo("info_denied");
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function () {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    // start_img.src = 'mic.png';
    if (!final_transcript) {
      showInfo("info_start");
      return;
    }
    showInfo("");
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById("final_span"));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };

  recognition.onresult = function (event) {
    var interim_transcript = "";
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        speechChunks[0] = event.results[i][0].transcript;
        console.log(speechChunks[0]);
        console.log('finalized speech chunk, going to new image');
        nextButton();
      } else {
        interim_transcript += event.results[i][0].transcript;
        console.log(interim_transcript);
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons("inline-block");
    }
  };
}

function upgrade() {
  start_button.style.visibility = "hidden";
  showInfo("info_upgrade");
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

function createEmail() {
  var n = final_transcript.indexOf("\n");
  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(" ");
  }
  var subject = encodeURI(final_transcript.substring(0, n));
  var body = encodeURI(final_transcript.substring(n + 1));
  window.location.href = "mailto:?subject=" + subject + "&body=" + body;
}

function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_button.style.display = "none";
  copy_info.style.display = "inline-block";
  showInfo("");
}

// save to json
var iterator = 0;
const request = new XMLHttpRequest();
function nextButton() {
  // if (recognizing) {
  //   recognizing = false;
  //   recognition.stop();
  // }
  console.log("next image requested");
  // speechChunks[0] = console.log([final_transcript]);
  var myJsonString = JSON.stringify([speechChunks[0]]);
  console.log("using text:", speechChunks[0]);

  fetch("/newImage", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: myJsonString,
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (response) {
          console.log(response);
          document.getElementById(
            "images"
          ).innerHTML = `<img id="picture" src="static/image${response.image_suffix}.jpg">`;
        });
      } else {
        console.log(response);
        throw Error("error in posting to index");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  //   $.ajax({
  //     url: 'abc',
  //     type: 'POST',
  //     dataType: 'json',
  //     data: JSON.stringify({script: [final_transcript]}),
  //     contentType:"application/json",
  // });

  //newImg();
}
var testImages = [
  "https://images.ctfassets.net/81iqaqpfd8fy/3r4flvP8Z26WmkMwAEWEco/870554ed7577541c5f3bc04942a47b95/78745131.jpg?w=1200&h=1200&fm=jpg&fit=fill",
  "https://upload.wikimedia.org/wikipedia/commons/c/cb/The_Blue_Marble_%28remastered%29.jpg",
  "https://www.princeton.edu/sites/default/files/styles/half_2x/public/images/2022/02/KOA_Nassau_2697x1517.jpg?itok=iQEwihUn",
  "https://thumbs.dreamstime.com/b/assorted-american-food-top-view-109748438.jpg",
  "https://media.gettyimages.com/photos/stack-of-books-picture-id157482029?s=612x612",
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyamin-mellish-186077.jpg&fm=jpg",
  "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg",
  "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_33/2203981/171026-better-coffee-boost-se-329p.jpg",
  // "https://studio.knightlab.com/assets/people/kris-hammond.jpg",
];
function newImg() {
  document.getElementById(
    "images"
  ).innerHTML = `<img id="new_img" src="static/image.jpg">`;
}

function emailButton() {
  if (recognizing) {
    create_email = true;
    recognizing = false;
    recognition.stop();
  } else {
    createEmail();
  }
  email_button.style.display = "none";
  email_info.style.display = "inline-block";
  showInfo("");
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = "";
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = "";
  interim_span.innerHTML = "";
  //   start_img.src = 'mic.png';
  showInfo("info_allow");
  showButtons("none");
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? "inline" : "none";
      }
    }
    info.style.visibility = "visible";
  } else {
    info.style.visibility = "hidden";
  }
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
  //   copy_button.style.display = style;
  //   email_button.style.display = style;
  //   next_button.style.display = style;
  //   copy_info.style.display = 'none';
  //   email_info.style.display = 'none';
  //   email_info.style.display = 'none';
}
