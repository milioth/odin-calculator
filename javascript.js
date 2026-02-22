//Use script para evitar errores
"use strict";

// *** Funciones Básicas ***
/**
 * Suma dos números.
 *
 * @param {number} a - Primer sumando.
 * @param {number} b - Segundo sumando.
 * @returns {number} Resultado de la suma a + b.
 */
function sum(a, b) {
    return a + b;
}

/**
 * Resta dos números.
 *
 * @param {number} a - Minuendo (número del que se resta).
 * @param {number} b - Sustraendo (número que se resta).
 * @returns {number} Resultado de la resta a - b.
 */
function subtract(a, b) {
    return a - b;
}

/**
 * Multiplica dos números.
 *
 * @param {number} a - Primer factor.
 * @param {number} b - Segundo factor.
 * @returns {number} Resultado de la multiplicación a * b.
 */
function multiply(a, b) {
    return a * b;
}

/**
 * Divide dos números.
 *
 * @param {number} a - Dividendo.
 * @param {number} b - Divisor.
 * @returns {number} Resultado de la división a / b.
 *
 * @throws {Error} Lanza un error si el divisor es 0.
 */
function divide(a, b) {
    if (b === 0) {
        throw new Error("No se puede dividir por 0.");
    }
    return a / b;
}

// *** Variables de Estado ***
/**
 * Primer número introducido por el usuario.
 * @type {number|null}
 */
let firstNumber = null;

/**
 * Segundo número introducido por el usuario.
 * @type {number|null}
 */
let secondNumber = null;

/**
 * Operador seleccionado por el usuario.
 * Puede ser: "+", "-", "*", "/"
 * @type {string|null}
 */
let operator = null;

// *** Función operate() ***
/**
 * Ejecuta una operación matemática en función del operador indicado.
 *
 * @param {string} op - Operador matemático ("+", "-", "*", "/").
 * @param {number} a - Primer operando.
 * @param {number} b - Segundo operando.
 * @returns {number} Resultado de la operación.
 *
 * @throws {Error} Si el operador no es válido.
 */
function operate(op, a, b) { 
    switch (op) {
        case "+":
            return sum(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            throw new Error("Operador no válido.");
    }
}

// *** Variables de entrada ***
/**
 * Número que el usuario está introduciendo actualmente (como texto).
 * @type {string}
 */
let currentInput = "";

/**
 * Indica si el display está mostrando un resultado y el siguiente dígito
 * debe empezar una operación nueva en vez de “pegarse” al resultado.
 * @type {boolean}
 */
let isShowingResult = false;

// *** Funciones para Actualizar Display y Añadir Dígitos ***
/**
 * Actualiza el contenido del display de la calculadora.
 *
 * @param {string} value - Texto a mostrar en el display.
 * @returns {void}
 */
function updateDisplay(value) {
    const display = document.getElementById("display");
    display.textContent = value;
}

/**
 * Añade un dígito al número que el usuario está introduciendo.
 *
 * Reglas:
 * - Si estábamos mostrando un resultado, comenzar desde cero.
 * - Evitar ceros iniciales innecesarios (ej.: "0002" -> "2").
 *
 * @param {string} digit - Dígito pulsado ("0"..."9").
 * @returns {void}
 */
function appendDigit(digit) {
    if (isShowingResult) {
        currentInput = "";
        isShowingResult = false;
    }

    if (currentInput.length >= MAX_DISPLAY_LENGTH) {
        return;
    }

    //Evitar "0000000..." como entrada
    if (currentInput === "0") {
        currentInput = digit; //sustituye el 0 por el nuevo dígito
    } else {
        currentInput += digit; 
    }

    updateDisplay(currentInput === "" ? "0" : currentInput)
}

// *** Eventos de Clics en Botones Numéricos ***
/**
 * Inicializa los eventos de los botones de dígitos.
 *
 * @returns {void}
 */
function initDigitButtons() { 
    const digitButtons = document.querySelectorAll(".btn-digit");

    digitButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const digit = btn.dataset.digit; // "0".."9"
            appendDigit(digit);
        });
    });
}

// *** Función resetCalculator() con botón Clear***
/**
 * Reinicia completamente el estado de la calculadora.
 *
 * @returns {void}
 */
function resetCalculator() { 
    firstNumber = null;
    secondNumber = null;
    operator = null;

    currentInput = "";
    isShowingResult = false;

    updateDisplay(0);
}

/**
 * Inicializa el evento del botón Clear (C).
 *
 * @returns {void}
 */
