const MSG = {
	ERROR  : "読み込みに失敗しました。",
	LOADING: "読み込み中......",
	PLAY   : "▶︎",
	STOP   : "■"
};

window.onload = () => {
	run();
};

// テキストボックスのElement
let txtBox: HTMLElement;
let page: HTMLElement;
let range: HTMLElement;

// シナリオ再生中か
let isPlay = false;

// シナリオ
let scenario:string[] = [];

// シナリオ再生位置
let step = 0;

// シナリオタイマー
let timer = 0;

// タイマーの更新間隔
const TIMER_INTERVAL = 50;

// 前回の更新時間
let preUpdateTime = 0;

// シナリオの再生間隔
const INTERVAL = {
	MIN: 100,
	MAX: 1000
};
let interval = (INTERVAL.MAX + INTERVAL.MIN) / 2;

/**
 * エントリーポイント
 */
function run(): void {
	txtBox = <HTMLElement>document.getElementById("txt-box");
	page = <HTMLElement>document.getElementById("txt-current-page");
	setText(MSG.LOADING);
	initRange();
	loadFile();
};

/**
 * テキストボックスにテキストを入れる。
 */
function setText(txt: string) {
	if(txtBox) {
		txtBox.innerText = txt;
	}
};

function initRange() {
	range = <HTMLElement>document.getElementById('range-speed');
	range.addEventListener("input", rangeOnChange);
};

// inputイベント時に値をセットする関数
function rangeOnChange(e:Event) {
	if(e && e.target) {
		const max = +(<HTMLInputElement>e.target).max;
		const val = +(<HTMLInputElement>e.target).value;
		const rate = (max - val) / max;
		interval = INTERVAL.MIN + (INTERVAL.MAX - INTERVAL.MIN ) * rate;
	}
};
/**
 * ファイル読み込み
 */
function loadFile() {
	const req = new XMLHttpRequest();

	// ファイル取得
	req.open("get", "./txt/data.txt", true);
	req.send(null);
	
	req.onload = () => {
		onLoad(req.responseText);
	};
	req.onerror = () => {
		onError();
	};
};

/**
 * ファイル読み込み終了
 */
function onLoad(txt:string) {
	scenario = txt.split("\n");
	showCurrentScenario();
};

/**
 * ステップ数設定
 */
function setStep(_step:number) {
	if(0 <= _step && _step < scenario.length) {
		step = _step;
	}
}

function onScenarioAdd(num:number) {
	addStep(num);
	showCurrentScenario();
};

function addStep(num:number) {
	let _num = step + num;
	if(_num < 0) _num = 0;
	if(scenario.length - 1 < _num) _num = scenario.length - 1;

	setStep(_num);
}
/**
 * ファイル読み込み失敗
 */
function onError() {
	setText(MSG.ERROR);
};

function showCurrentScenario() {
	setText(scenario[step]);

	if(page) {
		page.innerText = step + "";
	}
};

function playScenario(){
	timer = window.setInterval(
		() => {
			const now = (new Date()).getTime();

			// 前回の更新から、一定時間経過していたら
			if(preUpdateTime + interval < now) {
				preUpdateTime = now;
				// 1進める
				addStep(1);
				
				showCurrentScenario();
				// シナリオ止める
				if(scenario.length - 1 <= step) {
					onStop();
				}
			}
		},
		TIMER_INTERVAL
	);
};

function stopTimer() {
	if(timer) {
		window.clearInterval(timer);
		timer = 0;
	}
}
function stopScenario(){
	stopTimer();
	showCurrentScenario();
};

/**
 * 再生/停止ボタン押下
 */
function onPlayOrStop() {
	// 再生状態切り替え
	if(!isPlay) {
		onPlay();
	} else {
		onStop();
	}
};

function onPlay() {
	let button = <HTMLElement>document.getElementById("btn-play");
	button.innerText = MSG.STOP;
	isPlay = true;
	playScenario();
};

function onStop() {
	let button = <HTMLElement>document.getElementById("btn-play");
	button.innerText = MSG.PLAY;
	isPlay = false;
	stopScenario();
};

function onScenarioJump() {
	const num = Number((<HTMLInputElement>document.getElementById("scenario-set")).value);
	setStep(num);
	showCurrentScenario();
};

