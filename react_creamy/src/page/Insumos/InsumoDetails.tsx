// src/page/Insumos/InsumoDetails.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import api from '../../api/api';

const AlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

interface InsumoDetailsProps {
  id: number;
  onClose: () => void;
}

interface Insumo {
  ID_insumo: number;
  descripcion_insumo: string;
  precio: number;
  estado_insumo: string;
  stock: {
    stock_actual: number;
    stock_min: number;
    stock_max: number;
  };
}

const InsumoDetails: React.FC<InsumoDetailsProps> = ({ id, onClose }) => {
  const [insumo, setInsumo] = useState<Insumo | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchInsumoDetails = async () => {
      try {
        const response = await api.get(`/insumos/${id}/detalle`);
        setInsumo(response.data);
      } catch (error) {
        setError('Error al obtener los detalles del insumo');
        console.error('Error al obtener los detalles del insumo:', error);
      }
    };

    fetchInsumoDetails();
  }, [id]);

  const getStockStatus = () => {
    if (!insumo) return null;
    
    if (insumo.stock.stock_actual <= insumo.stock.stock_min) {
      return <Badge variant="destructive">Stock Bajo</Badge>;
    }
    if (insumo.stock.stock_actual >= insumo.stock.stock_max) {
      return <Badge variant="warning">Stock Alto</Badge>;
    }
    return <Badge variant="success">Stock Normal</Badge>;
  };

  if (error) {
    return (
      <Card className="tw-w-full tw-max-w-md tw-mx-auto">
        <CardContent className="tw-pt-6">
          <div className="tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-text-red-500">
            <AlertCircle />
            <p>{error}</p>
          </div>
        </CardContent>
        <CardFooter className="tw-justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!insumo) {
    return (
      <Card className="tw-w-full tw-max-w-md tw-mx-auto">
        <CardHeader>
          <Skeleton className="tw-h-8 tw-w-3/4" />
        </CardHeader>
        <CardContent className="tw-space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tw-flex tw-justify-between tw-items-center">
              <Skeleton className="tw-h-4 tw-w-1/3" />
              <Skeleton className="tw-h-4 tw-w-1/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tw-w-full tw-max-w-md tw-mx-auto">
      <CardHeader className="tw-pb-3">
        <div className="tw-flex tw-justify-between tw-items-center">
          <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800">
            {insumo.descripcion_insumo}
          </h2>
          <Badge 
            variant={insumo.estado_insumo === 'A' ? 'success' : 'destructive'}
          >
            {insumo.estado_insumo === 'A' ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="tw-space-y-6">
        <div className="tw-bg-gray-50 tw-p-4 tw-rounded-lg">
          <div className="tw-text-lg tw-font-medium tw-text-gray-900">
            ${insumo.precio.toFixed(2)}
          </div>
          <div className="tw-text-sm tw-text-gray-500">Precio unitario</div>
        </div>

        <div className="tw-space-y-4">
          <div>
            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-2">
              Información de Stock
            </h3>
            <div className="tw-grid tw-grid-cols-3 tw-gap-4">
              <div className="tw-bg-white tw-p-3 tw-rounded-lg tw-border">
                <div className="tw-text-lg tw-font-semibold">
                  {insumo.stock.stock_actual}
                </div>
                <div className="tw-text-xs tw-text-gray-500">Actual</div>
              </div>
              <div className="tw-bg-white tw-p-3 tw-rounded-lg tw-border">
                <div className="tw-text-lg tw-font-semibold">
                  {insumo.stock.stock_min}
                </div>
                <div className="tw-text-xs tw-text-gray-500">Mínimo</div>
              </div>
              <div className="tw-bg-white tw-p-3 tw-rounded-lg tw-border">
                <div className="tw-text-lg tw-font-semibold">
                  {insumo.stock.stock_max}
                </div>
                <div className="tw-text-xs tw-text-gray-500">Máximo</div>
              </div>
            </div>
            <div className="tw-mt-2 tw-flex tw-justify-end">
              {getStockStatus()}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="tw-justify-end tw-pt-6">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsumoDetails;