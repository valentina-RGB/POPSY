
 // Asegúrate de importar el CSS de DataTables
// import SimpleDatatables from 'simple-datatables';  
// import DataTable from 'datatables.net-dt';
// import { useState, useEffect } from 'react';
// import { getItems } from '../services/categoriaServices';
 
// import axios from 'axios';

// interface Item {
//   ID_categoria: number;
//   descripcion: string;
//   // Otras propiedades del item si las hay
// }


// const Lista = () => {
  

 
//   const [items, setItems] =  useState<Item[]>([]); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);




  
  
//   new DataTable('#example');
//   useEffect(() => {   
    
//       // Inicializar DataTables cuando el componente se haya montado
//       // new DataTable('#example',{
//       //   "columnDefs": [
//       //               { "type": "num", "targets": 0 } // Configura la primera columna para ordenación numérica
//       //           ]
//       // });

  
//     axios.get('http://localhost:3300/categorias')
//         .then(response => {
//           setItems(response.data);
//           setLoading(false);
//         })
//         .catch(error => {
//           setError(error);
//           setLoading(false);
//         });
        
//     },[]);

//     if (loading) {
//       return <p>Cargando...</p>;
//     }
  
//     if (error) {
//       return <p>Error: {error}</p>;
//     }  

//   return (

//     <div>
//         <table className="table table-flush" id="example">
//               <thead className="thead-light">
//                 <tr>
//                   <th >Id</th>
//                   <th>Categoría</th>
//                   <th>Controles</th>        
//                 </tr>
//               </thead>
             
//               <tbody>
//                {items.map(item => (
//                 <tr key={item.ID_categoria}>
//                   <td >
//                     <div className="d-flex align-items-center">
//                       <div className="form-check">
//                         <input className="form-check-input" type="checkbox" id="customCheck1" />
//                       </div>
//                       <p className=" font-weight-bold ms-2  mb-0">{item.ID_categoria}</p>
//                     </div>
//                   </td>
                  
//                   <td className="font-weight-bold">
//                     <span className="my-2 ">{item.descripcion}</span>
//                   </td>
//                   <td className="text-xs font-weight-bold">
//                     <div className="d-flex align-items-center">
//                       <button className="btn btn-icon-only btn-rounded btn-outline-success mb-0 me-2 btn-sm d-flex align-items-center justify-content-center">
//                         <i className="fas fa-check" aria-hidden="true"></i>
//                       </button>
//                       <span>Paid</span>
//                     </div>
//                   </td>
//                 </tr>
//             ))} 
//               </tbody>
//             </table>
          
//             {/* <div>
//               <button className="export" data-type="csv">Export CSV</button>
//               <button className="export" data-type="excel">Export Excel</button>
//             </div>    */}
//     </div>
    
//   );

   
// };

// export default Lista;
