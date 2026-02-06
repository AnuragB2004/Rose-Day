import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const containerRef = useRef(null);
  const [stage, setStage] = useState(0); // 0: intro, 1: letter, 2: question, 3: accepted
  const [typedText, setTypedText] = useState('');
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [heartClicks, setHeartClicks] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b9d, 2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff4757, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create rose petals
    const petals = [];
    const petalGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    petalGeometry.scale(1, 0.3, 0.5);

    const petalColors = [0xff6b9d, 0xff4757, 0xe84393, 0xfd79a8, 0xf8b500];

    for (let i = 0; i < 100; i++) {
      const petalMaterial = new THREE.MeshPhongMaterial({
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });

      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      petal.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      );
      petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      petal.userData = {
        speed: 0.005 + Math.random() * 0.01,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      };
      scene.add(petal);
      petals.push(petal);
    }

    // Create 3D hearts
    const hearts = [];
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.2, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    for (let i = 0; i < 15; i++) {
      const heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4757,
        shininess: 150,
        transparent: true,
        opacity: 0.8,
      });

      const heart = new THREE.Mesh(heartGeometry, heartMaterial);
      heart.scale.set(0.3, 0.3, 0.3);
      heart.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      );
      heart.rotation.set(0, 0, Math.PI);
      heart.userData = {
        floatSpeed: 0.3 + Math.random() * 0.3,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: 0.01 + Math.random() * 0.01,
      };
      scene.add(heart);
      hearts.push(heart);
    }

    // Create sparkle particles
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = 200;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleSizes = new Float32Array(sparkleCount);

    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 25;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      sparkleSizes[i] = Math.random() * 3 + 1;
    }

    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sparkleSizes, 1));

    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);

    camera.position.z = 8;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Animate petals
      petals.forEach((petal) => {
        petal.rotation.x += petal.userData.rotationSpeed.x;
        petal.rotation.y += petal.userData.rotationSpeed.y;
        petal.rotation.z += petal.userData.rotationSpeed.z;
        petal.position.y -= petal.userData.speed;
        petal.position.x += Math.sin(time * petal.userData.floatSpeed + petal.userData.floatOffset) * 0.01;

        if (petal.position.y < -10) {
          petal.position.y = 10;
          petal.position.x = (Math.random() - 0.5) * 20;
        }
      });

      // Animate hearts
      hearts.forEach((heart) => {
        heart.position.y += Math.sin(time * heart.userData.floatSpeed + heart.userData.floatOffset) * 0.005;
        heart.rotation.y += heart.userData.rotationSpeed;
      });

      // Animate sparkles
      sparkles.rotation.y += 0.001;
      const positions = sparkleGeometry.attributes.position.array;
      for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] -= 0.02;
        if (positions[i * 3 + 1] < -12) {
          positions[i * 3 + 1] = 12;
        }
      }
      sparkleGeometry.attributes.position.needsUpdate = true;

      // Camera follows mouse slightly
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Show first stage after delay
    setTimeout(() => setStage(1), 2000);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Love letter text for typing effect
  const loveLetterText = "My dearest love, from the moment I met you, my world became more colorful. Your smile lights up my darkest days, and your love gives me strength I never knew I had. Every moment with you is a treasure I hold close to my heart...";

  // Typing effect for love letter
  useEffect(() => {
    if (stage === 1 && typedText.length < loveLetterText.length) {
      const timeout = setTimeout(() => {
        setTypedText(loveLetterText.slice(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [stage, typedText]);

  // Handle "No" button dodge
  const handleNoHover = () => {
    const maxX = 200;
    const maxY = 100;
    setNoButtonPos({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2
    });
    setNoAttempts(prev => prev + 1);
  };

  // Add floating heart on click
  const addFloatingHeart = (e) => {
    const newHeart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      emoji: ['❤️', '💕', '💖', '💗', '🌹', '✨'][Math.floor(Math.random() * 6)]
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  // Handle heart clicks for secret message
  const handleHeartClick = () => {
    setHeartClicks(prev => prev + 1);
    if (heartClicks >= 4) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 3000);
    }
  };

  const handleYes = () => {
    setStage(3);
  };

  const noMessages = [
    "Are you sure? 🥺",
    "Please reconsider... 💔",
    "My heart is breaking... 😢",
    "I won't give up! 💪",
    "You can't escape my love! 💕",
    "The button is shy! 🙈"
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a0a0f] via-[#2d1f2d] to-[#1a0a0f]">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="fixed inset-0 z-0" />

      {/* Gradient Overlays */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,157,0.1),transparent_70%)]" />
      </div>

      {/* Click to add hearts */}
      <div className="fixed inset-0 z-15" onClick={addFloatingHeart} />

      {/* Floating hearts from clicks */}
      {floatingHearts.map(heart => (
        <motion.div
          key={heart.id}
          className="fixed z-50 text-3xl pointer-events-none"
          initial={{ x: heart.x, y: heart.y, scale: 0, opacity: 1 }}
          animate={{ y: heart.y - 150, scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {heart.emoji}
        </motion.div>
      ))}

      {/* Secret message */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 backdrop-blur-lg rounded-2xl p-8 border border-rose-500/50"
          >
            <p className="text-rose-300 text-center text-xl">🤫 Secret: I love you more than all the roses in the world! 🌹</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        
        {/* Stage 0: Intro Animation */}
        <AnimatePresence>
          {stage === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🌹
              </motion.div>
              <p className="text-rose-300 text-xl animate-pulse">Something special is loading for you...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 1: Love Letter */}
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-400/30 mb-8"
              >
                <span className="text-2xl">💌</span>
                <span className="text-rose-300 font-light tracking-[0.2em] text-sm uppercase">A Letter For You</span>
                <span className="text-2xl">💌</span>
              </motion.div>

              {/* Love Letter Card */}
              <motion.div
                className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 backdrop-blur-lg rounded-3xl p-8 border border-rose-400/20 shadow-2xl mb-8"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-rose-100/90 text-lg md:text-xl font-light leading-relaxed italic text-left">
                  "{typedText}"
                  <span className="animate-pulse">|</span>
                </p>
              </motion.div>

              {typedText.length >= loveLetterText.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={() => setStage(2)}
                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-full"
                  >
                    <span className="flex items-center gap-2">
                      Continue <span className="text-xl">→</span>
                    </span>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2: The Question */}
        <AnimatePresence>
          {stage === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center max-w-2xl"
            >
              {/* Rose Day Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-400/30 mb-8"
              >
                <span className="text-2xl">🌹</span>
                <span className="text-rose-300 font-light tracking-[0.2em] text-sm uppercase">Happy Rose Day</span>
                <span className="text-2xl">🌹</span>
              </motion.div>

              {/* Interactive Heart - Click 5 times for secret */}
              <motion.div
                onClick={handleHeartClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer mb-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl"
                >
                  💖
                </motion.div>
                <p className="text-rose-400/50 text-xs mt-2">(tap me!)</p>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
              >
                My Dearest
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-red-400">
                  Babbe
                </span>
              </motion.h1>

              {/* The Question */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mb-10"
              >
                <motion.p 
                  className="text-3xl md:text-5xl text-white font-serif italic mb-4"
                  animate={{ textShadow: ["0 0 10px #ff6b9d", "0 0 30px #ff6b9d", "0 0 10px #ff6b9d"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Will you be mine?
                </motion.p>
                <p className="text-rose-300/60 text-sm tracking-widest uppercase">
                  Forever & Always
                </p>
              </motion.div>

              {/* Yes/No Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 relative"
              >
                <Button
                  onClick={handleYes}
                  className="group relative px-12 py-6 text-lg font-medium bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-full shadow-2xl shadow-rose-500/30 transition-all duration-500 hover:scale-110 hover:shadow-rose-500/50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Heart className="w-5 h-5 fill-current animate-pulse" />
                    Yes, I'm Yours!
                    <Heart className="w-5 h-5 fill-current animate-pulse" />
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                </Button>

                {/* Dodging No Button */}
                <motion.div
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    onMouseEnter={handleNoHover}
                    onTouchStart={handleNoHover}
                    variant="outline"
                    className="px-8 py-6 text-lg text-rose-300 border-rose-500/30 hover:bg-rose-500/10 rounded-full"
                  >
                    No 😢
                  </Button>
                </motion.div>
              </motion.div>

              {/* No attempts message */}
              {noAttempts > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 mt-6 text-sm"
                >
                  {noMessages[Math.min(noAttempts - 1, noMessages.length - 1)]}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 3: Accepted - Celebration */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              {/* Confetti explosion */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 600,
                    scale: [0, 1.5, 1],
                    rotate: Math.random() * 720
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                >
                  {['🌹', '💕', '💖', '✨', '🎉', '💗', '❤️', '🥰'][i % 8]}
                </motion.div>
              ))}

              {/* Celebration Hearts */}
              <motion.div
                className="flex justify-center gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 0, scale: 0 }}
                    animate={{ 
                      y: [0, -30, 0],
                      opacity: 1,
                      scale: 1
                    }}
                    transition={{
                      y: { repeat: Infinity, duration: 2, delay: i * 0.15 },
                      opacity: { duration: 0.5, delay: i * 0.1 },
                      scale: { duration: 0.5, delay: i * 0.1 }
                    }}
                  >
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="text-8xl md:text-9xl mb-8"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block"
                >
                  💕
                </motion.span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl md:text-6xl font-serif text-white mb-6"
              >
                <motion.span
                  animate={{ color: ["#fff", "#ff6b9d", "#fff"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  You Said YES!
                </motion.span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-red-400 mt-2">
                  I'm The Happiest!
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="max-w-md mx-auto"
              >
                <motion.p 
                  className="text-xl text-rose-200/80 font-light leading-relaxed mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  I promise to love you, cherish you, and shower you with roses 
                  every single day for the rest of our lives. 
                </motion.p>
                
                <motion.div 
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/90 font-light">Our love story begins now</span>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </motion.div>

                {/* Romantic promises */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-10 space-y-3"
                >
                  {["To love you endlessly 💕", "To make you smile daily 😊", "To be your forever 🌹"].map((promise, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.2 + i * 0.3 }}
                      className="text-rose-300/70 text-sm"
                    >
                      {promise}
                    </motion.p>
                  ))}
                </motion.div>

                {/* Interactive kiss button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                  className="mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const emojis = ['💋', '😘', '🥰', '💕'];
                      for (let i = 0; i < 10; i++) {
                        setTimeout(() => {
                          const heart = {
                            id: Date.now() + i,
                            x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                            y: window.innerHeight / 2,
                            emoji: emojis[Math.floor(Math.random() * emojis.length)]
                          };
                          setFloatingHearts(prev => [...prev, heart]);
                          setTimeout(() => {
                            setFloatingHearts(prev => prev.filter(h => h.id !== heart.id));
                          }, 2000);
                        }, i * 100);
                      }
                    }}
                    className="text-6xl hover:drop-shadow-[0_0_30px_rgba(255,107,157,0.8)] transition-all"
                  >
                    💋
                  </motion.button>
                  <p className="text-rose-400/50 text-xs mt-2">Send a kiss!</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Rose Emoji Decorations */}
      <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
              rotate: 0,
              opacity: 0.6
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              rotate: 360,
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>
    </div>
  );
}