const { calculateStockStatus } = require('../src/page/utils');

describe('calculateStockStatus', () => {
  test('Debe devolver "Crítico" si el stock actual es menor que el mínimo', () => {
    expect(calculateStockStatus(5, 10, 50)).toBe('Crítico');
  });

  test('Debe devolver "Bajo" si el stock actual está entre el mínimo y la mitad del máximo', () => {
    expect(calculateStockStatus(20, 10, 50)).toBe('Bajo');
  });

  test('Debe devolver "Normal" si el stock actual está por encima de la mitad del máximo', () => {
    expect(calculateStockStatus(30, 10, 50)).toBe('Normal');
  });
});
