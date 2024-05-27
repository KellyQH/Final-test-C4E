document.addEventListener('DOMContentLoaded', function() {
    const imagesRandom = document.querySelectorAll('.img-random');
    const imagesFixed = document.querySelectorAll('.img-fixed');
    const spinButton = document.querySelector('.btn-fixedA');
    const resetButton = document.querySelector('.btn-fixedB');
    let totalBets = 0;
    const imgRandom = [
        { index: 0, name: 'bau', images: './images/bau.png' },
        { index: 1, name: 'cua', images: './images/cua.png' },
        { index: 2, name: 'tom', images: './images/tom.png' },
        { index: 3, name: 'ca', images: './images/ca.png' },
        { index: 4, name: 'huou', images: './images/huou.png' },
        { index: 5, name: 'ga', images: './images/ga.png' }
    ];

// Random ngẫu nhiên hình ảnh mỗi ô với tần suất 100 lần/ô, sau khi kết thúc, ảnh hiển thị sẽ là kết quả cuối cùng của lượt quay 
    let intervals = [];

    spinButton.addEventListener('click', function() {
        disableFunction();
        shuffleImagesRandom();
    });

    function shuffleImagesRandom() {
        imagesRandom.forEach((img, index) => {
            let count = 0;
            intervals[index] = setInterval(() => {
                count++;
                const randomImage = imgRandom[Math.floor(Math.random() * imgRandom.length)];
                img.src = randomImage.images;
                if (count >= 100) {
                    clearInterval(intervals[index]);
                    if (index === imagesRandom.length - 1) {
                        compareResults();
                    }
                    //Sau khi quay xong, các nút hoạt động bình thường
                    spinButton.disabled = false;
                    resetButton.disabled = false;
                    enableImagesFixed();
                    enableHover();
                }
            }, 50);
        });
    }
    

//Khi đang trong quá trình Quay, các nút Quay, Đặt lại hay bấm vào Hình để cược điểm đều không được hoạt động
    function disableFunction() {
        spinButton.disabled = true;
        resetButton.disabled = true;
        disableImagesFixed();
        disableHover();
    }

    function disableImagesFixed() {
        imagesFixed.forEach(image => {
            image.classList.add('disabled');
        });
    }

    function enableImagesFixed() {
        imagesFixed.forEach(image => {
            image.classList.remove('disabled');
        });
    }
    
    function disableHover() {
        const style = document.createElement('style');
        style.innerHTML = '.hver:hover { transform: none; }';
        document.head.appendChild(style);
    }
    
    function enableHover() {
        const style = document.querySelector('style');
        if (style) {
            style.parentNode.removeChild(style);
        }
    }

    imagesFixed.forEach(function(image) {
        image.addEventListener('click', function() {
            handleImageClick(image);
        });
    });

// Tăng số điểm đặt cược của Hình đã bấm
    function handleImageClick(clickedImage) {
        if (totalBets >= 3 || parseInt(clickedImage.dataset.bets) >= 3) {
            return; // tổng điểm cược tất cả các hình tối đa là 3, nếu đã đủ 3, sẽ không thể đặt cược thêm
        }
        let bets = parseInt(clickedImage.dataset.bets) + 1;
        clickedImage.dataset.bets = bets;
        clickedImage.nextElementSibling.textContent = bets;
        totalBets++;
    }

// Bấm nút Đặt lại sẽ reset tất cả các Điểm cược và ảnh ngẫu nhiên
    resetButton.addEventListener('click', function() {
        
        // Reset bets
        imagesFixed.forEach(function(image) {
            image.dataset.bets = 0;
            image.nextElementSibling.textContent = '0';
        });
        totalBets = 0;

        // Reset random images
        imagesRandom.forEach(function(image) {
            image.src = './images/bau.png';
            delete image.dataset.name;
        });
        document.getElementById('resultMessage').textContent = '';
    });

// Thực hiện so sánh kết quả của người chơi cược và kết quả quay, nếu người chơi đoán sai, thì in ra màn hình
    function compareResults() {
        const selectedBets = {};
        imagesFixed.forEach(image => {
            const name = image.dataset.name;
            const bets = parseInt(image.dataset.bets);
            if (bets > 0) {
                selectedBets[name] = bets;
            }
        });

        const resultCount = {};
        imagesRandom.forEach(image => {
            const name = image.dataset.name;
            resultCount[name] = (resultCount[name] || 0) + 1;
        });

        let correct = true;
        for (let name in selectedBets) {
            if (selectedBets[name] !== resultCount[name]) {
                correct = false;
                break;
            }
        }

        displayResult(selectedBets, correct);
    }

    function displayResult(selectedBets, correct) {
        const resultMessage = document.getElementById('resultMessage');
        const resultText = Object.entries(selectedBets).map(([name, count]) => `${count} ${name}`).join(', ');
        if (correct) {
            alert(`Bạn đã đoán đúng với lựa chọn: ${resultText}`);
        } else {
            alert(`Bạn đã đoán sai với lựa chọn: ${resultText}`);
        }
    }
});
