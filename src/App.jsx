import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ─────────────────────────────────────────────────────────────────────────────
// THEME  bg: #0a0a0c  panel: #111114  card: #16161a  border: #1e1e26
// accent: #ff3d5a (GX red)  glow2: #c026d3 (magenta)  glow3: #7c3aed (violet)
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg: "#0a0a0c",
  panel: "#111114",
  card: "#16161a",
  border: "#1e1e26",
  red: "#ff3d5a",
  mag: "#d926f0",
  violet: "#7c3aed",
  cyan: "#00e5ff",
  text: "#f0f0f8",
  muted: "#9d9db8",
  dim: "#2a2a38",
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, title: "JUJUTSU KAISEN TOP-DOWN FIGHTER", category: "Multiplayer", year: "2026",
    desc: "Mutlipayer Top-Down Fighter with focus on responsive Combat mechanics, fast-paced gameplay and fluid movement.",
    stack: ["UE5", "C++", "Listen Server"], accent: "#ff3d5a",
    img: "/Portfolio/images/JJK.png",
    links: { github: "#", youtube: "https://www.youtube.com/watch?v=aYnFqYDNW9g", steam: "#" },
  },
  {
    id: 2, title: "CASTLEVANIA: DAWN OF SORROW INSPIRED LEVEL", category: "Hack & Slash", year: "2026",
    desc: "A fast-paced 3D hack-and-slash built in Unity. This project features fluid character movement, responsive combat mechanics, and a level design inspired by the gothic atmosphere and exploration-driven gameplay of the original title.",
    stack: ["Unity", "C#", "ProBuilder"], accent: "#00e5ff",
    img: "/Portfolio/images/Castlevania.png",
    links: { github: "#", youtube: "#" },
  },
  {
    id: 3, title: "BLANK AGAIN VR", category: "VR", year: "2026",
    desc: "Mystery/Puzzle solving VR game made in Unreal Engine 5 for the Egypt Game Jam(1-Week). The game features interactable props, physics-based puzzles, key-door mechanics, and a suspenseful atmosphere.",
    stack: ["Unreal Engine 5", "C++"], accent: "#d926f0",
    img: "/Portfolio/images/BlankAgain.png",
    links: { github: "#", youtube: "https://www.youtube.com/watch?v=iqTLwZZMAKI" },
  },
  {
    id: 4, title: "TANKS TANKS TANKS", category: "Multiplayer", year: "2026",
    desc: "A fast paced multiplayer game made in Unity, where players control tanks and battle each other in 2 opposing teams. The game features rigidbody movement for a weighed feel, fluid animations and impactful VFX, class and ability systems",
    stack: ["Unity", "C#", "Netcode"], accent: "#7c3aed",
    img: "/Portfolio/images/Tanks.png",
    links: { github: "#" },
  },
  {
    id: 5, title: "UE5 THIRD PERSON SHOOTER", category: "Third Person", year: "2026",
    desc: "Third Person Shooter base made in Unreal Engine 5, featuring a locomotion system with 3 states(unarmed, pistol, rifle), a firing system, a health and consumables system, an interaction system and enemy AI turrets",
    stack: ["Unreal Engine 5", "C++"], accent: "#00e5ff",
    img: "/Portfolio/images/UE5TPS.png",
    links: { github: "#", youtube: "https://www.youtube.com/watch?v=bRkA1bfu5pU" },
  },
  {
    id: 6, title: "DMC 3 SCENE 1 REMAKE", category: "Cinematic", year: "2025",
    desc: "An attempt to remake the first scene from Devil May Cry 3 in Unreal Engine 5 to learn animation and sequencer basics.",
    stack: ["Unreal Engine 5", "Sequencer", "Blender"], accent: "#ff3d5a",
    img: "/Portfolio/images/Scene.jpg",
    links: { github: "#", youtube: "https://www.youtube.com/watch?v=zaWelhRBzHM" },
  },
];

