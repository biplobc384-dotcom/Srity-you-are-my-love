<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>স্মৃতিমালা - বিশেষ উপহার</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        body { font-family: 'Hind Siliguri', sans-serif; overflow: hidden; background-color: #020617; }
        .bg-animate {
            background: linear-gradient(-45deg, #1e1b4b, #450a0a, #4c0519, #020617);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* পাঁপড়ি ও ইফেক্টস */
        .petal { position: absolute; background-color: #ff4d6d; border-radius: 150% 0 150% 0; opacity: 0.7; pointer-events: none; z-index: 5; animation: fall-rotate linear infinite; }
        @keyframes fall-rotate { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        
        .scene { display: none; transition: all 0.5s ease; }
        .scene.active { display: flex; animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        .glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); }
        
        /* এনভেলপ স্টাইল */
        .envelope-wrapper { position: relative; cursor: pointer; transform-style: preserve-3d; transition: transform 0.5s; }
        .envelope-wrapper:hover { transform: scale(1.05); }
        .envelope { position: relative; width: 280px; height: 180px; background: #be123c; border-radius: 0 0 8px 8px; }
        .envelope:before { content: ""; position: absolute; top: 0; left: 0; border-left: 140px solid transparent; border-right: 140px solid transparent; border-top: 100px solid #fb7185; z-index: 30; transform-origin: top; transition: transform 0.5s; }
        .envelope-wrapper.open .envelope:before { transform: rotateX(180deg); }
        .letter-small { position: absolute; top: 10px; left: 10px; width: 260px; height: 160px; background: white; z-index: 10; transition: transform 0.5s; }
        .envelope-wrapper.open .letter-small { transform: translateY(-100px); z-index: 40; }

        .bar { width: 3px; background: #fb7185; animation: bounce 0.5s ease-in-out infinite alternate; }
        @keyframes bounce { from { height: 5px; } to { height: 20px; } }
    </style>
</head>
<body class="text-white bg-animate">

    <audio id="bg-music" loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
    </audio>

    <div id="petals-container" class="fixed inset-0 pointer-events-none z-5"></div>

    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <div class="glass-card px-6 py-2 rounded-full border border-white/20">
            <p class="text-[10px] uppercase tracking-widest text-pink-300">আমরা একসাথে আছি</p>
            <p id="relationship-timer" class="text-lg font-bold">০ দিন ০ ঘণ্টা ০ মিনিট</p>
        </div>
    </div>

    <main class="relative z-10 min-h-screen flex items-center justify-center p-4">
        
        <div id="scene-0" class="scene active flex-col items-center space-y-8">
            <div onclick="startJourney()" class="cursor-pointer group">
                <div class="w-56 h-56 glass-card rounded-full flex items-center justify-center border-2 border-pink-500/50 hover:scale-105 transition-all">
                    <i data-lucide="heart" class="text-pink-500 w-28 h-28 animate-pulse fill-current"></i>
                </div>
            </div>
            <h1 class="text-5xl font-bold tracking-tight">হ্যালো স্মৃতি ❤️</h1>
        </div>

        <div id="scene-1" class="scene flex-col items-center w-full max-w-sm">
            <div class="glass-card rounded-[2.5rem] p-6 shadow-2xl w-full">
                <div class="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6">
                    <img id="gallery-img" src="" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-6">
                        <p id="gallery-caption" class="text-lg font-medium"></p>
                    </div>
                </div>
                <button onclick="nextPhoto()" class="w-full bg-pink-600 py-4 rounded-2xl font-bold">পরবর্তী স্মৃতি</button>
            </div>
        </div>

        <div id="scene-2" class="scene flex-col items-center space-y-8">
            <div id="env-wrapper" class="envelope-wrapper" onclick="openEnvelope()">
                <div class="envelope"></div>
                <div class="letter-small shadow-xl flex items-center justify-center">
                    <i data-lucide="mail" class="text-pink-600"></i>
                </div>
            </div>
            <p class="text-pink-200 animate-bounce">চিঠিটি খোলো...</p>
        </div>

        <div id="scene-3" class="scene flex-col items-center w-full max-w-lg">
             <div class="glass-card p-10 rounded-3xl shadow-2xl">
                <p id="typed-text" class="font-serif leading-relaxed text-xl text-pink-50 min-h-[150px] whitespace-pre-wrap"></p>
                <button onclick="nextScene(4)" class="mt-8 px-8 py-3 bg-white text-pink-900 rounded-full font-bold">সামনে চলো ❤️</button>
             </div>
        </div>

        <div id="scene-4" class="scene flex-col items-center w-full max-w-md glass-card p-12 rounded-[3rem] text-center border-pink-500/30">
            <h2 class="text-3xl font-bold mb-2">একটা প্রশ্ন...</h2>
            <p class="text-pink-200 mb-12">তুমি কি আমাকে ভালোবাসো? 🥺</p>
            <div class="relative w-full h-40">
                <button onclick="nextScene(5)" class="w-full bg-white text-rose-600 font-black py-5 rounded-2xl shadow-xl hover:scale-105 transition-all z-20 relative">হ্যাঁ, অনেক বাসি! ✨</button>
                <button id="no-btn" onmouseover="moveNoButton()" class="absolute left-0 right-0 mx-auto w-32 bg-gray-800/50 text-gray-400 py-2 rounded-lg text-sm transition-all duration-100">উঁহু!</button>
            </div>
        </div>

        <div id="scene-5" class="scene flex-col items-center text-center">
            <div class="glass-card p-12 rounded-[3rem]">
                <h1 class="text-6xl font-black mb-4 tracking-tighter">LOVE YOU TOO!</h1>
                <p class="text-pink-100 text-lg mb-8">সারাটা জীবন এভাবেই একসাথে কাটাবো।</p>
                <div class="bg-black/40 p-5 rounded-2xl flex items-center gap-4 border border-white/10">
                    <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center animate-spin">
                        <i data-lucide="music"></i>
                    </div>
                    <div class="text-left flex-1">
                        <p class="font-bold text-sm">Forever Yours</p>
                        <div class="flex items-center gap-1 h-3 mt-1">
                            <div class="bar"></div><div class="bar" style="animation-delay:0.2s"></div>
                            <div class="bar" style="animation-delay:0.4s"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <script>
        const audio = document.getElementById('bg-music');
        const startDate = new Date("2023-01-01T00:00:00"); 
        const memories = [
            { url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", caption: "প্রথম দেখার সেই স্মৃতি..." },
            { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", caption: "তোমার ওই মায়াবী হাসি..." }
        ];
        const letterText = "প্রিয় স্মৃতি,\n\nএই ছোট্ট সারপ্রাইজটা শুধু তোমার জন্য। জানি এটা খুব সামান্য, কিন্তু আমার ভালোবাসা অনেক বিশাল।\n\nতোমাকে ছাড়া আমার পৃথিবীটা একদম শূন্য। সারা জীবন এভাবেই আমার পাশে থেকো।";

        let photoIdx = 0;

        function startJourney() {
            audio.play().catch(e => console.log("Audio play deferred"));
            nextScene(1);
        }

        function updateTimer() {
            const diff = new Date() - startDate;
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff / 3600000) % 24);
            const minutes = Math.floor((diff / 60000) % 60);
            document.getElementById('relationship-timer').innerText = `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট`;
        }
        setInterval(updateTimer, 1000);
        updateTimer();

        function nextScene(index) {
            document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
            document.getElementById(`scene-${index}`).classList.add('active');
            if(index === 1) updatePhoto();
            if(index === 3) typeLetter();
            lucide.createIcons();
        }

        function updatePhoto() {
            document.getElementById('gallery-img').src = memories[photoIdx].url;
            document.getElementById('gallery-caption').innerText = memories[photoIdx].caption;
        }

        function nextPhoto() {
            if(photoIdx < memories.length - 1) { photoIdx++; updatePhoto(); } 
            else { nextScene(2); }
        }

        function openEnvelope() {
            document.getElementById('env-wrapper').classList.add('open');
            setTimeout(() => nextScene(3), 1000);
        }

        function typeLetter() {
            const target = document.getElementById('typed-text');
            let i = 0; target.innerHTML = "";
            const interval = setInterval(() => {
                target.textContent += letterText[i];
                i++; if(i >= letterText.length) clearInterval(interval);
            }, 40);
        }

        function moveNoButton() {
            const btn = document.getElementById('no-btn');
            btn.style.left = Math.random() * 70 + '%';
            btn.style.top = Math.random() * 70 + '%';
            btn.style.position = 'absolute';
        }

        // পাঁপড়ি জেনারেটর
        function createPetal() {
            const container = document.getElementById('petals-container');
            const petal = document.createElement('div');
            petal.className = 'petal';
            const size = Math.random() * 15 + 10 + 'px';
            petal.style.width = petal.style.height = size;
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.animationDuration = Math.random() * 5 + 5 + 's';
            container.appendChild(petal);
            setTimeout(() => petal.remove(), 10000);
        }
        setInterval(createPetal, 400);

        lucide.createIcons();
    </script>
</body>
</html>
