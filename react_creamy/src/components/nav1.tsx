import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="sidebar py-3" id="sidebar">
      <h6 className="sidebar-heading">Creamy Soft</h6>
      <ul className="list-unstyled">
        <li className="sidebar-list-item">
          <Link
            className="sidebar-link text-muted active collapsed"
            to="/Dashboard"
            data-bs-target="#dashboard"
            role="button"
            aria-expanded="false"
            data-bs-toggle="collapse">
            <svg className="svg-icon svg-icon-md me-3"></svg>
            <span className="sidebar-link-title">Dashboard</span>
          </Link>
          <ul
            className="sidebar-menu list-unstyled collapse"
            id="dashboard">
            <li className="sidebar-list-item">
              <Link className="sidebar-link  text-muted" to="/Dashboard">
                Todo
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link
                className="sidebar-link text-muted"
                to="#">
                Los productos más vendidos
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link
                className="sidebar-link text-muted"
                to="#">
                Domicilios y pedidos
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link
                className="sidebar-link text-muted"
                to="#">
                Balance de insumos
              </Link>
            </li>
          </ul>
        </li>
        <li className="sidebar-list-item">
          <Link
            className="sidebar-link text-muted"
            to="#"
            data-bs-target="#insumos"
            role="button"
            aria-expanded="false"
            data-bs-toggle="collapse">
            <svg className="svg-icon svg-icon-md me-3"></svg>
            <span className="sidebar-link-title">Insumos</span>
          </Link>
          <ul className="sidebar-menu list-unstyled collapse" id="insumos">
            <li className="sidebar-list-item">
              <Link to="/Insumos" className="sidebar-link text-muted">
                Insumos
              </Link>
            </li>   
            <li className="sidebar-list-item">
              <Link to="/historial-entradas" className="sidebar-link text-muted">
                Historial de Entradas
              </Link>
            </li>      
          </ul>
        </li>
        <li className="sidebar-list-item">
          <Link
            className="sidebar-link text-muted"
            to="#"
            data-bs-target="#ventas"
            role="button"
            aria-expanded="false"
            data-bs-toggle="collapse">
            <svg className="svg-icon svg-icon-md me-3"></svg>
            <span className="sidebar-link-title">Ventas</span>
          </Link>
          <ul className="sidebar-menu list-unstyled collapse" id="ventas">
            <li className="sidebar-list-item">
              <Link to="/Categorias" className="sidebar-link text-muted">
                Categorías
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/Productos" className="sidebar-link text-muted">
                Productos
              </Link>
            </li> 
            <li>
            <Link to="/Pedidos" className="sidebar-link text-muted">
                Pedidos
            </Link> 
            </li>    
            <li>
            <Link to="/Ventas" className="sidebar-link text-muted">
                Ventas
            </Link> 
              </li>       
          
          </ul>
        </li>
        
        <li className="sidebar-list-item">
          <Link
            className="sidebar-link text-muted"
            to="#"
            data-bs-target="#widgetsDropdownss"
            role="button"
            aria-expanded="false"
            data-bs-toggle="collapse">
            <svg className="svg-icon svg-icon-md me-3"></svg>
            <span className="sidebar-link-title">Configuración</span>
          </Link>
          <ul className="sidebar-menu list-unstyled collapse" id="widgetsDropdownss">
            <li className="sidebar-list-item">
              <Link to="/Roles" className="sidebar-link text-muted">
                Roles
              </Link>
            </li>   
            <li className="sidebar-list-item">
              <Link to="/Usuarios" className="sidebar-link text-muted">
                Usuarios
              </Link>
            </li>         
          </ul>
        </li>
          <ul
            className="sidebar-menu list-unstyled collapse "
            id="widgetsDropdow"
          >
       
          </ul>
 
      </ul>
    </div>
  );
}

//<use xlink:href="https://demo.bootstrapious.com/bubbly/1-3-2/icons/orion-svg-sprite.71e9f5f2.svg#file-storage-1"> </use> */}

// href="https://demo.bootstrapious.com/bubbly/1-3-2/charts-gauge-sparkline.html"

export default Menu;
