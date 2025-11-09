// dashboard/public/js/charts.js
class DashboardCharts {
  static init() {
    this.initLeaderboardChart();
    this.initActivityChart();
    this.initRetentionChart();
  }

  static initLeaderboardChart() {
    const ctx = document.getElementById('leaderboardChart');
    if (!ctx) return;

    // Mock data — real version would fetch from /api/stats/leaderboard
    const data = {
      labels: ['User1', 'User2', 'User3', 'User4', 'User5'],
      datasets: [{
        label: 'XP',
        data: [1200, 980, 850, 720, 600],
        backgroundColor: '#5865f2'
      }]
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#4f545c' } }
        }
      }
    });
  }

  static initActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Messages',
        data: [120, 190, 150, 210, 180, 90, 75],
        borderColor: '#5865f2',
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(88, 101, 242, 0.2)'
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#4f545c' } }
        }
      }
    });
  }

  static initRetentionChart() {
    const ctx = document.getElementById('retentionChart');
    if (!ctx) return;

    const data = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Retention %',
        data: [100, 78, 65, 58],
        backgroundColor: '#43b581'
      }]
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: '#4f545c' }
          }
        }
      }
    });
  }
}

// Auto-init if charts exist
if (typeof Chart !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    DashboardCharts.init();
  });
}
