import * as model from './model.js';
import dashboardView from './views/dashboardView.js';
import searchView from './views/searchView.js';
import chartView from './views/chartView.js';


const controlDashboard = async function () {
    try {
        
        const query = searchView.getQuery();
        if (!query) return;

        dashboardView.renderSpinner();

        await model.loadSearchQuery(query);
        dashboardView.render(model.state);

        chartView.renderCharts(model.state.playerEloHistory);
    } catch (err) {
        dashboardView.renderError();
    }
}

const controlTimeChange = async function (mode, time) {
    try {
        const username = model.state.player.username;
        if (!username) return;

        const activeBtn = document.querySelector(`.chart-controls[data-mode="${mode}"] .btn-time.active`);
        const originalText = activeBtn ? activeBtn.textContent : '';
        if (activeBtn) activeBtn.textContent = '...'; 

        await model.getPlayerEloHistory(username, time);
        

        if (activeBtn) activeBtn.textContent = originalText;

        let filteredData = model.getFilteredHistory(mode, time);
        
      
        const MAX_POINTS = 300;
        if (filteredData.length > MAX_POINTS) {
            const step = Math.ceil(filteredData.length / MAX_POINTS);
            filteredData = filteredData.filter((_, index) => index % step === 0);
        }
        
        chartView.updateSingleChart(`chart-${mode}`, filteredData);
        
    } catch (err) {
        console.error(err);
    }
};

const init = function () {
    searchView.addHandlerSearch(controlDashboard);
    dashboardView.addHandlerChangeTime(controlTimeChange);
}

init();
