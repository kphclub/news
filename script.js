document.addEventListener('DOMContentLoaded', function () {
  fetchNews();
  setupFilters();
});

// Global variable to store all news items
let allNewsItems = [];

// Function to fetch news from the API
async function fetchNews() {
  try {
    const response = await fetch(
      'https://kph-mafia.microcompany.workers.dev/api/links'
    );
    const data = await response.json();

    if (data && data.links) {
      allNewsItems = data.links; // Store all items
      displayNews(allNewsItems);
    } else {
      showError('No data found');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    showError('Failed to load news data');
  }
}

// Function to ensure URL has a protocol
function ensureHttps(url) {
  if (!url) return '#';

  // Check if URL already has a protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Add https:// if not present
  return 'https://' + url;
}

// Function to display news items
function displayNews(links) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '';

  if (links.length === 0) {
    newsContainer.innerHTML =
      '<div class="no-results">No items match your filter</div>';
    return;
  }

  links.forEach((item, index) => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    newsItem.dataset.type = item.type; // Add data attribute for filtering

    // Format date
    const date = new Date(item.created_at);
    const formattedDate = `${date.toLocaleString('default', {
      month: 'short',
    })} ${date.getDate()}, ${date.getFullYear()}`;

    // Ensure the link has https://
    const secureLink = ensureHttps(item.link);

    // Create link domain display
    let domain = '';
    try {
      const url = new URL(secureLink);
      domain = url.hostname.replace('www.', '');
    } catch (e) {
      domain = 'unknown';
    }

    newsItem.innerHTML = `
            <div>
                <a href="${secureLink}" class="news-title" target="_blank">${item.name}</a>
                <a href="${secureLink}" class="domain" target="_blank">(${domain})</a>
                <span class="news-type ${item.type}">${item.type}</span>
            </div>
            <div class="news-info">
                <span>by <a href="#">${item.memberName}</a></span>
                <span>on ${formattedDate}</span>
            </div>
        `;

    newsContainer.appendChild(newsItem);
  });
}

// Function to show error messages
function showError(message) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Function to set up category filters
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      // Filter the news items
      if (filterValue === 'all') {
        displayNews(allNewsItems);
      } else {
        const filteredItems = allNewsItems.filter(
          (item) => item.type === filterValue
        );
        displayNews(filteredItems);
      }
    });
  });
}
