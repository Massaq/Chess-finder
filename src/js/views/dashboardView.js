import View from './View.js';

class DashboardView extends View {
    _parentElement = document.querySelector('.dashboard');
    _errorMessage = 'We could not find player info. Please try another one!';
    _message = '';

    addHandlerRender(handler) {
      ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    }

    addHandlerChangeTime(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn-time');
            if (!btn) return; 

            const controls = btn.closest('.chart-controls');
            
            controls.querySelectorAll('.btn-time').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const time = btn.dataset.time; 
            const mode = controls.dataset.mode; 

            handler(mode, time);
        });
    }

    _generateRecordHTML(record) {
        if (!record) return '-';
        return `
            <span class="text-win">${record.win}</span>-<!--
            --><span class="text-loss">${record.loss}</span>-<!--
            --><span class="text-draw">${record.draw}</span>
        `;
    }

    _generateMarkup() {
        return `
       <div class="widget profile-widget">
            <img src="${this._data.player.avatar}" alt="Player Avatar" class="player_avatar">
            <ul class="main-stats">
                <li class="stat-row"><span class="stat-label">Name:</span> <span class="stat-item">${this._data.player.name}</span></li>
                <li class="stat-row"><span class="stat-label">Title:</span> <span class="stat-item">${this._data.player.title}</span></li>
                <li class="stat-row"><span class="stat-label">Country:</span> <span class="stat-item">${this._data.player.country}</span></li>
                <li class="stat-row"><span class="stat-label">Joined:</span> <span class="stat-item">${this._data.player.joined}</span></li>
            </ul>
        </div>

        <div class="ratings-grid">
            <div class="widget rating-widget rapid">
                <h3 class="widget-title">Rapid</h3>
                <ul>
                    <li class="stat-row"><span class="stat-label">Current:</span> <span class="stat-item">${this._data.playerStats.rapid.current}</span></li>
                    <li class="stat-row"><span class="stat-label">Best:</span> <span class="stat-item">${this._data.playerStats.rapid.best}</span></li>
                    <li class="stat-row"><span class="stat-label">W/L/D:</span> <span class="stat-item">${this._generateRecordHTML(this._data.playerStats.rapid.record)}</span></li>
                </ul>
                
                <div class="chart-controls" data-mode="rapid">
                    <button class="btn-time active" data-time="1">1M</button>
                    <button class="btn-time" data-time="3">3M</button>
                    <button class="btn-time" data-time="12">1Y</button>
                    <button class="btn-time" data-time="all">All</button>
                </div>
                <div class="mini-canvas-container">
                    <canvas id="chart-rapid"></canvas>
                </div>
            </div>
            
            <div class="widget rating-widget blitz">
                <h3 class="widget-title">Blitz</h3>
                <ul>
                    <li class="stat-row"><span class="stat-label">Current:</span> <span class="stat-item">${this._data.playerStats.blitz.current}</span></li>
                    <li class="stat-row"><span class="stat-label">Best:</span> <span class="stat-item">${this._data.playerStats.blitz.best}</span></li>
                    <li class="stat-row"><span class="stat-label">W/L/D:</span> <span class="stat-item">${this._generateRecordHTML(this._data.playerStats.blitz.record)}</span></li>
                </ul>
                
                <div class="chart-controls" data-mode="blitz">
                    <button class="btn-time active" data-time="1">1M</button>
                    <button class="btn-time" data-time="3">3M</button>
                    <button class="btn-time" data-time="12">1Y</button>
                    <button class="btn-time" data-time="all">All</button>
                </div>
                <div class="mini-canvas-container">
                    <canvas id="chart-blitz"></canvas>
                </div>
            </div>

            <div class="widget rating-widget bullet">
                <h3 class="widget-title">Bullet</h3>
                <ul>
                    <li class="stat-row"><span class="stat-label">Current:</span> <span class="stat-item">${this._data.playerStats.bullet.current}</span></li>
                    <li class="stat-row"><span class="stat-label">Best:</span> <span class="stat-item">${this._data.playerStats.bullet.best}</span></li>
                    <li class="stat-row"><span class="stat-label">W/L/D:</span> <span class="stat-item">${this._generateRecordHTML(this._data.playerStats.bullet.record)}</span></li>
                </ul>
                
                <div class="chart-controls" data-mode="bullet">
                    <button class="btn-time active" data-time="1">1M</button>
                    <button class="btn-time" data-time="3">3M</button>
                    <button class="btn-time" data-time="12">1Y</button>
                    <button class="btn-time" data-time="all">All</button>
                </div>
                <div class="mini-canvas-container">
                    <canvas id="chart-bullet"></canvas>
                </div>
            </div>
        </div>
    `;
    }
}

export default new DashboardView();