import React, { useState, useEffect, useRef } from 'react';
import { Heart, Stars, Mail, Music, Camera, ChevronRight, Gift, Sparkles, Smile, Frown, Lock } from 'lucide-react';

export default function App() {
  const [scene, setScene] = useState(0); 
  const [photoIndex, setPhotoIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [confetti, setConfetti] = useState([]);
  const [fireworks, setFireworks] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState([]);

  // --- কন্টেন্ট এবং ডাটা ---
  const memories = [
    { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000", caption: "প্রথম যেদিন তোমায় দেখি..." },
    { url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000", caption: "তোমার ওই মায়াবী হাসি..." },
    { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000", caption: "আমাদের সুন্দর মুহূর্তগুলো..." }
  ];

  const letterText = `প্রিয় স্মৃতি,\n\nএই ছোট্ট ওয়েবসাইটটা শুধু তোমার জন্য। জানি এটা খুব সামান্য, কিন্তু আমার ভালোবাসা এর চেয়েও অনেক বিশাল।\n\nতোমাকে ছাড়া আমার পৃথিবীটা একদম শূন্য। তুমি আছো বলেই সবকিছু এত সুন্দর লাগে।\n\nসারা জীবন এভাবেই আমার পাশে থেকো।\n\nইতি,\nতোমার পাগল প্রেমিক।`;

  // --- ইফেক্টস ---

  // মাউস ট্র্যাকিং এবং ক্লিক রিপল
  useEffect(() => {
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    const handleClick = (e) => {
      const newClick = { x: e.clientX, y: e.clientY, id: Date.now() };
      setClicks(prev => [...prev, newClick]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== newClick.id)), 1000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // টাইপরাইটার ইফেক্ট (চিঠির জন্য)
  useEffect(() => {
    if (scene === 3) {
      let i = 0;
      setTypedMessage("");
      const interval = setInterval(() => {
        setTypedMessage(letterText.slice(0, i + 1));
        i++;
        if (i > letterText.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [scene]);

  // ফায়ারওয়ার্কস এবং কনফেটি (শেষের জন্য)
  useEffect(() => {
    if (scene === 6) {
      const pieces = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        color: ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#ee82ee'][Math.floor(Math.random() * 7)],
        delay: Math.random() * 2 + 's',
        duration: Math.random() * 3 + 2 + 's'
      }));
      setConfetti(pieces);

      const fwInterval = setInterval(() => {
        const id = Date.now();
        setFireworks(prev => [...prev, { id, x: Math.random() * 80 + 10, y: Math.random() * 60 + 10, color: '#ffeb3b' }]);
        setTimeout(() => setFireworks(prev => prev.filter(f => f.id !== id)), 1500);
      }, 800);
      return () => clearInterval(fwInterval);
    }
  }, [scene]);

  // "না" বাটন পালানোর লজিক
  const moveNoButton = () => {
    const limit = 150;
    setNoBtnPos({
      x: (Math.random() - 0.5) * limit * 2,
      y: (Math.random() - 0.5) * limit * 2
    });
  };

  // --- ৩ডি কার্ড কম্পোনেন্ট ---
  const ParallaxCard = ({ children, className = "" }) => {
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setRotate({ x: -y / 15, y: x / 15 });
    };

    const handleLeave = () => setRotate({ x: 0, y: 0 });

    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMove} 
        onMouseLeave={handleLeave}
        style={{ transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
        className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      >
        {children}
      </div>
    );
  };

  // --- দৃশ্য (Scenes) ---

  // ব্যাকগ্রাউন্ড
  const Background = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 animate-gradient-shift opacity-80"></div>
      
      {/* ভাসমান কণা */}
      {[...Array(25)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white opacity-20 animate-float"
             style={{
               width: Math.random() * 5 + 2 + 'px',
               height: Math.random() * 5 + 2 + 'px',
               left: Math.random() * 100 + '%',
               top: Math.random() * 100 + '%',
               animationDuration: Math.random() * 15 + 10 + 's',
               animationDelay: Math.random() * 5 + 's',
             }} />
      ))}
      
      {/* ক্লিক ইফেক্ট */}
      {clicks.map(c => (
        <div key={c.id} className="absolute border-2 border-pink-300 rounded-full animate-ripple opacity-0"
             style={{ left: c.x, top: c.y, width: '10px', height: '10px' }}></div>
      ))}
    </div>
  );

  // ১. শুরু (Intro)
  const Intro = () => (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-1000 z-10 text-center relative px-4">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-pink-500 rounded-full filter blur-[100px] opacity-40 animate-pulse"></div>
      
      <div onClick={() => setScene(1)} className="relative group cursor-pointer">
        <div className="absolute -inset-8 bg-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-80 animate-pulse transition-opacity duration-500"></div>
        <ParallaxCard className="w-48 h-48 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/40 shadow-[0_0_50px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform">
          <Heart className="text-pink-200 w-24 h-24 animate-heartbeat drop-shadow-lg" fill="currentColor" />
        </ParallaxCard>
      </div>
      
      <div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-purple-200 animate-shimmer bg-[length:200%_auto] pb-2">
          স্বাগতম
        </h1>
        <p className="text-pink-200 mt-4 text-sm tracking-[0.2em] font-medium border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm animate-bounce-slow">
          শুরু করতে হৃদয়ে স্পর্শ করো
        </p>
      </div>
    </div>
  );

  // ২. গ্যালারি (Gallery)
  const Gallery = () => (
    <ParallaxCard className="w-full max-w-sm mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-right duration-700 z-10 relative">
      <div className="flex justify-between items-center mb-6 text-white relative z-10">
        <div className="flex items-center gap-2 bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30">
          <Camera size={16} /> <span className="text-sm font-bold">স্মৃতিমালা</span>
        </div>
        <div className="text-xs opacity-80 font-mono bg-black/20 px-2 py-1 rounded">{photoIndex + 1} / {memories.length}</div>
      </div>
      
      <div className="relative aspect-[4/5] bg-black/40 rounded-2xl overflow-hidden mb-6 group shadow-inner border border-white/10">
        <img 
          src={memories[photoIndex].url} 
          alt="Memory" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
          <p className="text-white text-lg font-medium drop-shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            {memories[photoIndex].caption}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => {
            if (photoIndex < memories.length - 1) setPhotoIndex(p => p + 1);
            else setScene(2);
          }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-pink-500/50"
        >
          <span className="font-semibold">
            {photoIndex === memories.length - 1 ? 'একটা চিঠি...' : 'পরের ছবি'}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </ParallaxCard>
  );

  // ৩. এনভেলপ (Envelope)
  const Envelope = () => (
    <div className="perspective-1000 z-10 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
      <div className="absolute -z-10 bg-pink-500/30 w-64 h-64 rounded-full blur-[80px] animate-pulse"></div>
      
      <div 
        onClick={() => setScene(3)}
        className="relative w-80 h-52 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 group flex items-center justify-center transform-style-3d border border-pink-400/50"
      >
        {/* খামের ঢাকনা */}
        <div className="absolute top-0 w-full h-full z-40 origin-top transition-all duration-700 group-hover:rotate-x-180 transform-style-3d">
             <div className="absolute top-0 w-full h-1/2 bg-pink-700 rounded-t-lg shadow-lg" style={{clipPath: 'polygon(0 0, 50% 100%, 100% 0)'}}></div>
        </div>

        {/* খামের শরীর */}
        <div className="absolute top-0 w-full h-full rounded-lg overflow-hidden pointer-events-none">
             <div className="absolute bottom-0 w-full h-1/2 bg-pink-700 z-20" style={{clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'}}></div>
             <div className="absolute bottom-0 w-full h-full bg-pink-600 z-30 opacity-90" style={{clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)'}}></div>
        </div>

        {/* ভিতরের চিঠি */}
        <div className="absolute top-4 w-72 h-40 bg-white rounded shadow-lg z-0 transition-all duration-1000 group-hover:-translate-y-28 group-hover:z-50 p-4 flex flex-col items-center justify-center">
             <Heart className="text-pink-500 w-6 h-6 mb-2 animate-bounce" fill="currentColor"/>
             <div className="w-full space-y-2 opacity-50">
                <div className="h-1.5 bg-gray-300 rounded w-2/3 mx-auto"></div>
                <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                <div className="h-1.5 bg-gray-300 rounded w-3/4 mx-auto"></div>
             </div>
        </div>
        
        <div className="z-50 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-bold tracking-widest border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse">
          খুলেই দেখো
        </div>
      </div>
    </div>
  );

  // ৪. চিঠি পড়া (Letter)
  const Letter = () => (
    <ParallaxCard className="w-full max-w-lg mx-4 bg-[#fff1f2] p-8 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] relative z-10 rotate-1 animate-in slide-in-from-bottom duration-1000 border-[6px] border-white/40">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-200/90 text-yellow-800 px-4 py-1 rotate-2 shadow-sm font-bold text-xs tracking-wider uppercase rounded-sm">গোপন বার্তা</div>
      <Sparkles className="text-yellow-400 absolute -top-5 -right-5 w-10 h-10 animate-spin-slow" />
      
      <div className="font-serif text-gray-800 leading-8 whitespace-pre-wrap text-lg min-h-[200px] relative z-10 p-2">
        {typedMessage}
        <span className="animate-blink text-pink-500 font-bold ml-1">|</span>
      </div>

      <button 
        onClick={() => setScene(4)}
        className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-pink-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
      >
        সামনে চলো ❤️
      </button>
    </ParallaxCard>
  );

  // ৫. রিভিল (Reveal)
  const Reveal = () => (
    <div className="text-center z-10 animate-in zoom-in duration-1000 relative w-full px-4">
      {/* ব্যাকগ্রাউন্ড গ্লো */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-pink-500/30 to-transparent blur-3xl animate-pulse"></div>
      
      <div className="relative inline-block mb-8">
        <Heart className="mx-auto text-red-500 w-40 h-40 animate-heartbeat drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]" fill="currentColor" />
        <div className="absolute inset-0 flex items-center justify-center">
           <Stars className="text-white w-16 h-16 animate-spin-slow opacity-90" />
        </div>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300 drop-shadow-2xl font-sans tracking-tight animate-shimmer bg-[length:200%_auto]">
        I Love You
      </h1>
      <h2 className="text-5xl md:text-6xl font-cursive text-yellow-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mt-4 font-bold transform -rotate-3">
        Srity
      </h2>

      <div className="mt-12 animate-bounce">
        <button 
          onClick={() => setScene(5)}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/40 px-8 py-3 rounded-full backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] font-semibold tracking-wide"
        >
          একটা প্রশ্ন ছিল... 👇
        </button>
      </div>
    </div>
  );

  // ৬. প্রশ্ন (Question)
  const Question = () => (
    <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center z-10 mx-4 border-[6px] border-pink-100 animate-in slide-in-from-bottom duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-pink-500 to-purple-500"></div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-3 drop-shadow-sm">একটা সত্যি কথা বলো...</h2>
      <p className="text-xl text-pink-600 mb-10 font-semibold">তুমি কি আমাকে ভালোবাসো? 🥺</p>

      <div className="flex flex-col items-center justify-center gap-5 h-48 relative">
        <button
          onClick={() => setScene(6)}
          className="relative w-72 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-4 rounded-xl shadow-xl transform transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-3 text-xl group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Heart fill="white" size={24} className="group-hover:animate-beat" /> 
          হ্যাঁ, অনেক বাসি!
        </button>

        <button
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          style={{ transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`, transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          className="flex items-center gap-2 bg-gray-200 text-gray-500 font-bold py-3 px-8 rounded-xl text-sm shadow-inner cursor-not-allowed hover:bg-red-100 hover:text-red-400 transition-colors"
        >
          <Frown size={16} /> না, বাসি না 
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 font-mono">('না' বাটনটা ধরার চেষ্টা করো তো! 😜)</p>
    </div>
  );

  // ৭. সেলিব্রেশন (Celebration)
  const Celebration = () => (
    <div className="text-center z-20 animate-in zoom-in duration-700 px-4 w-full max-w-2xl">
      {/* ফায়ারওয়ার্কস */}
      {fireworks.map(fw => (
         <div key={fw.id} className="absolute w-2 h-2 rounded-full animate-firework" 
              style={{ left: `${fw.x}%`, top: `${fw.y}%`, backgroundColor: fw.color, boxShadow: `0 0 20px ${fw.color}` }}>
         </div>
      ))}

      <ParallaxCard className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/30 shadow-[0_0_60px_rgba(255,255,255,0.2)]">
        <div className="flex justify-center -space-x-4 mb-6 relative">
           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center animate-bounce shadow-lg border-4 border-white z-10"><Smile size={32} className="text-white"/></div>
           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center animate-bounce shadow-lg border-4 border-white delay-100"><Heart fill="white" size={32} className="text-white"/></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white mb-4 drop-shadow-lg animate-shimmer bg-[length:200%_auto]">
          Love You Too! 💖
        </h1>
        <p className="text-pink-100 text-lg mb-8 leading-relaxed font-light">
          ধন্যবাদ আমার জীবনে আসার জন্য।<br/>
          সারাটা জীবন এভাবেই <span className="font-bold text-white bg-pink-500/30 px-2 py-0.5 rounded">একসাথে</span> কাটাবো।
        </p>

        {/* মিউজিক প্লেয়ার স্টাইল */}
        <div className="bg-black/40 rounded-2xl p-4 flex items-center gap-4 border border-white/20 shadow-inner max-w-md mx-auto transform transition-transform hover:scale-105">
           <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center animate-spin-slow shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 rounded-full m-1"></div>
              <Music className="text-white relative z-10" size={20} />
           </div>
           <div className="text-left flex-1 min-w-0">
              <p className="text-white text-base font-bold truncate">Forever Yours.mp3</p>
              <p className="text-white/60 text-xs mb-2">My Heart ft. Srity</p>
              
              {/* মিউজিক বার অ্যানিমেশন */}
              <div className="flex items-end gap-1 h-5">
                 {[...Array(15)].map((_, i) => (
                    <div key={i} className="w-1 bg-green-400 rounded-t-full animate-music-bar" 
                         style={{ 
                             height: '100%', 
                             animationDelay: `${i * 0.1}s`,
                             animationDuration: `${0.5 + Math.random()}s`
                         }}>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </ParallaxCard>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans select-none cursor-default bg-slate-900">
      <Background />
      
      {/* কনফেটি কন্টেইনার */}
      {scene === 6 && (
        <div className="fixed inset-0 pointer-events-none z-50">
           {confetti.map((c) => (
             <div key={c.id} className="absolute w-3 h-5 rounded-sm animate-fall" style={{
               backgroundColor: c.color, left: c.left, top: '-20px',
               animationDelay: c.delay, animationDuration: c.duration
             }} />
           ))}
        </div>
      )}

      {/* বর্তমান দৃশ্য */}
      <div className="w-full flex justify-center perspective-1000">
        {scene === 0 && <Intro />}
        {scene === 1 && <Gallery />}
        {scene === 2 && <Envelope />}
        {scene === 3 && <Letter />}
        {scene === 4 && <Reveal />}
        {scene === 5 && <Question />}
        {scene === 6 && <Celebration />}
      </div>

      {/* সিএসএস স্টাইলস */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&display=swap');
        
        body { font-family: 'Hind Siliguri', sans-serif; }
        
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.1); } 40% { transform: scale(1); } 60% { transform: scale(1.15); } }
        .animate-heartbeat { animation: heartbeat 1.5s infinite; }
        
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; } }
        .animate-float { animation: float linear infinite; }
        
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        
        @keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        .animate-fall { animation: fall linear infinite; }
        
        @keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
        .animate-ripple { animation: ripple 0.6s linear forwards; }
        
        @keyframes music-bar { 0%, 100% { height: 20%; } 50% { height: 100%; } }
        .animate-music-bar { animation: music-bar ease-in-out infinite; }
        
        @keyframes blink { 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-x-180 { transform: rotateX(180deg); }

        @keyframes firework { 
          0% { transform: scale(0); opacity: 1; } 
          50% { transform: scale(1); opacity: 1; } 
          100% { transform: scale(1.5); opacity: 0; } 
        }
        .animate-firework { animation: firework 1s ease-out forwards; }
        
        .animate-bounce-slow { animation: bounce 2s infinite; }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