const STACK = [
  { name: "Unreal Engine 5", glyph: "⬡", xp: 95, color: "#ff3d5a" },
  { name: "Unity", glyph: "◈", xp: 90, color: "#00e5ff" },
  { name: "C++", glyph: "</>", xp: 88, color: "#d926f0" },
  { name: "C#", glyph: "◇", xp: 85, color: "#7c3aed" },
  { name: "Netcode", glyph: "⟁", xp: 75, color: "#ff3d5a" },
  { name: "Blender", glyph: "○", xp: 60, color: "#00e5ff" },
  { name: "Shader Dev", glyph: "◉", xp: 65, color: "#d926f0" },
  { name: "Git / Perforce", glyph: "⊕", xp: 87, color: "#7c3aed" },
];

const MEDIA = [
  { src: "/Portfolio/images/JJK.png", label: "JUJUTSU KAISEN TOP-DOWN FIGHTER" },
  { src: "/Portfolio/images/Castlevania.png", label: "CASTLEVANIA: DAWN OF SORROW INSPIRED LEVEL" },
  { src: "/Portfolio/images/BlankAgain.png", label: "BLANK AGAIN VR" },
  { src: "/Portfolio/images/Tanks.png", label: "TANKS TANKS TANKS" },
  { src: "/Portfolio/images/UE5TPS.png", label: "UE5 THIRD PERSON SHOOTER" },
  { src: "/Portfolio/images/Scene.jpg", label: "DMC 3 SCENE 1 REMAKE" },
];

const CATS = ["ALL", "Multiplayer", "Hack & Slash", "Third Person", "VR", "Cinematic"];

// ── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)",
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
      ...style,
    }}>{children}</div>
  );
}

