/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Insumo = {
  ID_insumo: number;
  descripcion_insumo: string;
  precio: number;
  Adiciones_Insumos: {
    cantidad: number;
    sub_total: number;
  };
};

type Adicion = {
  cantidad: number;
  total: number;
  Insumos: Insumo[];
};

type ProductoPedido = {
  ID_producto_venta: number;
  ID_venta: number;
  ID_producto: number;
  cantidad: number;
  precio_neto: number;
  sub_total: number;
  Adiciones: Adicion[];
};

type Producto = {
  ID_producto: number;
  nombre: string;
  precio_neto: number;
  Producto_Venta: ProductoPedido[];
};

type Pedido = {
  ID_venta: number;
  fecha: string;
  precio_total: number;
  ID_estado_venta: number;
  ProductosLista: Producto[];
};

export const generarPDFPedido = async (id: number) => {
  try {
    // Obtener los datos del pedido desde la API
    const { data: pedido } = await axios.get<Pedido>(
      `http://localhost:3300/ventas/${id}`
    );

    const doc = new jsPDF();

    // Encabezado del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Detalles del Pedido #${pedido.ID_venta}`, 14, 20);

    // Información General del Pedido
    const infoPedido = [
      ["Fecha", new Date(pedido.fecha).toLocaleString("es-ES")],
      ["Estado", `Estado ID: ${pedido.ID_estado_venta}`],
      [
        "Precio Total",
        new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "COP",
        }).format(pedido.precio_total),
      ],
    ];

    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: infoPedido,
      startY: 30,
      styles: { fontSize: 12, cellPadding: 5 },
    });

    // Información de los Productos
    if (pedido.ProductosLista.length > 0) {
      pedido.ProductosLista.forEach((producto, idx) => {
        const startY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text(`Producto ${idx + 1}: ${producto.nombre}`, 14, startY);

        const detallesProducto = producto.Producto_Venta.map((prodPedido) => [
          prodPedido.ID_producto_venta,
          prodPedido.precio_neto,
          prodPedido.sub_total,
        ]);

        autoTable(doc, {
          head: [["ID producto venta", "Precio Neto", "Subtotal"]],
          body: detallesProducto,
          startY: startY + 5,
          styles: { fontSize: 10, cellPadding: 4 },
        });

        // Detalles de Adiciones (si existen)
        producto.Producto_Venta.forEach((prodPedido) => {
          prodPedido.Adiciones.forEach((adicion, adIdx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const startYAdiciones = (doc as any).autoTable.previous.finalY + 5;
            doc.setFontSize(14);
            doc.setTextColor(80);
            doc.text(
              `Detalle ${adIdx + 1} - Cantidad: ${adicion.cantidad}`,
              14,
              startYAdiciones
            );

            const insumosAdicion = adicion.Insumos.map((insumo) => [
              insumo.descripcion_insumo,
              insumo.precio,
              insumo.Adiciones_Insumos.cantidad,
              insumo.Adiciones_Insumos.sub_total,
            ]);

            autoTable(doc, {
              head: [["Insumo", "Precio", "Cantidad", "Subtotal"]],
              body: insumosAdicion,
              startY: startYAdiciones + 5,
              styles: { fontSize: 10, cellPadding: 3 },
            });
          });
        });
      });
    }

    // Guardar el archivo como PDF
    doc.save(`Venta_${pedido.ID_venta}.pdf`);
  } catch (error) {
    console.error("Error al generar el PDF del pedido:", error);
  }
};
