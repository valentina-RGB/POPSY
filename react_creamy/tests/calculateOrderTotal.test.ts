import { calculateOrderTotal } from '../src/page/utils';
import { describe, test, expect } from '@jest/globals';

describe('calculateOrderTotal', () => {
    test('Debe calcular correctamente el total del pedido con productos y adiciones', () => {
        const productosAgregados = [
          {
            precio_neto: 100,
            Producto_Pedido: [
              {
                cantidad: 2,
                Adiciones: [
                  { total: 10 },
                  { total: 5 },
                ],
              },
              {
                cantidad: 1,
                Adiciones: [
                  { total: 20 },
                ],
              },
            ],
          },
          {
            precio_neto: 50,
            Producto_Pedido: [
              {
                cantidad: 1,
                Adiciones: [],
              },
            ],
          },
        ];
      
        const resultado = calculateOrderTotal(productosAgregados);
        expect(resultado).toBe(385); 
      });
      

  test('Debe devolver 0 si no hay productos', () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  test('Debe manejar productos sin adiciones', () => {
    const productosAgregados = [
      {
        precio_neto: 150,
        Producto_Pedido: [
          { cantidad: 3, Adiciones: [] },
        ],
      },
    ];

    const resultado = calculateOrderTotal(productosAgregados);
    expect(resultado).toBe(450);
  });
});
