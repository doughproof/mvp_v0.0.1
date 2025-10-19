// Application data
const dashboardData = {
  kpis: {
    on_time_ship_rate: 51.6,
    on_time_delivery_rate: 66.5,
    order_accuracy: 95.2,
    avg_transit_days: 3.9,
    cost_per_shipment: 56.05,
    cost_per_lb: 0.84
  },
  trend_data: [
    { date: "2025-06-11", on_time_delivery_rate: 90.0, avg_transit_days: 1.0, total_cost: 278.03, shipment_count: 10 },
    { date: "2025-06-12", on_time_delivery_rate: 65.0, avg_transit_days: 4.55, total_cost: 1100.97, shipment_count: 20 },
    { date: "2025-06-13", on_time_delivery_rate: 52.6, avg_transit_days: 4.2, total_cost: 4736.48, shipment_count: 38 },
    { date: "2025-06-14", on_time_delivery_rate: 74.3, avg_transit_days: 3.8, total_cost: 3200.15, shipment_count: 28 },
    { date: "2025-06-15", on_time_delivery_rate: 68.9, avg_transit_days: 4.1, total_cost: 2850.22, shipment_count: 25 }
  ],
  carrier_stats: [
    { carrier: "FedEx", cost_per_shipment: 56.05, cost_per_lb: 0.84, on_time_rate: 66.5, avg_transit: 3.9 },
    { carrier: "USPS", cost_per_shipment: 9.17, cost_per_lb: 1.88, on_time_rate: 55.1, avg_transit: 4.2 },
    { carrier: "UPS", cost_per_shipment: 7.35, cost_per_lb: 2.76, on_time_rate: 78.3, avg_transit: 3.1 }
  ],
  alerts: [
    { type: "Late Risk", count: 41, severity: "high", message: "41 shipments at risk of late delivery" },
    { type: "DIM Mismatch", count: 191, severity: "medium", message: "191 shipments with DIM variance >15%" },
    { type: "Address Issues", count: 12, severity: "medium", message: "12 shipments with address validation issues" }
  ],
  service_performance: [
    { service: "Home Delivery", volume: 1844, on_time_rate: 65.7, avg_transit: 4.3, cost_per_shipment: 58.42, cost_per_lb: 0.78 },
    { service: "FedEx 2Day", volume: 812, on_time_rate: 72.1, avg_transit: 2.1, cost_per_shipment: 75.33, cost_per_lb: 1.15 },
    { service: "FedEx Ground", volume: 456, on_time_rate: 59.8, avg_transit: 4.8, cost_per_shipment: 45.67, cost_per_lb: 0.65 },
    { service: "FedEx Standard Overnight", volume: 298, on_time_rate: 88.2, avg_transit: 1.2, cost_per_shipment: 125.44, cost_per_lb: 2.34 },
    { service: "FedEx Priority Overnight", volume: 187, on_time_rate: 91.4, avg_transit: 1.0, cost_per_shipment: 148.92, cost_per_lb: 2.78 }
  ]
};

// Chart instances
let trendChart = null;
let carrierChart = null;

// Initialize dashboard when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  initializeKPIs();
  initializeCharts();
  initializeTable();
  initializeAlerts();
  initializeEventListeners();
});

// Initialize KPI cards
function initializeKPIs() {
  const kpis = dashboardData.kpis;
  
  document.getElementById('onTimeShipRate').textContent = `${kpis.on_time_ship_rate}%`;
  document.getElementById('onTimeDeliveryRate').textContent = `${kpis.on_time_delivery_rate}%`;
  document.getElementById('orderAccuracy').textContent = `${kpis.order_accuracy}%`;
  document.getElementById('avgTransitDays').textContent = kpis.avg_transit_days.toString();
  document.getElementById('costPerShipment').textContent = `$${kpis.cost_per_shipment}`;
  document.getElementById('costPerLb').textContent = `$${kpis.cost_per_lb}`;
}

// Initialize charts
function initializeCharts() {
  initializeTrendChart();
  initializeCarrierChart();
}

