"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/* ── Shaders ─────────────────────────────────────────────────────────── */

const VERT = `#version 300 es
precision highp float;
out vec2 vUv;
void main(){
  vec2 v[3]=vec2[3](vec2(-1,-1),vec2(3,-1),vec2(-1,3));
  vec2 p=v[gl_VertexID];
  vUv=p*0.5+0.5;
  gl_Position=vec4(p,0,1);
}`;

/*
 * NeuralNoise — rotating sine-accumulation field.
 * 15 iterations of rotated sine layers create organic neural structures.
 * Original algorithm preserved verbatim; only the color output changed.
 */
const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform float uRatio;
uniform vec2 uPointer;
out vec4 fragColor;

vec2 rotate(vec2 uv,float th){
  return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;
}

float neuro_shape(vec2 uv,float t,float p){
  vec2 sine_acc=vec2(0.);
  vec2 res=vec2(0.);
  float scale=8.;
  for(int j=0;j<15;j++){
    uv=rotate(uv,1.);
    sine_acc=rotate(sine_acc,1.);
    vec2 layer=uv*scale+float(j)+sine_acc-t;
    sine_acc+=sin(layer)+2.4*p;
    res+=(.5+.5*cos(layer))/scale;
    scale*=1.2;
  }
  return res.x+res.y;
}

void main(){
  vec2 uv=.5*vUv;
  uv.x*=uRatio;

  vec2 pointer=vUv-uPointer;
  pointer.x*=uRatio;
  float p=clamp(length(pointer),0.,1.);
  p=.5*pow(1.-p,2.);

  float t=.00025*uTime;

  float noise=neuro_shape(uv,t,p);
  noise=1.2*pow(noise,3.);
  noise+=pow(noise,10.);
  noise=max(.0,noise-.5);
  noise*=(1.-length(vUv-.5));

  // Monochrome pearl/silver — soft luminous neural silk on black
  vec3 color=vec3(0.82,0.84,0.86);
  color=color*noise;

  fragColor=vec4(clamp(color,0.,1.),noise);
}`;

/* ── Helpers ─────────────────────────────────────────────────────────── */

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(
      "[AmbientBackground] shader compile:",
      gl.getShaderInfoLog(s),
    );
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/* ── Component ───────────────────────────────────────────────────────── */

export interface AmbientBackgroundProps {
  speed?: number;
  opacity?: number;
  maxDpr?: number;
  respectReducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function AmbientBackground({
  speed = 0.00025,
  opacity = 0.65,
  maxDpr = 1.5,
  respectReducedMotion = true,
  className,
  style,
}: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    let disposed = false;
    let running = false;
    let rafId = 0;
    let isIntersecting = true;

    // uniform locations
    let uTimeLoc: WebGLUniformLocation | null = null;
    let uRatioLoc: WebGLUniformLocation | null = null;
    let uPointerLoc: WebGLUniformLocation | null = null;

    // pointer state
    const pointerTarget = { x: 0.5, y: 0.5 };
    const pointerCurrent = { x: 0.5, y: 0.5 };

    const prefersReduced =
      respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const staticOnly = prefersReduced;

    function getDpr() {
      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      return Math.min(dpr, maxDpr);
    }

    function resize() {
      if (!gl || !canvas) return;
      const dpr = getDpr();
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function render() {
      if (!gl || !canvas || disposed || gl.isContextLost()) return;
      resize();

      // smooth pointer lerp
      const lerpSpeed = staticOnly ? 0 : 0.08;
      pointerCurrent.x +=
        (pointerTarget.x - pointerCurrent.x) * lerpSpeed;
      pointerCurrent.y +=
        (pointerTarget.y - pointerCurrent.y) * lerpSpeed;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.uniform1f(uTimeLoc, performance.now());
      gl.uniform1f(
        uRatioLoc,
        canvas.height > 0 ? canvas.width / canvas.height : 1,
      );
      gl.uniform2f(
        uPointerLoc,
        pointerCurrent.x,
        1 - pointerCurrent.y,
      );

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop() {
      if (disposed || !running) return;
      render();
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (disposed || running || staticOnly) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    // ── Shader setup ──

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(
        "[AmbientBackground] link:",
        gl.getProgramInfoLog(program),
      );
      return;
    }

    // Empty VAO — WebGL2 requires a bound VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindVertexArray(null);

    gl.useProgram(program);
    uTimeLoc = gl.getUniformLocation(program, "uTime");
    uRatioLoc = gl.getUniformLocation(program, "uRatio");
    uPointerLoc = gl.getUniformLocation(program, "uPointer");

    // Set initial ratio
    resize();
    render();

    if (!staticOnly) start();

    // ── Events ──

    function onPointerMove(e: PointerEvent) {
      pointerTarget.x = e.clientX / window.innerWidth;
      pointerTarget.y = e.clientY / window.innerHeight;
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        pointerTarget.x = e.touches[0].clientX / window.innerWidth;
        pointerTarget.y = e.touches[0].clientY / window.innerHeight;
      }
    }
    function onResize() {
      resize();
      if (staticOnly) render();
    }
    function onVisibility() {
      if (staticOnly) return;
      if (document.hidden) stop();
      else if (isIntersecting) start();
    }
    function onContextLost(e: Event) {
      e.preventDefault();
      disposed = true;
      stop();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    // IntersectionObserver — pause when off-screen
    let observer: IntersectionObserver | null = null;
    if (!staticOnly && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isIntersecting = entry.isIntersecting;
            if (entry.isIntersecting && !document.hidden) start();
            else stop();
          }
        },
        { threshold: 0 },
      );
      observer.observe(canvas);
    }

    // ── Cleanup ──

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (observer) observer.disconnect();
      if (gl) {
        if (vao) gl.deleteVertexArray(vao);
        gl.deleteProgram(program);
      }
    };
  }, [speed, opacity, maxDpr, respectReducedMotion]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Deep near-black base */}
      <div
        className="absolute inset-0"
        style={{ background: "#050505" }}
      />

      {/* NeuralNoise WebGL canvas */}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          opacity,
          ...style,
        }}
      />

      {/* Subtle vignette — keeps edges dark, composition asymmetric */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 55% 40%, transparent 20%, rgba(5,5,5,0.25) 60%, rgba(5,5,5,0.6) 100%)",
        }}
      />

      {/* Film grain — extremely subtle, adds material texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
          animation: "grain 0.5s steps(3) infinite",
        }}
      />
    </div>
  );
}
