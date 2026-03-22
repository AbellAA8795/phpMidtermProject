const wheel = document.getElementById('wheel');
        const resultDiv = document.getElementById('result');
        let isSpinning = false;

        function initializeWheel() {
            for (let i = 1; i <= 30; i++) {
                const angle = (i - 1) * 12; // 12 degrees per number
                const radians = (angle - 90) * Math.PI / 180;
                
                const radius = 150; // Further toward center/left
                const x = 200 + radius * Math.cos(radians);
                const y = 200 + radius * Math.sin(radians);
                
                const number = document.createElement('div');
                number.textContent = i;
                number.style.position = 'absolute';
                number.style.left = x + 'px';
                number.style.top = y + 'px';
                number.style.width = '35px';
                number.style.height = '35px';
                number.style.marginLeft = '-17.5px';
                number.style.marginTop = '-17.5px';
                number.style.display = 'flex';
                number.style.alignItems = 'center';
                number.style.justifyContent = 'center';
                number.style.fontSize = '16px';
                number.style.fontWeight = 'bold';
                number.style.color = 'white';
                number.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.9)';
                
                wheel.appendChild(number);
            }
        }

        initializeWheel();
        wheel.addEventListener('click', spinRoulette);

        function spinRoulette() {
            if (isSpinning) return;
            
            isSpinning = true;
            resultDiv.textContent = '';

            const winningNumber = Math.floor(Math.random() * 30) + 1;
            const rotationsNeeded = winningNumber === 1 ? 0 : (30 - winningNumber + 1);
            const segmentAngle = 12; // 360 / 30
            const totalRotation = 5 * 360 + rotationsNeeded * segmentAngle;

            wheel.classList.add('spinning');

            setTimeout(() => {
                wheel.classList.remove('spinning');
                wheel.style.transform = `rotate(${totalRotation}deg)`;
                
                isSpinning = false;
                resultDiv.textContent = `You landed on: ${winningNumber}`;
            }, 3000);
        }