import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="tw-relative tw-bg-white tw-shadow dark:tw-bg-gray-800">
      <div className="tw-container tw-px-6 tw-py-4 tw-mx-auto">
        <div className="tw-lg:flex tw-lg:items-center tw-lg:justify-between">
          <div className="tw-flex tw-items-center tw-justify-between">
            {/* Logo */}
            <a href="#">
              <img
                className="tw-w-auto tw-h-6 sm:tw-h-7"
                src="https://merakiui.com/images/full-logo.svg"
                alt="logo"
              />
            </a>
            

            {/* Botón menú móvil */}
            <div className="tw-flex tw-lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Menú: Visible en móviles y en pantallas grandes */}
          <div
            className={`tw-absolute tw-inset-x-0 tw-z-20 tw-w-full tw-px-6 tw-py-4 tw-transition-all tw-duration-300 tw-ease-in-out tw-bg-white dark:tw-bg-gray-800 tw-lg:mt-0 tw-lg:p-0 tw-lg:top-0 tw-lg:relative tw-lg:bg-transparent tw-lg:w-auto tw-lg:flex tw-lg:items-center ${
              isOpen
                ? "tw-translate-x-0 tw-opacity-100"
                : "tw-opacity-0 -tw-translate-x-full tw-lg:opacity-100 tw-lg:translate-x-0"
            }`}
          >
            <div className="tw-flex tw-flex-col -tw-mx-6 tw-lg:flex-row tw-lg:items-center tw-lg:mx-8">
            <div className="tw-flex tw-items-center tw-mt-4 tw-lg:mt-0">
              <button
                className="tw-hidden tw-mx-4 tw-text-gray-600 tw-transition-colors tw-duration-300 tw-transform tw-lg:block dark:tw-text-gray-200 hover:tw-text-gray-700 dark:hover:tw-text-gray-400 focus:tw-text-gray-700 dark:focus:tw-text-gray-400 focus:tw-outline-none"
                aria-label="show notifications"
              >
                <svg
                  className="tw-w-6 tw-h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="tw-flex tw-items-center focus:tw-outline-none"
                aria-label="toggle profile dropdown"
              >
                <div className="tw-w-8 tw-h-8 tw-overflow-hidden tw-border-2 tw-border-gray-400 tw-rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                    className="tw-object-cover tw-w-full tw-h-full"
                    alt="avatar"
                  />
                </div>

                <h3 className="tw-mx-2 tw-text-gray-700 dark:tw-text-gray-200 tw-lg:hidden">
                  Perfil
                </h3>
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

            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
