//Use script para evitar errores
"use strict";

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
function multuply(a, b) {
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
        throw new Error("No se puede dividir por 0");
    }
    return a / b;
}