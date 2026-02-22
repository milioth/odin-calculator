//Use script para evitar errores
"use strict";

//  *** Funciones Básicas ***
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

//  *** Variables de Estado ***
/**
 * Primer número introducido por el usuario.
 * @type {number|null}
 */
let firtNumber = null;

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

// *** Función operate ***
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