// ── PARTICLE CANVAS ───────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      c: [C.red, C.mag, C.violet, C.cyan][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      // lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = pts[i].c + Math.round((1 - d / 90) * 0.12 * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const clicking = useRef(false);

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onDown = () => { clicking.current = true; };
    const onUp   = () => { clicking.current = false; };
    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Re-attach hover listeners whenever DOM changes (handles dynamic elements)
    const attachHover = () => {
      document.querySelectorAll("a, button, [role=button]").forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachHover();
    const obs = new MutationObserver(attachHover);
    obs.observe(document.body, { childList: true, subtree: true });

    // Recover cursor position when mouse re-enters from iframe
    const onWindowEnter = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mouseenter", onWindowEnter);

    let raf;
    const animate = () => {
      // Faster lerp: 0.22 instead of 0.12
      ring.current.x += (mouse.current.x - ring.current.x) * 0.22;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.22;

      if (dotRef.current) {
        const s = clicking.current ? 0.6 : 1;
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px) scale(${s})`;
        dotRef.current.style.background = clicking.current ? C.mag : C.red;
      }
      if (ringRef.current) {
        const scale = clicking.current ? 0.75 : hovering.current ? 1.8 : 1;
        const color = clicking.current ? C.cyan : hovering.current ? C.mag : C.red;
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px) scale(${scale})`;
        ringRef.current.style.borderColor = color;
        ringRef.current.style.boxShadow = `0 0 ${clicking.current ? 18 : 10}px ${color}${clicking.current ? "cc" : "80"}`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseenter", onWindowEnter);
      obs.disconnect();
    };
  }, []);

  return createPortal(
    <>
      {/* dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99999,
        width: 8, height: 8, borderRadius: "50%",
        background: C.red, boxShadow: `0 0 8px ${C.red}`,
        pointerEvents: "none", willChange: "transform",
      }} />
      {/* ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99998,
        width: 36, height: 36, borderRadius: "50%",
        border: `1px solid ${C.red}`,
        boxShadow: `0 0 10px ${C.red}80`,
        pointerEvents: "none", willChange: "transform",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
        mixBlendMode: "screen",
      }} />
    </>,
    document.body
  );
}

// ── SIDE PARTICLES ────────────────────────────────────────────────────────────
function SideParticles() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const SIDE_W = 160; // px from each edge that counts as "the sides"
    const colors = [C.red, C.mag, C.violet, C.cyan];

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() < 0.5 ? Math.random() * SIDE_W : window.innerWidth - Math.random() * SIDE_W,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.15,
      baseX: 0, baseY: 0,
    }));
    particles.forEach(p => { p.baseX = p.x; p.baseY = p.y; });

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // drift
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // mouse repel
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 2.5;
          p.y += (dy / dist) * force * 2.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color + Math.round((1 - d / 80) * 0.15 * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 0,
      width: "100%", height: "100%",
      pointerEvents: "none",
    }} />
  );
}


const GithubIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
const YoutubeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
const LinkedinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
const SteamIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.718L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0z" /></svg>;
const DiscordIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>;
// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 60,
      background: scrolled ? "rgba(10,10,12,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px",
      transition: "all 0.35s",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28,
          background: `linear-gradient(135deg, ${C.red}, ${C.mag})`,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "0.12em" }}>MOHAB<span style={{ color: C.red }}>.</span>DEV</span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links">
        {["PROJECTS", "PROFILE", "STACK", "MEDIA", "CONTACT"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: "0.18em", color: C.muted, textDecoration: "none",
            transition: "color 0.2s, text-shadow 0.2s",
          }}
            onMouseEnter={e => { e.target.style.color = C.red; e.target.style.textShadow = `0 0 12px ${C.red}80`; }}
            onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.textShadow = "none"; }}
          >{l}</a>
        ))}
        <a href="#contact" style={{
          fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.14em", color: C.text, textDecoration: "none",
          background: C.red, padding: "8px 18px",
          clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
          transition: "box-shadow 0.2s, transform 0.15s",
          boxShadow: `0 0 16px ${C.red}60`,
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 32px ${C.red}, 0 0 60px ${C.red}40`; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 16px ${C.red}60`; e.currentTarget.style.transform = "scale(1)"; }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = `0 0 8px ${C.red}40`; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 0 32px ${C.red}`; }}
        >HIRE ME</a>
      </div>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center",
      padding: "80px 6vw 60px",
    }}>
      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,61,90,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,61,90,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: `0 ${tick * 0.15 % 60}px`,
      }} />

      {/* Ambient glow orbs */}
      <div style={{ position: "absolute", top: "15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.red}18 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.mag}12 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "40%", left: "45%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.violet}18 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <Particles />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
        {/* Status badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em",
          color: C.red, border: `1px solid ${C.red}60`, padding: "5px 14px",
          marginBottom: 32,
          animation: "heroFade 0.8s ease forwards", opacity: 0,
          clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
          background: `${C.red}10`,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
          AVAILABLE FOR WORK
        </div>

        <h1 style={{
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
          fontSize: "clamp(48px, 9vw, 96px)",
          lineHeight: 0.95, margin: "0 0 16px",
          color: C.text,
          animation: "heroFade 0.9s 0.1s ease forwards", opacity: 0,
        }}>
          MOHAB<br />
          <span style={{
            background: `linear-gradient(90deg, ${C.red}, ${C.mag})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 20px ${C.red}80)`,
          }}>ISAAC</span>
        </h1>

        {/* Tagline */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
          animation: "heroFade 0.9s 0.2s ease forwards", opacity: 0,
        }}>
          <div style={{ width: 32, height: 2, background: C.red }} />
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(14px, 2vw, 18px)", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
            Gameplay Programmer <span style={{ color: C.dim }}>·</span> Multiplayer Systems <span style={{ color: C.dim }}>·</span> UE5 / Unity
          </p>
        </div>

        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(15px, 2vw, 18px)",
          color: C.muted, lineHeight: 1.7, maxWidth: 540, marginBottom: 44,
          animation: "heroFade 0.9s 0.3s ease forwards", opacity: 0,
        }}>
          I build responsive systems that feel good and are fun to play.<br />I'm always learning, always improving!
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap",
          animation: "heroFade 0.9s 0.42s ease forwards", opacity: 0,
        }}>
          <GXButton href="#projects" color={C.red} label="VIEW PROJECTS" primary />
          <GXButton href="#media" color={C.cyan} label="WATCH GAMEPLAY" />
          <GXButton href="#contact" color={C.violet} label="CONTACT" />
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 32, marginTop: 64, paddingTop: 36,
          borderTop: `1px solid ${C.border}`,
          animation: "heroFade 0.9s 0.55s ease forwards", opacity: 0,
        }}>
          {[["3+", "YRS EXP"], ["Unreal/Unity", "ENGINES"], ["C++ and C#", "LANGUAGES"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "clamp(22px, 4vw, 36px)", color: C.red, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, letterSpacing: "0.18em", color: C.muted, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — decorative HUD */}
      <div style={{
        position: "absolute", right: "6vw", top: "50%", transform: "translateY(-50%)",
        width: 260, display: "none",
      }} className="hero-hud">
        <HUDPanel />
      </div>
    </section>
  );
}