function initClearButton() {
    const clearBtn = document.querySelector('[data-action = "clear"]');

    clearBtn.addEventListener("click", () => {
        resetCalculator();
    });
}

// *** Manejador de errores de operación ***
/**
 * Gestiona errores de cálculo (por ejemplo, división entre 0).
 *
 * @param {Error} err - Error capturado.
 * @returns {void}
 */
function handleOperationError(err) {
  updateDisplay(`Error: ${err.message}`);
  resetCalculator(); // deja la calculadora en estado limpio tras mostrar el error
}

// *** Función para Seleccionar Operador (Lógica Principal) ***
/**
 * Establece el operador y gestiona el estado de la operación.
 *
 * Reglas:
 * - Si no hay firstNumber y hay currentInput: currentInput pasa a firstNumber.
 * - Si ya hay firstNumber y operator, y además hay currentInput: se evalúa y
 *   el resultado pasa a ser el nuevo firstNumber (encadenado).
 * - Si se pulsan operadores consecutivos (sin currentInput), no se evalúa nada:
 *   solo se actualiza el operador al último pulsado.
 *
 * @param {string} op - Operador ("+", "-", "*", "/").
 * @returns {void}
 */
function setOperator(op) {
  // Caso: no hay nada escrito ni primer número -> no hacemos nada
  if (firstNumber === null && currentInput === "") {
    return;
  }

  // Caso: aún no hay firstNumber, pero sí hay entrada actual
  if (firstNumber === null && currentInput !== "") {
    firstNumber = Number(currentInput);
    operator = op;
    currentInput = "";
    isShowingResult = false;
    updateDisplay(String(firstNumber));
    return;
  }

  // Caso: ya existe firstNumber y el usuario pulsa operadores consecutivos
  // (no hay segundo número aún)
  if (firstNumber !== null && currentInput === "") {
    operator = op; // solo sustituimos el operador
    return;
  }

  // Caso: hay firstNumber y currentInput (segundo número). Si además hay operador previo,
  // evaluamos para encadenar.
  if (firstNumber !== null && currentInput !== "" && operator !== null) {
    secondNumber = Number(currentInput);

    try {
      const result = operate(operator, firstNumber, secondNumber);
      firstNumber = result;
      secondNumber = null;

      // Mostramos resultado y dejamos preparado para seguir tecleando el siguiente número
      updateDisplay(formatForDisplay(result));
      isShowingResult = true;

      // Guardamos el nuevo operador para la siguiente operación
      operator = op;
      currentInput = "";
    } catch (err) {
      handleOperationError(err);
    }

    return;
  }

  // Caso residual: si hay firstNumber y currentInput pero no hay operator (poco probable),
  // simplemente establecemos operador.
  operator = op;
}

/**
 * Inicializa los eventos de los botones de operador.
 *
 * @returns {void}
 */
function initOperatorButtons() {
  const operatorButtons = document.querySelectorAll(".btn-operator");

  operatorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const op = btn.dataset.operator; // "+", "-", "*", "/"
      setOperator(op);
    });
  });
}

// *** Función evaluate() ***
/**
 * Evalúa la operación actual si hay datos suficientes:
 * firstNumber + operator + secondNumber.
 *
 * Reglas:
 * - Si falta algún dato, no hace nada (evita errores por "=" prematuro).
 * - Tras calcular:
 *   - el resultado pasa a ser firstNumber (para permitir seguir operando),
 *   - se limpia operator y secondNumber,
 *   - se marca que se está mostrando un resultado.
 *
 * @returns {void}
 */
function evaluate() {
  // Solo evaluamos si hay primer número, operador y un segundo número escrito
  if (firstNumber === null || operator === null || currentInput === "") {
    return;
  }

  secondNumber = Number(currentInput);

  try {
    const result = operate(operator, firstNumber, secondNumber);

    updateDisplay(formatForDisplay(result));

    // Dejar listo para continuar con el resultado como primer número
    firstNumber = result;
    secondNumber = null;
    operator = null;

    currentInput = "";
    isShowingResult = true;
  } catch (err) {
    handleOperationError(err);
  }
}

/**
 * Inicializa el evento del botón "=".
 *
 * @returns {void}
 */
function initEqualsButton() {
  const equalsBtn = document.querySelector('[data-action="equals"]');

  equalsBtn.addEventListener("click", () => {
    evaluate();
  });
}

// *** Reglas de Visualización ***
/**
 * Longitud máxima (aprox.) permitida en el display para evitar desbordes.
 * @type {number}
 */
const MAX_DISPLAY_LENGTH = 12;

