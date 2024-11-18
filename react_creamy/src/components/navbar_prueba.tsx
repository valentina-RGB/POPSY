import { useState } from "react";

const Navbar = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    toggleMenu(); // Llamamos a la función pasada desde el sidebar
  };

  return (
    <nav className="tw-relative tw-bg-white tw-shadow dark:tw-bg-gray-800">
      <div className="tw-container tw-px-6 tw-py-4 tw-mx-auto">
        <div className="tw-lg:flex tw-lg:items-center tw-lg:justify-between">
          <div className="tw-flex tw-items-center tw-justify-between">
            {/* Botón menú móvil */}
            <div className="tw-flex tw-lg:hidden">
              <button
                onClick={handleMenuToggle}
                type="button"
                className="tw-text-gray-500 dark:tw-text-gray-200 hover:tw-text-gray-600 dark:hover:tw-text-gray-400 focus:tw-outline-none"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-w-6 tw-h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-w-6 tw-h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
            <a
              href="#"
              className="tw-px-3 tw-py-2 tw-mx-3 tw-mt-2 tw-text-gray-700 tw-transition-colors tw-duration-300 tw-transform tw-rounded-md tw-lg:mt-0 dark:tw-text-gray-200 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw-inline-block tw-w-5 tw-h-5 tw-mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H4a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1"
                />
              </svg>
              Salir
            </a>
          </div>

          {/* Menú: Visible en móviles y en pantallas grandes */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
