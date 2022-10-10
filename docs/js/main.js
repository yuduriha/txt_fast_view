"use strict";
var MSG = {
    ERROR: "読み込みに失敗しました。",
    LOADING: "読み込み中......",
    PLAY: "▶︎",
    STOP: "■"
};
var SCENARIO_DATA = [
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:1話", file: "scenario000.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:2話", file: "scenario001.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:3話", file: "scenario002.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:4話", file: "scenario003.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:5話", file: "scenario004.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:6話", file: "scenario005.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:7話", file: "scenario006.txt" },
    { title: "カリスマJK探偵城ヶ崎美嘉の事件簿:8話", file: "scenario007.txt" },
];
window.onload = function () {
    run();
};
var txtBox;
var page;
var range;
var isPlay = false;
var scenario = [];
var step = 0;
var timer = 0;
var TIMER_INTERVAL = 50;
var preUpdateTime = 0;
var INTERVAL = {
    MIN: 100,
    MAX: 1000
};
var interval = (INTERVAL.MAX + INTERVAL.MIN) / 2;
function run() {
    txtBox = document.getElementById("txt-box");
    page = document.getElementById("txt-current-page");
    initChapterSelecter();
    setText(MSG.LOADING);
    initRange();
    loadFile(SCENARIO_DATA[0].file);
}
;
function initChapterSelecter() {
    var parent = document.getElementById("prt-chapter-selet");
    var selecter = "";
    SCENARIO_DATA.forEach(function (element, i) {
        selecter += '<option value="' + i + '">' + element.title + '</option>';
    });
    var dom = document.createElement("select");
    dom.innerHTML = selecter;
    parent.appendChild(dom);
    dom.addEventListener("change", function (e) {
        var _value = +e.currentTarget.value;
        loadFile(SCENARIO_DATA[_value].file);
    });
}
;
function setText(txt) {
    if (txtBox) {
        txtBox.innerText = txt;
    }
}
;
function initRange() {
    range = document.getElementById('range-speed');
    range.addEventListener("input", rangeOnChange);
}
;
function rangeOnChange(e) {
    if (e && e.target) {
        var max = +e.target.max;
        var val = +e.target.value;
        var rate = (max - val) / max;
        interval = INTERVAL.MIN + (INTERVAL.MAX - INTERVAL.MIN) * rate;
    }
}
;
function loadFile(fileName) {
    var req = new XMLHttpRequest();
    req.open("get", "./txt/" + fileName, true);
    req.send(null);
    req.onload = function () {
        if (req.status == 200) {
            onLoad(req.responseText);
        }
        else {
            onError();
        }
    };
    req.onerror = function () {
        onError();
    };
}
;
function onLoad(txt) {
    scenario = txt.split("\n");
    step = 0;
    stopTimer();
    timer = 0;
    preUpdateTime = 0;
    showCurrentScenario();
}
;
function setStep(_step) {
    if (0 <= _step && _step < scenario.length) {
        step = _step;
    }
}
function onScenarioAdd(num) {
    addStep(num);
    showCurrentScenario();
}
;
function addStep(num) {
    var _num = step + num;
    if (_num < 0)
        _num = 0;
    if (scenario.length - 1 < _num)
        _num = scenario.length - 1;
    setStep(_num);
}
function onError() {
    setText(MSG.ERROR);
}
;
function showCurrentScenario() {
    setText(scenario[step]);
    if (page) {
        page.innerText = (step + 1) + "/" + scenario.length;
    }
}
;
function playScenario() {
    timer = window.setInterval(function () {
        var now = (new Date()).getTime();
        if (preUpdateTime + interval < now) {
            preUpdateTime = now;
            addStep(1);
            showCurrentScenario();
            if (scenario.length - 1 <= step) {
                onStop();
            }
        }
    }, TIMER_INTERVAL);
}
;
function stopTimer() {
    if (timer) {
        window.clearInterval(timer);
        timer = 0;
    }
}
function stopScenario() {
    stopTimer();
    showCurrentScenario();
}
;
function onPlayOrStop() {
    if (!isPlay) {
        onPlay();
    }
    else {
        onStop();
    }
}
;
function onPlay() {
    var button = document.getElementById("btn-play");
    button.innerText = MSG.STOP;
    isPlay = true;
    playScenario();
}
;
function onStop() {
    var button = document.getElementById("btn-play");
    button.innerText = MSG.PLAY;
    isPlay = false;
    stopScenario();
}
;
function onScenarioJump() {
    var num = Number(document.getElementById("scenario-set").value);
    setStep(num - 1);
    showCurrentScenario();
}
;
