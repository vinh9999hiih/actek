let isSending = false;
let stopSending = false;
let sentCount = 0;
let totalCount = 0;

document.getElementById('startButton').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('message').value.trim();
    const count = parseInt(document.getElementById('count').value, 10);

    // Kiểm tra đầu vào
    if (!username || !message || isNaN(count) || count <= 0) {
        alert('Vui lòng điền đầy đủ thông tin và số lượng hợp lệ.');
        return;
    }

    // Khởi tạo lại trạng thái
    isSending = true;
    stopSending = false;
    sentCount = 0;
    totalCount = count;

    // Cập nhật giao diện
    document.getElementById('sentCount').textContent = sentCount;
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('resultList').innerHTML = '';
    document.getElementById('statusMessage').textContent = 'Đang gửi tin nhắn...';
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

    // Gửi tin nhắn
    for (let i = 0; i < totalCount; i++) {
        if (stopSending) break;

        try {
            const response = await fetch('https://ngl.link/api/submit', {
                method: 'POST',
                headers: {
                    'Host': 'ngl.link',
                    'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                    'accept': '*/*',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest',
                    'sec-ch-ua-mobile': '?0',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                    'sec-ch-ua-platform': '"Windows"',
                    'origin': 'https://ngl.link',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': `https://ngl.link/${username}`,
                    'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                body: new URLSearchParams({
                    'username': username,
                    'question': message,
                    'deviceId': '0',
                    'gameSlug': '',
                    'referrer': '',
                }),
            });

            if (response.ok) {
                sentCount++;
                document.getElementById('sentCount').textContent = sentCount;
                const li = document.createElement('li');
                li.textContent = `[+] Gửi thành công! Số lần đã gửi: ${sentCount}`;
                document.getElementById('resultList').appendChild(li);
            } else {
                const li = document.createElement('li');
                li.textContent = `[X] Lỗi: ${response.status} - ${response.statusText}`;
                document.getElementById('resultList').appendChild(li);
            }
        } catch (error) {
            const li = document.createElement('li');
            li.textContent = `[X] Lỗi kết nối: ${error.message}`;
            document.getElementById('resultList').appendChild(li);
        }

        // Chờ 1 giây trước khi gửi tin nhắn tiếp theo
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Kết thúc quá trình
    isSending = false;
    document.getElementById('statusMessage').textContent = stopSending ? 'Đã dừng.' : 'Hoàn thành!';
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
});

document.getElementById('stopButton').addEventListener('click', () => {
    stopSending = true;
    document.getElementById('statusMessage').textContent = 'Đang dừng...';
});
