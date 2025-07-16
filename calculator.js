let history = []; // 계산 기록을 저장하는 배열
let currentInput = ""; // 현재 입력값

// 숫자 버튼 클릭 시 디스플레이에 숫자 추가
const appendNumber = (number) => {
  if (number === '.' && currentInput.includes('.')) {
    // 현재 숫자에 이미 소수점이 있으면 추가하지 않음
    return;
  }
  currentInput += number;
  updateDisplay();
};

// 연산자(+, -, *, /, (, )) 버튼 클릭 시 추가
const appendOperator = (op) => {
  const lastChar = currentInput.slice(-1);
  const operators = ['+', '-', '*', '/', '(', ')'];

  if (operators.includes(lastChar) && operators.includes(op) && op !== '(' && op !== ')') {
    // 마지막 문자가 연산자이고, 새로 입력된 것도 연산자이며, 괄호가 아닌 경우 중복 방지
    return;
  }

  currentInput += op;
  updateDisplay();
};

// C(초기화) 버튼 클릭 시 모든 값 초기화
const clearDisplay = () => {
  currentInput = "";
  updateDisplay();
  document.getElementById("result").classList.add("d-none");
};

// 디스플레이 업데이트
const updateDisplay = () => {
  const display = document.getElementById("display");
  display.textContent = currentInput || "0";
};

// 공학용 함수 계산
const calculateFunction = (func) => {
  try {
    if (!currentInput) throw new Error("숫자를 먼저 입력하세요.");
    
    let result;
    // 현재 입력된 수식에서 마지막 숫자 또는 괄호로 묶인 부분을 추출
    const match = currentInput.match(/(\d+(\.\d+)?|\([^)]+\))$/);
    if (!match) throw new Error("유효한 숫자가 아닙니다.");
    
    let numberStr = match[1];
    let number;

    if (numberStr.startsWith('(') && numberStr.endsWith(')')) {
        // 괄호 안의 수식을 먼저 계산
        number = eval(numberStr);
    } else {
        number = parseFloat(numberStr);
    }

    if(isNaN(number)) throw new Error("유효한 숫자가 아닙니다.");

    switch (func) {
      case "sin":
        result = Math.sin((number * Math.PI) / 180); // degree to radian
        break;
      case "cos":
        result = Math.cos((number * Math.PI) / 180); // degree to radian
        break;
      case "tan":
        result = Math.tan((number * Math.PI) / 180); // degree to radian
        break;
      case "sqrt":
        if(number < 0) throw new Error("음수의 제곱근은 계산할 수 없습니다.");
        result = Math.sqrt(number);
        break;
      case "log":
        if(number <= 0) throw new Error("로그의 진수는 양수여야 합니다.");
        result = Math.log10(number);
        break;
      case "pow":
        result = Math.pow(number, 2);
        break;
      default:
        throw new Error("알 수 없는 함수입니다.");
    }
    
    // 함수가 적용된 부분을 결과로 대체
    currentInput = currentInput.substring(0, currentInput.length - numberStr.length) + result;
    updateDisplay();
    recordHistory(`${func}(${numberStr})`, result);

  } catch (error) {
    showError(error.message);
  }
};


// = 버튼 클릭 시 계산 실행
const calculate = () => {
  const resultElement = document.getElementById("result");
  try {
    if (!currentInput) throw new Error("계산할 식이 없습니다.");

    // eval()의 보안 위험을 줄이기 위해 입력값 검증
    // 숫자, 연산자(+, -, *, /, %), 괄호, 소수점만 허용
    const sanitizedInput = currentInput.replace(/[^0-9+\-*\/().]/g, '');
    if (sanitizedInput !== currentInput) {
      throw new Error("허용되지 않는 문자가 포함되어 있습니다.");
    }

    const result = eval(sanitizedInput);

    if (isNaN(result) || !isFinite(result)) {
      throw new Error("계산 결과가 유효하지 않습니다.");
    }
    
    resultElement.classList.remove("d-none", "alert-danger");
    resultElement.classList.add("alert-info");
    resultElement.textContent = `결과: ${result}`;

    recordHistory(currentInput, result);
    currentInput = result.toString();
    updateDisplay();

  } catch (error) {
    showError(error.message || "잘못된 수식입니다.");
  }
};

// 에러 메시지 출력
const showError = (message) => {
  const resultElement = document.getElementById("result");
  resultElement.classList.remove("d-none", "alert-info");
  resultElement.classList.add("alert-danger");
  resultElement.textContent = `에러: ${message}`;
};

// 계산 기록 저장 및 화면 업데이트
const recordHistory = (expression, result) => {
    const record = { expression, result };
    history.push(record);
    updateHistoryDisplay();
}

const updateHistoryDisplay = () => {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = ""; // 기존 목록 비우기

  history.slice().reverse().forEach((record) => {
    const listItem = document.createElement("li");
    listItem.className = "bg-white p-3 rounded-lg shadow";
    listItem.textContent = `${record.expression} = ${record.result}`;
    historyList.appendChild(listItem);
  });
};