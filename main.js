import '@fontsource/jersey-10'
import './style.css'
import dictionary from "./dictionary.json"

let currentTime = 0;
let warningTime = 30;
let alertTime = 10;
let restartOnTimeout = true;

const UIStatus = {
  START: 'start',
  PAUSE: 'pause'
}

function setUIStatus(status) {
  if (status === UIStatus.START) {
    pauseButton.classList.remove('hidden');
    startButton.classList.add('hidden');
  } else if (status === UIStatus.PAUSE) {
    pauseButton.classList.add('hidden');
    startButton.classList.remove('hidden');
  }
}

function start() {
  setUIStatus(UIStatus.START);
  paused = false;
  tickFunction();
}

function pause() {
  setUIStatus(UIStatus.PAUSE);
  paused = true;
}

function reset() {
  pause();
  setupTime();
  updateTimeText();
}

function setupTime() {
  currentTime = Number(minuteInput.value) * 60 + Number(secondInput.value);
  console.log(currentTime);
}

let paused = true;
function tickFunction() {
  if (!paused && currentTime > 0) {
    currentTime--;
    updateTimeText();
    setTimeout(tickFunction, 1000);
  }
  else if (currentTime <= 0) {
    if (restartOnTimeout) {
      setTimeout(() => {
        reset();
      }, 2000);
    }
  }
}

function updateWarningColors() {
  if (currentTime <= warningTime && currentTime > alertTime && !counterArea.classList.contains('warning')) {
    counterArea.classList.add('warning');
    counterArea.classList.remove('alert');
  }
  else if (currentTime <= alertTime && !counterArea.classList.contains('alert')) {
    counterArea.classList.remove('warning');
    counterArea.classList.add('alert');
  }
  else if (currentTime > warningTime && (counterArea.classList.contains('warning') || counterArea.classList.contains('alert'))) {
    counterArea.classList.remove('warning');
    counterArea.classList.remove('alert');
  }
}

function updateTimeText() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  counter.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  updateWarningColors();
}

startButton.addEventListener('click', () => {
  start();
});

pauseButton.addEventListener('click', () => {
  pause();
});

resetButton.addEventListener('click', () => {
  reset();
});

setTime.addEventListener('click', () => {
  setupTime();
  updateTimeText();
});

function loadSetup() {
  try {
    const setup = JSON.parse(localStorage.getItem("timerSetup"));
    cfgWarningSeconds.value = setup.warningSeconds;
    cfgAlertSeconds.value = setup.alertSeconds;
    cfgDefaultMinutes.value = setup.defaultMinutes;
    cfgDefaultSeconds.value = setup.defaultSeconds;
    minuteInput.value = setup.defaultMinutes;
    secondInput.value = setup.defaultSeconds;
    restartOnTimeout = setup.restartOnTimeout ?? true;
    const oldClockStyle = setup.oldStyle ?? false;
    if (oldClockStyle) {
      counter.classList.add('classic');
      cfgClockStyle.setAttribute("checked","checked");
    }
    else {
      counter.classList.remove('classic');
    }
    if (restartOnTimeout) {
      cfgRestartOnTimeout.setAttribute("checked","checked");
    }
    else {
      cfgRestartOnTimeout.removeAttribute("checked");
    }
  }
  catch (err) {
  }
}

function updateSeupt() {
  const setup = {
    warningSeconds: cfgWarningSeconds.value,
    alertSeconds: cfgAlertSeconds.value,
    defaultMinutes: cfgDefaultMinutes.value,
    defaultSeconds: cfgDefaultSeconds.value,
    oldStyle: cfgClockStyle.checked,
    restartOnTimeout: cfgRestartOnTimeout.checked
  }
  localStorage.setItem("timerSetup", JSON.stringify(setup));
  warningTime = Number(cfgWarningSeconds.value);
  alertTime = Number(cfgAlertSeconds.value);
  restartOnTimeout = cfgRestartOnTimeout.checked;
  const oldClockStyle = setup.oldStyle ?? false;
  if (oldClockStyle) {
    counter.classList.add('classic');
  }
  else {
    counter.classList.remove('classic');
  }
  updateWarningColors();
}


function translateTexts() {
  document.querySelectorAll('[data-translate]').forEach((element) => {
    const lang = navigator.language.split('-')[0];
    const dict = dictionary[lang];
    if (dict) {
      const text = dict[element.getAttribute('data-translate')];
      element.innerText = text || element.innerText;
    }
  });
}

cfgWarningSeconds.addEventListener('change', updateSeupt);
cfgAlertSeconds.addEventListener('change', updateSeupt);
cfgDefaultMinutes.addEventListener('change', updateSeupt);
cfgDefaultSeconds.addEventListener('change', updateSeupt);
cfgClockStyle.addEventListener('change', updateSeupt);
cfgRestartOnTimeout.addEventListener('change', updateSeupt);

loadSetup();
setUIStatus(UIStatus.PAUSE);
setupTime();
updateTimeText();
translateTexts();
