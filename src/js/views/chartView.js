import Chart from 'chart.js/auto';

class ChartView {
    _charts = {};

    renderCharts(historyData) {
        this._renderSingleChart('chart-rapid', historyData.rapid, '#779556');
        this._renderSingleChart('chart-blitz', historyData.blitz, '#d35400');
        this._renderSingleChart('chart-bullet', historyData.bullet, '#f1c40f');
    }

    updateSingleChart(canvasId, dataArr) {
        if (!this._charts[canvasId] || !dataArr) return;

        const labels = dataArr.map(item => item.date);
        const ratings = dataArr.map(item => item.rating);

        this._charts[canvasId].data.labels = labels;
        this._charts[canvasId].data.datasets[0].data = ratings;
        
        this._charts[canvasId].update();
    }

    _renderSingleChart(canvasId, dataArr, color) {
        const canvas = document.getElementById(canvasId);
        
        if (!canvas || !dataArr) return; 

        if (this._charts[canvasId]) {
            this._charts[canvasId].destroy();
        }
        
        const labels = dataArr.map(item => item.date);
        const ratings = dataArr.map(item => item.rating);

        this._charts[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Rating',
                    data: ratings,
                    borderColor: color,
                    backgroundColor: color,
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: { display: false },
                    y: { 
                        display: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
                    }
                }
            }
        });
    }
}

export default new ChartView();