/**
 * Formatea un número para mostrarlo en el display sin desbordar.
 *
 * Reglas:
 * - Si es entero y cabe, se muestra tal cual.
 * - Si tiene decimales, se redondea para que quepa.
 * - Si aun así no cabe, se usa notación científica (toPrecision).
 *
 * @param {number} value - Número a formatear.
 * @returns {string} Representación segura para el display.
 */
function formatForDisplay(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  // Evitar -0
  if (Object.is(value, -0)) {
    value = 0;
  }

  // Caso simple: tal cual
  let str = String(value);
  if (str.length <= MAX_DISPLAY_LENGTH) {
    return str;
  }

  // Si es decimal, intentamos redondear
  if (!Number.isInteger(value)) {
    // Número de decimales disponible = MAX - (parte entera + punto)
    const absValue = Math.abs(value);
    const intDigits = String(Math.trunc(absValue)).length;
    const decimalsAllowed = Math.max(0, MAX_DISPLAY_LENGTH - intDigits - 1);

    const rounded = Number(value.toFixed(decimalsAllowed));
    str = String(rounded);

    if (str.length <= MAX_DISPLAY_LENGTH) {
      return str;
    }
  }

  // Último recurso: notación científica con precisión limitada
  return value.toPrecision(Math.min(10, MAX_DISPLAY_LENGTH));
}

// *** Función appendDecimal() ***
/**
 * Añade el separador decimal al número en escritura.
 *
 * Reglas:
 * - Si estamos mostrando un resultado, se inicia un número nuevo "0."
 * - Si currentInput está vacío, se convierte en "0."
 * - Si ya existe ".", no se añade otro.
 *
 * @returns {void}
 */
function appendDecimal() {
  if (isShowingResult) {
    currentInput = "";
    isShowingResult = false;
  }

  if (currentInput === "") {
    currentInput = "0.";
    updateDisplay(currentInput);
    return;
  }

  if (currentInput.includes(".")) {
    return;
  }

  // Respeta el límite de display si lo estás aplicando
  if (currentInput.length >= MAX_DISPLAY_LENGTH) {
    return;
  }

  currentInput += ".";
  updateDisplay(currentInput);
}

/** 
 * Inicializa el evento del botón decimal ".".
 *
 * @returns {void}
 */
function initDecimalButton() {
  const decimalBtn = document.querySelector('[data-action="decimal"]');

  decimalBtn.addEventListener("click", () => {
    appendDecimal();
  });
}

// *** Función backspace() ***
/**
 * Elimina el último carácter del número en escritura.
 *
 * Reglas:
 * - Si se estaba mostrando un resultado, backspace inicia una entrada nueva (0).
 * - Si al borrar queda vacío, el display pasa a "0".
 *
 * @returns {void}
 */
function backspace() {
  if (isShowingResult) {
    // Si hay un resultado en pantalla, no tiene sentido "recortarlo" como si fuera entrada
    currentInput = "";
    isShowingResult = false;
    updateDisplay("0");
    return;
  }

  if (currentInput === "") {
    return;
  }

  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput === "" ? "0" : currentInput);
}

/**
 * Inicializa el evento del botón backspace.
 *
 * @returns {void}
 */
function initBackspaceButton() {
  const backspaceBtn = document.querySelector('[data-action="backspace"]');

  backspaceBtn.addEventListener("click", () => {
    backspace();
  });
}

// *** Soporte de Teclado
/**
 * Gestiona la entrada por teclado para controlar la calculadora.
 *
 * @param {KeyboardEvent} event - Evento de teclado.
 * @returns {void}
 */
function handleKeydown(event) {
  const key = event.key;

  // Dígitos
  if (key >= "0" && key <= "9") {
    appendDigit(key);
    return;
  }

  // Decimal
  if (key === ".") {
    appendDecimal();
    return;
  }

  // Operadores
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    setOperator(key);
    return;
  }

  // Evaluar (Enter o "=")
  if (key === "Enter" || key === "=") {
    event.preventDefault(); // evita efectos en formularios (si los hubiera)
    evaluate();
    return;
  }

  // Clear
  if (key === "Escape") {
    resetCalculator();
    return;
  }

  // Backspace
  if (key === "Backspace") {
    backspace();
    return;
  }
}

/**
 * Inicializa el soporte de teclado.
 *
 * @returns {void}
 */
function initKeyboardSupport() {
  document.addEventListener("keydown", handleKeydown);
}

// *** Inicializa al Cargar la Página ***
updateDisplay("0");
initDigitButtons();
initClearButton();
initOperatorButtons();
initEqualsButton();
initDecimalButton();
initBackspaceButton();
initKeyboardSupport();