function GXButton({ href, color, label, primary }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
        fontSize: 13, letterSpacing: "0.16em",
        color: primary ? C.bg : hov ? C.text : color,
        background: primary
          ? pressed ? color : hov ? C.mag : color
          : hov ? `${color}20` : "transparent",
        border: `1px solid ${hov ? color : color + "99"}`,
        padding: "12px 28px", textDecoration: "none",
        clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
        boxShadow: pressed
          ? `0 0 6px ${color}40`
          : hov
          ? `0 0 32px ${color}90, 0 0 64px ${color}30, inset 0 0 12px ${color}20`
          : `0 0 8px ${color}30`,
        transform: pressed ? "scale(0.96)" : hov ? "scale(1.03)" : "scale(1)",
        transition: "all 0.18s ease",
        display: "inline-block",
      }}
    >{label}</a>
  );
}

function HUDPanel() {
  return (
    <div style={{
      border: `1px solid ${C.red}50`,
      background: `${C.panel}cc`,
      padding: 16,
      boxShadow: `0 0 24px ${C.red}20, inset 0 0 24px ${C.red}08`,
    }}>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: C.red, letterSpacing: "0.18em", marginBottom: 12 }}>// SYSTEM STATUS</div>
      {[["ENGINE", "UE5 / UNITY"], ["NETCODE", "ONLINE"], ["BUILD", "RELEASE"], ["STATUS", "DEPLOYED"]].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>{k}</span>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: C.cyan }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
        background: active ? C.red : hov ? `${C.red}18` : "transparent",
        color: active ? C.bg : hov ? C.text : C.muted,
        border: `1px solid ${active ? C.red : hov ? `${C.red}70` : C.border}`,
        padding: "6px 16px", cursor: "pointer",
        clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
        boxShadow: active
          ? `0 0 18px ${C.red}70, inset 0 0 8px ${C.red}20`
          : hov ? `0 0 14px ${C.red}40` : "none",
        transform: pressed ? "scale(0.94)" : "scale(1)",
        transition: "all 0.18s ease",
      }}>{label}</button>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  return (
    <section id="projects" style={{ padding: "100px 6vw", maxWidth: 1200, margin: "0 auto" }}>
      <Reveal>
        <SectionHeader label="FEATURED PROJECTS" accent={C.red} />
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32, marginBottom: 48 }}>
          {CATS.map(c => {
            const active = filter === c;
            return (
              <FilterBtn key={c} label={c} active={active} onClick={() => setFilter(c)} />
            );
          })}
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18, alignItems: "stretch" }}>
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06} style={{ height: "100%" }}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function getYoutubeId(url) {
  if (!url || url === "#") return null;
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function YoutubeModal({ videoId, accent, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return createPortal(
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "relative", width: "92vw", height: "88vh",
        border: `1px solid ${accent}60`,
        boxShadow: `0 0 60px ${accent}40`,
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
        <button onClick={onClose} style={{
          position: "absolute", top: -14, right: -14,
          width: 28, height: 28, borderRadius: "50%",
          background: accent, border: "none", color: "#0a0a0c",
          fontWeight: 700, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 16px ${accent}`,
        }}>✕</button>
      </div>
    </div>,
    document.body
  );
}

function ProjectCard({ p }) {
  const [hov, setHov] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const linkMap = { github: GithubIcon, youtube: YoutubeIcon, steam: SteamIcon, discord: DiscordIcon, demo: () => <span style={{ fontSize: 12 }}>▶</span> };
  const linkLabel = { github: "GitHub", youtube: "YouTube", steam: "Steam", demo: "Demo", discord: "Discord" };
  const ytId = getYoutubeId(p.links.youtube);

  return (
    <>
      {ytOpen && ytId && <YoutubeModal videoId={ytId} accent={p.accent} onClose={() => setYtOpen(false)} />}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: C.card,
          border: `1px solid ${hov ? p.accent + "80" : C.border}`,
          boxShadow: hov ? `0 0 28px ${p.accent}30, inset 0 0 20px ${p.accent}06` : "none",
          transition: "all 0.3s",
          transform: hov ? "translateY(-4px)" : "none",
          overflow: "hidden",
          display: "flex", flexDirection: "column", height: "100%",
        }}
      >
        {/* Thumbnail */}
        <div
          onClick={() => ytId && setYtOpen(true)}
          style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", cursor: ytId ? "pointer" : "default" }}
        >
          <img src={p.img} alt={p.title} style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: hov ? "brightness(0.95) saturate(1.1)" : "brightness(0.6) saturate(0.8)",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "all 0.4s",
          }} />
          {/* Accent overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: hov ? `linear-gradient(135deg, ${p.accent}18, transparent 60%)` : "transparent",
            transition: "background 0.3s",
          }} />
          {/* Corner accent */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: 3, height: hov ? "100%" : "40%",
            background: p.accent, boxShadow: `0 0 12px ${p.accent}`,
            transition: "height 0.4s",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: hov ? "100%" : "40%", height: 3,
            background: p.accent, boxShadow: `0 0 12px ${p.accent}`,
            transition: "width 0.4s",
          }} />
          <div style={{
            position: "absolute", top: 12, right: 12,
            fontFamily: "'Rajdhani', sans-serif", fontSize: 10, letterSpacing: "0.16em",
            color: p.accent, background: `${C.bg}cc`, border: `1px solid ${p.accent}60`,
            padding: "3px 10px",
            clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
          }}>{p.category.toUpperCase()}</div>

          {/* Play button overlay — only if youtube link exists */}
          {ytId && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: hov ? 1 : 0, transition: "opacity 0.3s",
            }}>
              <div style={{
                width: 52, height: 52,
                border: `2px solid ${p.accent}`,
                boxShadow: `0 0 24px ${p.accent}80`,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${p.accent}25`,
              }}>
                <span style={{ color: C.text, fontSize: 18, marginLeft: 4 }}>▶</span>
              </div>
            </div>
          )}
        </div>

        {/* Body — flex grow so all cards stretch to same height */}
        <div style={{ padding: "20px 20px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 20, color: C.text, margin: 0, letterSpacing: "0.06em" }}>{p.title}</h3>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: C.muted }}>{p.year}</span>
          </div>

          {/* flex: 1 pushes stack + links to bottom */}
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.65, margin: "0 0 14px", flex: 1 }}>{p.desc}</p>

          {/* Stack tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {p.stack.map(s => (
              <span key={s} style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: 10, letterSpacing: "0.14em",
                color: p.accent, background: `${p.accent}12`,
                border: `1px solid ${p.accent}30`,
                padding: "2px 9px",
              }}>{s}</span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            {Object.entries(p.links).filter(([, url]) => url !== "#").map(([type, url]) => {
              const Icon = linkMap[type] || (() => null);
              return (
                <a key={type} href={url} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'Rajdhani', sans-serif", fontSize: 11, letterSpacing: "0.1em",
                  color: C.muted, textDecoration: "none", transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = p.accent}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}
                >
                  <Icon />{linkLabel[type].toUpperCase()}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function Profile() {
  return (
    <section id="profile" style={{
      padding: "100px 6vw",
      background: C.panel,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
    }}>
      {/* BG accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: `linear-gradient(to bottom, ${C.red}, ${C.mag}, transparent)` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="profile-grid">
        <Reveal>
          <SectionHeader label="DEVELOPER PROFILE" accent={C.mag} />
          <div style={{ marginTop: 32 }}>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              padding: "24px 24px",
              marginBottom: 20,
              borderLeft: `3px solid ${C.red}`,
            }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.8, margin: 0 }}>
                I'm a gameplay and systems developer proficient in both UE5 and Unity, skilled in crafting various experiences. My work ranges from rapid prototyping to developing full-featured titles that prioritize engaging gameplay.
              </p>
            </div>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>
              My goal is to make systems that actually feel good to experience and play in, no matter the platform or scale.
            </p>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "SPECIALTY", value: "Multiplayer / UE5", color: C.red },
                { label: "AVAILABILITY", value: "Immediate", color: "#22c55e" },
                { label: "LOCATION", value: "Remote / On-site", color: C.cyan },
                { label: "CONTRACT", value: "Freelance + FT", color: C.mag },
              ].map(s => (
                <div key={s.label} style={{
                  background: C.bg, border: `1px solid ${C.border}`,
                  padding: "14px 16px",
                  borderTop: `2px solid ${s.color}`,
                }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, letterSpacing: "0.2em", color: C.muted, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal delay={0.15}>
          <div style={{ marginTop: 64 }}>
            {[
              { year: "2025-2026", role: "Game Programming Trainee", co: "Information Technology Institute", note: "Studied game programming for 9-months at ITI" },
              { year: "2024-2025", role: "Retoucher", co: "TechJump", note: "Worked as an image retoucher using Photoshop" },
              { year: "2023-2024", role: "Soldier", co: "Egyptian Military", note: "Served in the Egyptian Military" },
              { year: "2019-2023", role: "IT Student", co: "EELU", note: "Studied Information Technology" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < 3 ? 28 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
                  <div style={{ width: 10, height: 10, background: C.red, boxShadow: `0 0 10px ${C.red}`, flexShrink: 0 }} />
                  {i < 3 && <div style={{ flex: 1, width: 1, background: C.border, marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: C.red, letterSpacing: "0.14em", marginBottom: 3 }}>{t.year}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 2 }}>{t.role}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: C.muted, marginBottom: 4, letterSpacing: "0.06em" }}>{t.co}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: "#4a4a60", lineHeight: 1.5 }}>{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── TECH ARSENAL ──────────────────────────────────────────────────────────────
function TechArsenal() {
  return (
    <section id="stack" style={{ padding: "100px 6vw", maxWidth: 1200, margin: "0 auto" }}>
      <Reveal>
        <SectionHeader label="TECH ARSENAL" accent={C.cyan} />
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginTop: 44 }}>
        {STACK.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <StackCard s={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StackCard({ s }) {
  const [hov, setHov] = useState(false);
  const [animXP, setAnimXP] = useState(false);
  const [ref, vis] = useInView();
  useEffect(() => { if (vis) setTimeout(() => setAnimXP(true), 300); }, [vis]);

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.card : C.bg,
        border: `1px solid ${hov ? s.color + "80" : C.border}`,
        padding: "20px 18px",
        boxShadow: hov ? `0 0 22px ${s.color}25, inset 0 0 16px ${s.color}06` : "none",
        transition: "all 0.3s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 18,
            color: s.color,
            textShadow: hov ? `0 0 14px ${s.color}` : "none",
            transition: "text-shadow 0.3s",
          }}>{s.glyph}</span>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: "0.05em" }}>{s.name}</span>
        </div>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 13, color: s.color }}>{s.xp}</span>
      </div>

      {/* XP bar */}
      <div style={{ height: 3, background: C.dim, position: "relative" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: animXP ? `${s.xp}%` : "0%",
          background: `linear-gradient(to right, ${s.color}, ${s.color}aa)`,
          boxShadow: `0 0 8px ${s.color}`,
          transition: "width 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>
    </div>
  );
}

// ── MEDIA ─────────────────────────────────────────────────────────────────────
function MediaShowcase() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="media" style={{
      padding: "100px 6vw",
      background: C.panel,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      position: "relative",
    }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 3, background: `linear-gradient(to right, ${C.red}, ${C.mag}, ${C.violet}, transparent)` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <SectionHeader label="MEDIA SHOWCASE" accent={C.violet} />
        </Reveal>

        {/* Featured */}
        <Reveal delay={0.1} style={{ marginTop: 40 }}>
          <div
            onClick={() => setLightbox(MEDIA[active])}
            style={{
              position: "relative", aspectRatio: "21/9",
              overflow: "hidden", cursor: "pointer",
              border: `1px solid ${C.violet}50`,
              boxShadow: `0 0 32px ${C.violet}20`,
              marginBottom: 14,
            }}>
            <img src={MEDIA[active].src} alt={MEDIA[active].label} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(10,10,12,0.8) 0%, transparent 50%)",
            }} />
            {/* Play button */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 64, height: 64,
              border: `2px solid ${C.violet}`,
              boxShadow: `0 0 24px ${C.violet}60`,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `${C.violet}20`,
            }}>
              <span style={{ color: C.text, fontSize: 20, marginLeft: 4 }}>▶</span>
            </div>
            <div style={{
              position: "absolute", bottom: 20, left: 20,
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 18,
              color: C.text, letterSpacing: "0.1em",
            }}>{MEDIA[active].label}</div>
          </div>
        </Reveal>

        {/* Thumbnails */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {MEDIA.map((m, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div onClick={() => setActive(i)} style={{
                aspectRatio: "16/10", overflow: "hidden", cursor: "pointer",
                border: `1px solid ${i === active ? C.violet : C.border}`,
                boxShadow: i === active ? `0 0 16px ${C.violet}50` : "none",
                transition: "all 0.2s",
              }}>
                <img src={m.src} alt={m.label} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  filter: i === active ? "brightness(1)" : "brightness(0.45) saturate(0.5)",
                  transition: "filter 0.2s",
                }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <img src={lightbox.src} alt={lightbox.label} style={{ maxWidth: "88vw", maxHeight: "82vh", border: `1px solid ${C.violet}50`, boxShadow: `0 0 60px ${C.violet}30` }} />
        </div>
      )}
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [hov, setHov] = useState(false);

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14,
    background: C.bg, color: C.text,
    border: `1px solid ${C.border}`,
    padding: "12px 14px", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    letterSpacing: "0.02em",
  };

  return (
    <section id="contact" style={{ padding: "100px 6vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="contact-grid">
        <Reveal>
          <SectionHeader label="GET IN TOUCH" accent={C.red} />
          <div style={{ marginTop: 32 }}>
            {/* Available callout */}
            <div style={{
              background: `${C.red}10`, border: `1px solid ${C.red}50`,
              borderLeft: `3px solid ${C.red}`,
              padding: "16px 20px", marginBottom: 32,
              boxShadow: `0 0 20px ${C.red}15`,
            }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 14, color: C.red, letterSpacing: "0.12em", marginBottom: 4 }}>
                ⚡ AVAILABLE FOR WORK
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: C.muted }}>
                Open to game developer roles, contracts, and ambitious collaborations. Response within 24 hours.
              </div>
            </div>

            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 36 }}>
              Whether you're building a small-scale indie project or a massively online multiplayer, I'm here for it.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { Icon: GithubIcon, label: "GITHUB", sub: "@MohabIsaac", color: C.text, href: "https://github.com/MohabIsaac" },
                { Icon: LinkedinIcon, label: "LINKEDIN", sub: "in/MohabIsaac", color: "#0a66c2", href: "https://www.linkedin.com/in/mohab-atef-27284b218/" },
                { Icon: YoutubeIcon, label: "YOUTUBE", sub: "@Ozul", color: "#ff0000", href: "https://www.youtube.com/@ozul8772/videos" },
                { Icon: DiscordIcon, label: "DISCORD", sub: "ozul1", color: C.violet, href: "#" },
              ].map(({ Icon, label, sub, color, glyph, href }) => (
                <a key={label} href={href} target={href !== "#" ? "_blank" : undefined} rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px",
                  background: C.bg, border: `1px solid ${C.border}`,
                  textDecoration: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color + "80"; e.currentTarget.style.boxShadow = `0 0 18px ${color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ color }}>{Icon ? <Icon /> : glyph}</span>
                  <div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.16em", color: C.text }}>{label}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: C.muted }}>{sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.15}>
          {sent ? (
            <div style={{
              marginTop: 72, background: C.card,
              border: `1px solid ${C.red}50`,
              padding: "48px 32px", textAlign: "center",
              boxShadow: `0 0 32px ${C.red}20`,
            }}>
              <div style={{ fontSize: 32, marginBottom: 16, color: C.red }}>✓</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 22, color: C.text, letterSpacing: "0.08em", marginBottom: 8 }}>TRANSMISSION RECEIVED</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: C.muted }}>I'll respond within 24 hours. Stand by.</div>
            </div>
          ) : (
            <div style={{ marginTop: 72, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["NAME", "name", "Your name"], ["EMAIL", "email", "your@email.com"]].map(([l, f, ph]) => (
                  <div key={f}>
                    <label style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>{l}</label>
                    <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                      placeholder={ph} type={f}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = C.red + "80"; e.target.style.boxShadow = `0 0 12px ${C.red}20`; }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>MESSAGE</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project…" rows={6}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 130 }}
                  onFocus={e => { e.target.style.borderColor = C.red + "80"; e.target.style.boxShadow = `0 0 12px ${C.red}20`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <button onClick={() => { if (form.name && form.email && form.message) setSent(true); }}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
                  fontSize: 13, letterSpacing: "0.2em",
                  background: C.red, color: C.bg, border: "none",
                  padding: "15px 32px", cursor: "pointer",
                  clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
                  boxShadow: hov ? `0 0 32px ${C.red}` : `0 0 16px ${C.red}60`,
                  transition: "box-shadow 0.25s",
                }}>SEND TRANSMISSION →</button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`,
      background: C.panel,
      padding: "24px 6vw",
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 20, height: 20,
          background: `linear-gradient(135deg, ${C.red}, ${C.mag})`,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: "0.1em" }}>MOHAB<span style={{ color: C.red }}>.</span>DEV</span>
      </div>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>© 2025 · GAMEPLAY PROGRAMMER · BUILT IN REACT</span>
      <a href="#hero" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, letterSpacing: "0.16em", color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
        onMouseEnter={e => e.target.style.color = C.red}
        onMouseLeave={e => e.target.style.color = C.muted}
      >BACK TO TOP ↑</a>
    </footer>
  );
}

// ── SHARED ────────────────────────────────────────────────────────────────────
function SectionHeader({ label, accent }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <div style={{ width: 3, height: 22, background: accent, boxShadow: `0 0 10px ${accent}` }} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent }}>// {label}</span>
      </div>
      <div style={{ height: 1, background: `linear-gradient(to right, ${accent}50, transparent)`, marginLeft: 17 }} />
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function GXPortfolio() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow+Condensed:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.text}; cursor: none; }
        a, button { cursor: none; }
        ::selection { background: ${C.red}40; color: ${C.text}; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.red}; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.mag}; }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes rgbShift {
          0%   { border-color: ${C.red}; box-shadow: 0 0 12px ${C.red}40; }
          33%  { border-color: ${C.mag}; box-shadow: 0 0 12px ${C.mag}40; }
          66%  { border-color: ${C.violet}; box-shadow: 0 0 12px ${C.violet}40; }
          100% { border-color: ${C.red}; box-shadow: 0 0 12px ${C.red}40; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .profile-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      <SideParticles />
      <CustomCursor />
      <div style={{ background: "transparent", minHeight: "100vh", overflowX: "hidden", position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <Projects />
        <Profile />
        <TechArsenal />
        <MediaShowcase />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
