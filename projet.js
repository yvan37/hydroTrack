$(document).ready(function()
 {
    const GOAL_ML = 2000;
    let today = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('hydrationHistory')) || {};

    // Initialiser Chart.js
    const ctx = $('#hydrationChart')[0].getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getLast7Days(),
            datasets: [{
                label: 'Consommation (ml)',
                data: getHistoryData(),
                backgroundColor: '#2196F3'
            }]
        }
    });

    function updateProgress() {
        const current = history[today] || 0;
        const percent = Math.min((current / GOAL_ML) * 100, 100);
        const dashoffset = 339 - (339 * percent / 100);
        
        $('.progress-circle').css('stroke-dashoffset', dashoffset);
        $('.progress-text').text(`${Math.round(percent)}%`);
    }

    // Ajouter une consommation
    $('.btn-glass, #add-custom').click(function() {
        const ml = $(this).data('ml') || parseInt($('#custom-ml').val()) || 0;
        if(ml <= 0) return;
        
        history[today] = (history[today] || 0) + ml;
        localStorage.setItem('hydrationHistory', JSON.stringify(history));
        
        updateProgress();
        animateGlass($(this));
        chart.update();
    });

    // Animation fluide
    function animateGlass(element) {
        element.css('transform', 'scale(0.95)');
        setTimeout(() => element.css('transform', 'scale(1)'), 200);
    }

    // Fonctions utilitaires
    function getLast7Days() {
        return [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
    }

    function getHistoryData() {
        return getLast7Days().map(date => history[date] || 0);
    }

    updateProgress();
});
