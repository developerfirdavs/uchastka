(function() {
  'use strict';

  var SHEET_URL = '';
  var statusMap = {
    'свободный': 'available',
    'продается': 'available',
    'бронь': 'reserved',
    'продан': 'sold'
  };

  var statusTextMap = {
    'свободный': 'Продается',
    'продается': 'Продается',
    'бронь': 'Бронь',
    'продан': 'Продан'
  };

  var filters = {
    available: true,
    reserved: true,
    sold: true
  };

  function initMap(sheetUrl) {
    SHEET_URL = sheetUrl;
    var mapImage = document.getElementById('map-image');
    var loadingDiv = document.querySelector('.loading');

    setupFilters();
    loadData(loadingDiv, mapImage);
  }

  function setupFilters() {
    var availableBtn = document.getElementById('filter-available');
    var reservedBtn = document.getElementById('filter-reserved');
    var soldBtn = document.getElementById('filter-sold');

    if (availableBtn) {
      availableBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        filters.available = !filters.available;
        updatePointsVisibility();
      });
    }

    if (reservedBtn) {
      reservedBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        filters.reserved = !filters.reserved;
        updatePointsVisibility();
      });
    }

    if (soldBtn) {
      soldBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        filters.sold = !filters.sold;
        updatePointsVisibility();
      });
    }
  }

  function loadData(loadingDiv, mapImage) {
    fetch(SHEET_URL)
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(function(csvData) {
        var houses = parseCSV(csvData);
        loadingDiv.style.display = 'none';
        mapImage.style.display = 'block';
        addHousesToMap(houses);
        window.addEventListener('resize', function() {
          addHousesToMap(houses);
        });
      })
      .catch(function(err) {
        console.error('Ошибка загрузки:', err);
        loadingDiv.textContent = 'Ошибка загрузки данных. Пожалуйста, попробуйте позже.';
      });
  }

  function parseCSV(csv) {
    var lines = csv.split('\n').filter(function(line) {
      return line.trim() !== '';
    });
    if (lines.length === 0) return [];

    var headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(function(line) {
      var values = parseCSVLine(line);
      var house = {};
      headers.forEach(function(header, i) {
        house[header] = values[i] || '';
      });

      if (house['Координаты точки']) {
        var coords = house['Координаты точки'].split(',').map(function(c) {
          return parseFloat(c.trim());
        });
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          house.xPercent = coords[0];
          house.yPercent = coords[1];
        } else {
          house.xPercent = 0;
          house.yPercent = 0;
        }
      } else {
        house.xPercent = 0;
        house.yPercent = 0;
      }
      return house;
    }).filter(function(house) {
      return house.xPercent && house.yPercent;
    });
  }

  function parseCSVLine(line) {
    var result = [];
    var inQuotes = false;
    var currentField = '';

    for (var i = 0; i < line.length; i++) {
      var char = line[i];
      var nextChar = line[i + 1] || '';

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField);
    return result;
  }

  function addHousesToMap(houses) {
    var mapWrapper = document.querySelector('.map-wrapper');
    document.querySelectorAll('.point, .tooltip').forEach(function(el) {
      el.remove();
    });

    var mapImage = document.getElementById('map-image');
    var imgWidth = mapImage.clientWidth || mapImage.naturalWidth;
    var imgHeight = mapImage.clientHeight || mapImage.naturalHeight;
    if (imgWidth === 0) imgWidth = 1000;
    if (imgHeight === 0) imgHeight = 800;

    houses.forEach(function(house) {
      var xPos = (house.xPercent / 100) * imgWidth;
      var yPos = (house.yPercent / 100) * imgHeight;

      var status = getStatusClass(house['Статус']);
      var statusText = getStatusText(house['Статус']);

      var point = document.createElement('div');
      point.className = 'point status-' + status;
      point.style.left = xPos + 'px';
      point.style.top = yPos + 'px';
      point.dataset.status = status;

      var tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML =
        '<h3>' + (house['Название'] || 'Без названия') + '</h3>' +
        '<p><span class="status status-' + status + '-text">' + statusText + '</span></p>' +
        (house['Цена'] ? '<p class="price">Цена: ' + house['Цена'] + '</p>' : '') +
        (house['Описание'] ? '<p>' + house['Описание'] + '</p>' : '');

      point.addEventListener('mouseenter', function() {
        tooltip.style.display = 'block';
        var leftPos = xPos + 20;
        var topPos = yPos;
        tooltip.style.left = leftPos + 'px';
        tooltip.style.top = topPos + 'px';
        var tooltipRect = tooltip.getBoundingClientRect();
        var wrapperRect = mapWrapper.getBoundingClientRect();
        if (tooltipRect.right > wrapperRect.right) {
          tooltip.style.left = (xPos - tooltipRect.width - 20) + 'px';
        }
        if (tooltipRect.bottom > wrapperRect.bottom) {
          tooltip.style.top = (yPos - tooltipRect.height) + 'px';
        }
      });

      point.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
      });

      mapWrapper.appendChild(point);
      mapWrapper.appendChild(tooltip);
    });

    updatePointsVisibility();
  }

  function updatePointsVisibility() {
    document.querySelectorAll('.point').forEach(function(point) {
      var status = point.dataset.status;
      var shouldShow =
        (status === 'available' && filters.available) ||
        (status === 'reserved' && filters.reserved) ||
        (status === 'sold' && filters.sold);
      point.style.display = shouldShow ? 'block' : 'none';
    });
  }

  function getStatusClass(status) {
    if (!status) return 'available';
    return statusMap[status.toLowerCase()] || 'available';
  }

  function getStatusText(status) {
    if (!status) return 'Продается';
    return statusTextMap[status.toLowerCase()] || status;
  }

  window.MapLoader = {
    init: initMap
  };

})();