// Initialize trend chart
function initializeTrendChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  const trendData = dashboardData.trend_data;
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'On-Time Delivery Rate',
        data: trendData.map(d => d.on_time_delivery_rate),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1FB8CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(19, 52, 59, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#1FB8CD',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `On-Time Rate: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            color: '#626c7c'
          }
        },
        y: {
          beginAtZero: false,
          min: 40,
          max: 100,
          grid: {
            color: 'rgba(98, 108, 124, 0.1)'
          },
          border: {
            display: false
          },
          ticks: {
            color: '#626c7c',
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// Initialize carrier chart
function initializeCarrierChart() {
  const ctx = document.getElementById('carrierChart').getContext('2d');
  const carrierData = dashboardData.carrier_stats;
  
  carrierChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: carrierData.map(d => d.carrier),
      datasets: [{
        label: 'Cost per Shipment',
        data: carrierData.map(d => d.cost_per_shipment),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(19, 52, 59, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#1FB8CD',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Cost: $${context.parsed.y}`;
            },
            afterLabel: function(context) {
              const carrier = carrierData[context.dataIndex];
              return [`On-Time Rate: ${carrier.on_time_rate}%`, `Avg Transit: ${carrier.avg_transit} days`];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            color: '#626c7c'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(98, 108, 124, 0.1)'
          },
          border: {
            display: false
          },
          ticks: {
            color: '#626c7c',
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

// Initialize service performance table
function initializeTable() {
  const tableBody = document.getElementById('serviceTableBody');
  const serviceData = dashboardData.service_performance;
  
  tableBody.innerHTML = '';
  
  serviceData.forEach(service => {
    const row = document.createElement('tr');
    
    const getOnTimeRateClass = (rate) => {
      if (rate >= 80) return 'metric-good';
      if (rate >= 60) return 'metric-neutral';
      return 'metric-poor';
    };
    
    row.innerHTML = `
      <td><strong>${service.service}</strong></td>
      <td>${service.volume.toLocaleString()}</td>
      <td><span class="${getOnTimeRateClass(service.on_time_rate)}">${service.on_time_rate}%</span></td>
      <td>${service.avg_transit} days</td>
      <td>$${service.cost_per_shipment}</td>
      <td>$${service.cost_per_lb}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Initialize alerts panel
function initializeAlerts() {
  const alertsContainer = document.getElementById('alertsContainer');
  const alertsData = dashboardData.alerts;
  
  alertsContainer.innerHTML = '';
  
  alertsData.forEach(alert => {
    const alertCard = document.createElement('div');
    alertCard.className = `alert-card severity-${alert.severity}`;
    
    alertCard.innerHTML = `
      <div class="alert-header">
        <span class="alert-type">${alert.type}</span>
        <span class="alert-count severity-${alert.severity}">${alert.count}</span>
      </div>
      <div class="alert-message">${alert.message}</div>
    `;
    
    alertsContainer.appendChild(alertCard);
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Date range selector
  document.getElementById('dateRange').addEventListener('change', function(e) {
    console.log('Date range changed to:', e.target.value);
    // In a real app, this would filter the data
    updateDashboard();
  });
  
  // Filter controls
  const filterElements = ['carrierFilter', 'serviceFilter', 'zoneFilter', 'startDate', 'endDate'];
  filterElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', function() {
        console.log(`Filter changed: ${id} = ${this.value}`);
        applyFilters();
      });
    }
  });
  
  // Clear filters button
  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
  
  // Refresh alerts button
  document.getElementById('refreshAlerts').addEventListener('click', function() {
    this.style.transform = 'rotate(360deg)';
    this.style.transition = 'transform 0.5s ease';
    setTimeout(() => {
      this.style.transform = 'rotate(0deg)';
      this.style.transition = '';
    }, 500);
    
    // Simulate refreshing alerts
    setTimeout(() => {
      initializeAlerts();
    }, 500);
  });
  
  // Export and details buttons
  document.querySelector('.export-btn').addEventListener('click', function() {
    alert('Export functionality would be implemented here');
  });
  
  document.querySelector('.details-btn').addEventListener('click', function() {
    alert('Details view would open here');
  });
  
  // Table sorting
  const sortableHeaders = document.querySelectorAll('.sortable');
  sortableHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const sortKey = this.dataset.sort;
      sortTable(sortKey);
    });
  });
}

// Apply filters to dashboard data
function applyFilters() {
  console.log('Applying filters...');
  
  // Get current filter values
  const filters = {
    carrier: document.getElementById('carrierFilter').value,
    service: document.getElementById('serviceFilter').value,
    zone: document.getElementById('zoneFilter').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value
  };
  
  // In a real application, this would filter the actual data
  // For now, we'll just provide visual feedback
  updateDashboard();
  
  // Show loading state briefly
  showLoadingState();
}

// Clear all filters
function clearAllFilters() {
  document.getElementById('carrierFilter').value = 'all';
  document.getElementById('serviceFilter').value = 'all';
  document.getElementById('zoneFilter').value = 'all';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  
  applyFilters();
}

// Sort table by column
function sortTable(sortKey) {
  console.log('Sorting table by:', sortKey);
  
  const serviceData = [...dashboardData.service_performance];
  
  // Simple sort implementation
  serviceData.sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    
    // Handle string vs number comparison
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal - aVal; // Descending order for numbers
    }
  });
  
  // Update table with sorted data
  const tableBody = document.getElementById('serviceTableBody');
  tableBody.innerHTML = '';
  
  serviceData.forEach(service => {
    const row = document.createElement('tr');
    
    const getOnTimeRateClass = (rate) => {
      if (rate >= 80) return 'metric-good';
      if (rate >= 60) return 'metric-neutral';
      return 'metric-poor';
    };
    
    row.innerHTML = `
      <td><strong>${service.service}</strong></td>
      <td>${service.volume.toLocaleString()}</td>
      <td><span class="${getOnTimeRateClass(service.on_time_rate)}">${service.on_time_rate}%</span></td>
      <td>${service.avg_transit} days</td>
      <td>$${service.cost_per_shipment}</td>
      <td>$${service.cost_per_lb}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Update dashboard with current filters
function updateDashboard() {
  // In a real app, this would re-fetch and update all data
  // For demo purposes, we'll just refresh the components
  console.log('Dashboard updated with current filters');
}

// Show loading state
function showLoadingState() {
  const mainContent = document.querySelector('.main-content');
  mainContent.style.opacity = '0.7';
  
  setTimeout(() => {
    mainContent.style.opacity = '1';
  }, 300);
}

// Utility function to format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

// Utility function to format percentage
function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

// Utility function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}