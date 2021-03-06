/* global $, swal */

const { ipcRenderer } = require('electron');
const { dialog, shell, app } = require('electron').remote;
const renderSidebar = require('./modules/sidebar');
const renderIntroduction = require('./modules/introduction');
const renderFees = require('./modules/fees');
const renderListings = require('./modules/listings');
const renderFAQ = require('./modules/faq');
const renderTutorials = require('./modules/tutorials');
const renderSupport = require('./modules/support');
const renderBlocknet = require('./modules/blocknet');



const handleError = err => {
  console.error(err);
  alert(err);
};
window.onerror = handleError;


const state = {
  _data: new Map(),
  set(key, val) {
    this._data.set(key, val);
    console.log('state', [...this._data.entries()]
      .reduce((obj, [ k, v ]) => Object.assign(obj, {[k]: v}), {})
    );
  },
  get(key) {
    return this._data.get(key);
  }
};


state.set('active', 0);
state.set('sidebarSelected', 0);
state.set('sidebarItems', [
  {text: 'Getting Started', title: 'GETTING STARTED'},
  {text: 'Fees', title: 'FEES'},
  // {text: 'Listings', title: 'LISTINGS'},
  // {text: 'FAQ', title: 'FAQ'},
  // {text: 'Tutorials', title: 'TUTORIALS'},
  // {text: 'Troubleshooting', title: 'TROUBLESHOOTING'},
  {text: 'Powered by Blocknet', title: 'BLOCKNET PROTOCOL'}
]);




$(document).ready(() => {


  const render = () => {

    const sidebarItems = state.get('sidebarItems');
    const sidebarSelected = state.get('sidebarSelected');
    const active = state.get('active');

    const sidebarHTML = renderSidebar({ state });
    let mainHTML = '';

    switch(active) {
      case 0:
        mainHTML = renderIntroduction();
        break;
      case 1:
        mainHTML = renderFees();
        break;
      // case 4:
      //   mainHTML = renderListings();
      //   break;
      // case 4:
      //   mainHTML = renderFAQ();
      //   break;
      // case 4:
      //   mainHTML = renderTutorials();
      //   break;
      // case 4:
      //   mainHTML = renderSupport();
      //   break;
      case 2:
        mainHTML = renderBlocknet();
        break;
      default:
        mainHTML = '';
    }


    const html = `
          <h3 class="title">${sidebarItems[sidebarSelected]['title']}</h3>
          <div class="container">
            <div class="flex-container">
              <div class="col1">
                ${sidebarHTML}
              </div>
              <div class="col2">
                ${mainHTML}
              </div>
            </div>
          </div>
        `;

    $('#js-main').html(html);


    setTimeout(() => {

      $('.js-sidebarItem')
        .off('click')
        .on('click', e => {
          e.preventDefault();
          var newActive = Number($(e.target).attr("data-sidebar-index"));
          state.set('active', newActive);
          state.set('sidebarSelected', newActive);
          render();
      });

      $('.blocknet-link')
        .off('click')
        .on('click', e => {
          e.preventDefault();
          var url = $(e.target).attr("data-link");
          shell.openExternal(url);
        });

    }, 0);
  };


  (async function() {
    try {
      render();
    } catch(err) {
      handleError(err);
    }
  })();
});
