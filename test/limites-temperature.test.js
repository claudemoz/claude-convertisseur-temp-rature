import test from 'node:test';
import assert from 'node:assert/strict';

import {
  convertirCelsiusEnFahrenheit,
  convertirFahrenheitEnCelsius,
  arrondirTemperature
} from '../src/conversion.js';

test('convertit -40 dans les deux sens, point de rencontre des deux échelles', () => {
  assert.equal(convertirCelsiusEnFahrenheit(-40), -40);
  assert.equal(convertirFahrenheitEnCelsius(-40), -40);
});

test('convertit des températures négatives', () => {
  assert.equal(convertirCelsiusEnFahrenheit(-10), 14);
  assert.equal(convertirFahrenheitEnCelsius(14), -10);
});

test('convertit la température du corps humain', () => {
  assert.equal(convertirCelsiusEnFahrenheit(37), 98.6);
  assert.equal(convertirFahrenheitEnCelsius(98.6), 37);
});

test('convertit le zéro absolu', () => {
  assert.equal(convertirFahrenheitEnCelsius(-459.67), -273.15);
  assert.equal(arrondirTemperature(convertirCelsiusEnFahrenheit(-273.15)), -459.7);
});

test('convertit des degrés Celsius décimaux en degrés Fahrenheit puis arrondit le résultat', () => {
  assert.equal(arrondirTemperature(convertirCelsiusEnFahrenheit(36.6)), 97.9);
  assert.equal(arrondirTemperature(convertirCelsiusEnFahrenheit(25.5)), 77.9);
  assert.equal(arrondirTemperature(convertirCelsiusEnFahrenheit(-10.5)), 13.1);
});

test('convertit des degrés Fahrenheit en degrés Celsius puis arrondit le résultat', () => {
  assert.equal(arrondirTemperature(convertirFahrenheitEnCelsius(100)), 37.8);
  assert.equal(arrondirTemperature(convertirFahrenheitEnCelsius(0)), -17.8);
  assert.equal(arrondirTemperature(convertirFahrenheitEnCelsius(-10)), -23.3);
});

test("retrouve la température d'origine après un aller-retour", () => {
  const temperaturesCelsius = [0.1, 36.6, -273.15, 100];

  for (const temperatureCelsius of temperaturesCelsius) {
    const temperatureRetrouvee = convertirFahrenheitEnCelsius(
      convertirCelsiusEnFahrenheit(temperatureCelsius)
    );

    assert.ok(Math.abs(temperatureRetrouvee - temperatureCelsius) < 1e-9);
  }
});

test('arrondit une température négative à un chiffre après la virgule', () => {
  assert.equal(arrondirTemperature(-12.34), -12.3);
  assert.equal(arrondirTemperature(-12.36), -12.4);
});

test('arrondit vers le haut une température positive dont la deuxième décimale vaut 5', () => {
  assert.equal(arrondirTemperature(0.05), 0.1);
  assert.equal(arrondirTemperature(1.05), 1.1);
  assert.equal(arrondirTemperature(12.35), 12.4);
});

test('conserve une température déjà arrondie', () => {
  assert.equal(arrondirTemperature(5), 5);
  assert.equal(arrondirTemperature(2.5), 2.5);
  assert.equal(arrondirTemperature(-1.5), -1.5);
});

test("propage NaN sans lever d'exception", () => {
  assert.ok(Number.isNaN(convertirCelsiusEnFahrenheit(NaN)));
  assert.ok(Number.isNaN(convertirFahrenheitEnCelsius(NaN)));
  assert.ok(Number.isNaN(arrondirTemperature(NaN)));
});

test("propage l'infini", () => {
  assert.equal(convertirCelsiusEnFahrenheit(Infinity), Infinity);
  assert.equal(convertirFahrenheitEnCelsius(-Infinity), -Infinity);
  assert.equal(arrondirTemperature(Infinity), Infinity);
  assert.equal(arrondirTemperature(-Infinity), -Infinity);
});

test('arrondit une très grande température sans la modifier', () => {
  assert.equal(arrondirTemperature(1e21), 1e21);
});
