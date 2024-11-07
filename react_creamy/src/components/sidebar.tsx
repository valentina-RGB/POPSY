import { Fragment } from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ChartBarIcon, CogIcon, DocumentChartBarIcon, ClipboardDocumentIcon, UsersIcon, CubeIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline"; // Importar iconos de Heroicons

const Menu: React.FC = () => {
  return (
    <aside className="tw-flex tw-flex-col tw-w-64 tw-h-screen tw-px-5 tw-py-8 tw-overflow-y-auto tw-bg-white tw-border-r tw-rtl:border-r-0 tw-rtl:border-l dark:tw-bg-gray-900 dark:tw-border-gray-700">

      <div className="tw-flex tw-flex-col tw-justify-between tw-flex-1 tw-mt-6">
        <nav className="-tw-mx-3 tw-space-y-6">
          <div className="tw-space-y-3">
            <label className="tw-px-3 tw-text-xs tw-text-gray-500 tw-uppercase dark:tw-text-gray-400">Dashboard</label>

            <Link
              to="/Dashboard"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <HomeIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Dashboard</span>
            </Link>

            <Link
              to="/Insumos"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <ClipboardDocumentIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Insumos</span>
            </Link>

            <Link
              to="/Categorias"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <CubeIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Categorías</span>
            </Link>

            <Link
              to="/Productos"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <DocumentChartBarIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Productos</span>
            </Link>

            <Link
              to="/Pedidos"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <ClipboardDocumentListIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Pedidos</span>
            </Link>

            <Link
              to="/Ventas"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <CurrencyDollarIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Ventas</span>
            </Link>

            <label className="tw-px-3 tw-text-xs tw-text-gray-500 tw-uppercase dark:tw-text-gray-400">Configuración</label>

            <Link
              to="/Roles"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <CogIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Roles</span>
            </Link>

            <Link
              to="/Usuarios"
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-rounded-lg dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-200 hover:tw-text-gray-700"
            >
              <UsersIcon className="tw-w-5 tw-h-5" />
              <span className="tw-mx-2 tw-text-sm tw-font-medium">Usuarios</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Menu;
