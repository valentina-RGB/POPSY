
// type Props = {}
export default function Dashboard() {
return(
<section className="mb-3 mb-lg-5 pt-5">
    <div className="row mb-3">
         {/* Widget 1  */}
          <div className="mb-4 col-sm-6 col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-normal text-red">$10,500</h4>
                    <p className="subtitle text-sm text-muted mb-0">Earnings</p>
                  </div>
                  <div className="flex-shrink-0 ms-3">
                        <svg className="svg-icon text-red">
                          {/* <use xlink:href="https://demo.bootstrapious.com/bubbly/1-3-2/icons/orion-svg-sprite.71e9f5f2.svg#speed-1"> </use> */}
                        </svg>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3 bg-red-light">
                <div className="row align-items-center text-red">
                  <div className="col-10">
                    <p className="mb-0">20% increase</p>
                  </div>
                  <div className="col-2 text-end"><i className="fas fa-caret-up"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Widget Type 1 */}
           {/* Widget Type 1 */}
          <div className="mb-4 col-sm-6 col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-normal text-blue">584</h4>
                    <p className="subtitle text-sm text-muted mb-0">Readers</p>
                  </div>
                  <div className="flex-shrink-0 ms-3">
                        <svg className="svg-icon text-blue">
                          {/* <use xlink:href="https://demo.bootstrapious.com/bubbly/1-3-2/icons/orion-svg-sprite.71e9f5f2.svg#news-1"> </use> */}
                        </svg>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3 bg-blue-light">
                <div className="row align-items-center text-blue">
                  <div className="col-10">
                    <p className="mb-0">3% increase</p>
                  </div>
                  <div className="col-2 text-end"><i className="fas fa-caret-up"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Widget Type 1 */}
           {/* Widget Type 1 */}
          <div className="mb-4 col-sm-6 col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-normal text-primary">876</h4>
                    <p className="subtitle text-sm text-muted mb-0">Bookmarks</p>
                  </div>
                  <div className="flex-shrink-0 ms-3">
                        <svg className="svg-icon text-primary">
                          {/* <use xlink:href="https://demo.bootstrapious.com/bubbly/1-3-2/icons/orion-svg-sprite.71e9f5f2.svg#bookmark-1"> </use> */}
                        </svg>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3 bg-primary-light">
                <div className="row align-items-center text-primary">
                  <div className="col-10">
                    <p className="mb-0">10% increase</p>
                  </div>
                  <div className="col-2 text-end"><i className="fas fa-caret-up"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Widget Type 1
          Widget Type 1 */}
          <div className="mb-4 col-sm-6 col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-normal text-green">3,500</h4>
                    <p className="subtitle text-sm text-muted mb-0">Visitors</p>
                  </div>
                  <div className="flex-shrink-0 ms-3">
                        <svg className="svg-icon text-green">
                          {/* <use xlink:href="https://demo.bootstrapious.com/bubbly/1-3-2/icons/orion-svg-sprite.71e9f5f2.svg#world-map-1"> </use> */}
                        </svg>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3 bg-green-light">
                <div className="row align-items-center text-green">
                  <div className="col-10">
                    <p className="mb-0">5% decrease</p>
                  </div>
                  <div className="col-2 text-end"><i className="fas fa-caret-down"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Widget Type 1 */}
    </div>
    <div className="row">
      {/* Sales */}
      <div className="col-xl-9 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-heading">Sales by channel</h5>
                <div className="card-header-more">
                  <button className="btn-header-more" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></button>
                  <div className="dropdown-menu dropdown-menu-end text-sm"><a className="dropdown-item" href="#!"><i className="fas fa-expand-arrows-alt opacity-5 me-2"></i>Expand</a><a className="dropdown-item" href="#!"><i className="far fa-window-minimize opacity-5 me-2"></i>Minimize</a><a className="dropdown-item" href="#!"><i className="fas fa-redo opacity-5 me-2"></i> Reload</a><a className="dropdown-item" href="#!"><i className="far fa-trash-alt opacity-5 me-2"></i> Remove        </a></div>
                </div>
          </div>
          <div className="card-body">
            <div className="row mb-5">
              <div className="col-12 col-sm-auto flex-sm-grow-1 py-3">
                <h3 className="subtitle text-gray-500">Total Revenue</h3>
                <div className="h1 text-primary">$19,200</div>
                <p className="mb-0"><span className="text-muted me-3">+$2,032 </span><span className="badge badge-success-light"><i className="fas fa-arrow-up me-2"></i>19.5%</span></p>
              </div>
              <div className="col-6 col-sm-auto flex-sm-grow-1 border-start py-3 d-flex align-items-center">
                <div>
                  <h3 className="subtitle text-gray-500 fw-normal">Organic Search </h3>
                  <div className="h4 fw-normal text-dark">$19,200</div>
                  <p className="mb-0"><span className="text-muted me-2">+$2,123 </span><span className="badge badge-success-light"><i className="fas fa-arrow-up me-2"></i>21.3%</span></p>
                </div>
              </div>
              <div className="col-6 col-sm-auto flex-sm-grow-1 border-start py-3 d-flex align-items-center">
                <div>
                  <h3 className="subtitle text-gray-500 fw-normal">Facebook Ads </h3>
                  <div className="h4 fw-normal text-dark">$2,500</div>
                  <p className="mb-0"><span className="text-muted me-2">-$233 </span><span className="badge badge-danger-light"><i className="fas fa-arrow-down me-2"></i>-2.1%           </span></p>
                </div>
              </div>
              <div className="col-auto d-none d-md-flex d-xl-none d-xxl-flex align-items-center">
                <div className="icon icon-xl ms-2 bg-primary-light">
                      <svg className="svg-icon text-primary">
                        {/* <use xlink:href="https://demo.bootstrapious.com/bubbly/1-3-2/icons/orion-svg-sprite.71e9f5f2.svg#pay-1"> </use> */}
                      </svg>
                </div>
              </div>
            </div>
            <canvas id="barChart"></canvas>
            <ul className="mt-4 text-gray-500 list-inline card-text text-center">
              <li className="list-inline-item"> <span className="indicator bg-primary"></span>Organic Search </li>
              <li className="list-inline-item"><span className="indicator" style={{background: '#d0d2f3'}}> </span>Facebook Ads </li>
            </ul>
          </div>
        </div>
      </div>
      {/* /Sales */}
       {/* <Latest activity> */}
      <div className="col-xl-3">
        <div className="card-adjust-height-xl">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">
              <h5 className="card-heading">Latest activity</h5>
                  <div className="card-header-more">
                    <button className="btn-header-more" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></button>
                    <div className="dropdown-menu dropdown-menu-end text-sm"><a className="dropdown-item" href="#!"><i className="fas fa-expand-arrows-alt opacity-5 me-2"></i>Expand</a><a className="dropdown-item" href="#!"><i className="far fa-window-minimize opacity-5 me-2"></i>Minimize</a><a className="dropdown-item" href="#!"><i className="fas fa-redo opacity-5 me-2"></i> Reload</a><a className="dropdown-item" href="#!"><i className="far fa-trash-alt opacity-5 me-2"></i> Remove        </a></div>
                  </div>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush list-group-timeline">
                <div className="list-group-item px-0">
                  <div className="row">
                    <div className="col-auto"><img className="avatar p-1 me-2" src="" alt="Nielsen Cobb"/></div>
                    <div className="col ms-n3 pt-2 text-sm text-gray-800"><strong className="text-dark">Nielsen Cobb </strong> subscribed to your newsletter.
                      <div className="text-gray-500 small">3m ago</div>
                    </div>
                  </div>
                </div>
                {/* list-group-item */}
                <div className="list-group-item px-0">
                  <div className="row">
                    <div className="col-auto"><img className="avatar p-1 me-2" src="" alt="Erika Whitaker"/></div>
                    <div className="col ms-n3 pt-2 text-sm text-gray-800"><strong className="text-dark">Erika Whitaker </strong> subscribed to your newsletter.
                      <div className="text-gray-500 small">11m ago</div>
                    </div>
                  </div>
                </div>
                {/* list-group-item */}
                <div className="list-group-item px-0">
                  <div className="row">
                    <div className="col-auto"><img className="avatar p-1 me-2" src="" alt="Meyers Swanson"/></div>
                    <div className="col ms-n3 pt-2 text-sm text-gray-800"><strong className="text-dark">Meyers Swanson </strong> liked your post 🎉
                      <div className="text-gray-500 small">12m ago</div>
                    </div>
                  </div>
                </div>
              {/* list-group-item */}
                <div className="list-group-item px-0">
                  <div className="row">
                    <div className="col-auto"><img className="avatar p-1 me-2" src="" alt="Townsend Sloan"/></div>
                    <div className="col ms-n3 pt-2 text-sm text-gray-800"><strong className="text-dark">Townsend Sloan </strong> placed an order.
                      <div className="text-gray-500 small">13m ago</div>
                    </div>
                  </div>
                </div>
                {/* list-group-item */}
                <div className="list-group-item px-0">
                  <div className="row">
                    <div className="col-auto"><img className="avatar p-1 me-2" src="" alt="Millicent Henry"/></div>
                    <div className="col ms-n3 pt-2 text-sm text-gray-800"><strong className="text-dark">Millicent Henry </strong>commented on &quot;How to season your new grill.&quot;
                      <div className="text-gray-500 small">14m ago</div>
                    </div>
                  </div>
                </div>
                {/* list-group-item */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </Latest activity> */}
    </div>
    <div className="row">
          {/* Widget Type 12 */}
          <div className="col-md-6 mb-4">   
            <div className="card h-100">
              <div className="card-body">
                <div className="row gx-2 gx-lg-4 gy-5">
                  <div className="col-sm-5">
                    <div className="h2">625</div>
                    <p className="subtitle">New Customers</p>
                    <div className="progress">
                      <div className="progress-bar bg-success" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} style={{width:'60%'}}></div>
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="row">
                      <div className="col-6 text-center">
                        <div className="h3">254</div>
                        <p className="text-muted fw-normal">Affiliates</p>
                        <hr/>
                        <p className="text-muted mb-0">+125</p>
                      </div>
                      <div className="col-6 text-center">
                        <div className="h3">328</div>
                        <p className="text-muted">SEM</p>
                        <hr/>
                        <p className="text-muted mb-0">+144    </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           {/* Widget Type 12 */}
           {/* Widget Type 13 */}
          <div className="col-md-6 mb-4">   
            <div className="card h-100">
              <div className="card-body d-flex align-items-center">
                <div className="row gy-5 flex-fill"> 
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-2 text-lg"><i className="fas fa-arrow-down text-danger"></i></div>
                      <div className="col-sm-10">
                        <h2>1,112</h2>
                        <h6 className="text-muted fw-normal p-b-20 p-t-10">Affiliate Sales</h6>
                        <div className="progress">
                          <div className="progress-bar bg-danger" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} style={{width:'75%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-2 text-lg"><i className="fas fa-arrow-up text-success"></i></div>
                      <div className="col-sm-10">
                        <h2>258</h2>
                        <h6 className="text-muted fw-normal p-b-20 p-t-10">Ads Sales</h6>
                        <div className="progress">
                          <div className="progress-bar bg-success" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{width:'50%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Widget Type 13 */}
    </div>
    <div className="row"> 
      {/* <Projects Widget> */}
      <div className="col-lg-4 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-heading">Project updates</h5>
                <div className="card-header-more">
                  <button className="btn-header-more" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></button>
                  <div className="dropdown-menu dropdown-menu-end text-sm"><a className="dropdown-item" href="#!"><i className="fas fa-expand-arrows-alt opacity-5 me-2"></i>Expand</a><a className="dropdown-item" href="#!"><i className="far fa-window-minimize opacity-5 me-2"></i>Minimize</a><a className="dropdown-item" href="#!"><i className="fas fa-redo opacity-5 me-2"></i> Reload</a><a className="dropdown-item" href="#!"><i className="far fa-trash-alt opacity-5 me-2"></i> Remove        </a></div>
                </div>
          </div>
          <div className="card-body">
            <div className="card-text">
              <p className="mb-2">
                <strong>Publish New Theme </strong>
                <span className="float-end text-gray-500 text-sm">10 mins ago </span></p>
              <p className="card-text">
                <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-0.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Nielsen Cobb"/>
                <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-1.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Margret Cote"/>
              </p>
              <p className="mb-2"><strong>Internal Linkbuilding </strong><span className="float-end text-gray-500 text-sm">2 hours ago </span></p>
              <p className="card-text">
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-1.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Nielsen Cobb"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-2.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Margret Cote"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-3.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Rachel Vinson"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-4.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Gabrielle Aguirre"/>
              </p>
              <p className="mb-2"><strong>New Writer Onboarding </strong><span className="float-end text-gray-500 text-sm">3 days ago </span></p>
              <p className="card-text">
                <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-2.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Nielsen Cobb"/>
                <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-3.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Margret Cote"/>
                <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-4.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Rachel Vinson"/>
              </p>
              <p className="mb-2"><strong>Blog Post Drafts </strong><span className="float-end text-gray-500 text-sm">5 days ago </span></p>
              <p className="card-text"><img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-3.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Nielsen Cobb"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-4.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Margret Cote"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-5.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Rachel Vinson"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-6.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Gabrielle Aguirre"/>
              <img className="avatar avatar-sm avatar-stacked p-1" src="https://demo.bootstrapious.com/bubbly/1-3-2/img/avatar-7.jpg" alt="User" data-bs-toggle="tooltip" data-placement="top" title="Spears Collier"/>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* </Projects Widget> */}
      <div className="col-lg-4 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-heading">Closed projects</h5>
                <div className="card-header-more">
                  <button className="btn-header-more" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></button>
                  <div className="dropdown-menu dropdown-menu-end text-sm"><a className="dropdown-item" href="#!"><i className="fas fa-expand-arrows-alt opacity-5 me-2"></i>Expand</a><a className="dropdown-item" href="#!"><i className="far fa-window-minimize opacity-5 me-2"></i>Minimize</a><a className="dropdown-item" href="#!"><i className="fas fa-redo opacity-5 me-2"></i> Reload</a><a className="dropdown-item" href="#!"><i className="far fa-trash-alt opacity-5 me-2"></i> Remove        </a></div>
                </div>
          </div>
          <div className="card-body d-flex align-items-center">
            <canvas id="donut3"></canvas>
          </div>
          <div className="card-footer bg-white">
            <h3 className="subtitle text-gray-500 fw-normal text-center">Total closed projects</h3>
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <div className="h4 mb-0">2,235</div>
              </div>
              <div className="col-auto"> <span className="text-muted me-2">+128</span><span className="badge badge-success-light"><i className="fas fa-arrow-up me-2"></i>21.3%</span></div>
            </div>
            <div className="row mt-4 card-text text-sm justify-content-center">
              <div className="col-auto"><span className="indicator" style={{background: '#0d6efd'}}> </span><span className="text-gray-500">Sandra</span>
                <div className="ms-3 h6">250</div>
              </div>
              <div className="col-auto"><span className="indicator" style={{background: '#3d8bfd'}}> </span><span className="text-gray-500">Becky</span>
                <div className="ms-3 h6">50</div>
              </div>
              <div className="col-auto"><span className="indicator" style={{background: '#6ea8fe'}}> </span><span className="text-gray-500">Julie</span>
                <div className="ms-3 h6">100</div>
              </div>
              <div className="col-auto"><span className="indicator" style={{background: '#9ec5fe'}}> </span><span className="text-gray-500">Romero</span>
                <div className="ms-3 h6">40</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-heading">Tickets solved</h5>
                <div className="card-header-more">
                  <button className="btn-header-more" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></button>
                  <div className="dropdown-menu dropdown-menu-end text-sm"><a className="dropdown-item" href="#!"><i className="fas fa-expand-arrows-alt opacity-5 me-2"></i>Expand</a><a className="dropdown-item" href="#!"><i className="far fa-window-minimize opacity-5 me-2"></i>Minimize</a><a className="dropdown-item" href="#!"><i className="fas fa-redo opacity-5 me-2"></i> Reload</a><a className="dropdown-item" href="#!"><i className="far fa-trash-alt opacity-5 me-2"></i> Remove        </a></div>
                </div>
          </div>
          <div className="card-body d-flex align-items-center">
            <canvas id="pieChartCustom3"></canvas>
          </div>
          <div className="card-footer bg-white">
            <h3 className="subtitle text-gray-500 fw-normal text-center">Tickets solved</h3>
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <div className="h4 mb-0">530</div>
              </div>
              <div className="col-auto"> <span className="text-muted me-2">-85</span><span className="badge badge-danger-light"><i className="fas fa-arrow-down me-2"></i>-15.6%</span></div>
            </div>
            <div className="row mt-4 card-text text-sm justify-content-center">
              <div className="col-auto"><span className="indicator" style={{background: '#6610f2'}}> </span><span className="text-gray-500">John</span>
                <div className="ms-3 h6">300</div>
              </div>
              <div className="col-auto"><span className="indicator" style={{background: '#8540f5'}}> </span><span className="text-gray-500">Mark</span>
                <div className="ms-3 h6">50</div>
              </div>
              <div className="col-auto"><span className="indicator" style={{background: '#a370f7'}}> </span><span className="text-gray-500">Frank</span>
                <div className="ms-3 h6">100</div>
              </div>
              <div className="col-auto"><span className="indicator" style={{background: '#c29ffa'}}> </span><span className="text-gray-500">Danny</span>
                <div className="ms-3 h6">80</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section> 
  )
}