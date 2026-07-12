// ============================================================
// WebGL Metallic / Liquid Gradient Background Shader
// ============================================================

// ---- Replace this shader to change the effect ----
const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform vec2  u_resolution;
  uniform vec2  u_mouse;
  uniform float u_time;

  // ----- Simplex-style noise helpers -----
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,   // (3.0-sqrt(3.0))/6.0
      0.366025403784439,   //  0.5*(sqrt(3.0)-1.0)
     -0.577350269189626,   // -1.0 + 2.0 * C.x
      0.024390243902439    //  1.0 / 41.0
    );

    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    vec3 g;
    g.x = a0.x * x0.x   + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;

    return 130.0 * dot(m, g);
  }

  // ----- Fractional Brownian Motion -----
  float fbm(vec2 p) {
    float value = 0.0;
    float amp   = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * snoise(p);
      p    *= 2.0;
      amp  *= 0.5;
    }
    return value;
  }

  // ----- Iridescent colour palette -----
  vec3 iridescence(float t) {
    // Attempt a subtle metallic rainbow: deep blues → teals → purples
    vec3 a = vec3(0.08, 0.10, 0.14);          // dark base
    vec3 b = vec3(0.06, 0.08, 0.12);          // low amplitude
    vec3 c = vec3(1.0,  1.0,  1.0);           // frequency
    vec3 d = vec3(0.00, 0.15, 0.40);          // phase offsets
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

    // Normalised mouse with gentle lag already applied on the JS side
    vec2 mouse = u_mouse / u_resolution;

    float t = u_time * 0.08;  // slow time

    // Domain-warped noise layers
    vec2 p = uv * aspect * 2.0;
    float n1 = fbm(p + vec2(t, t * 0.7));
    float n2 = fbm(p + vec2(n1 * 0.6, t * 0.5));
    float n3 = fbm(p * 1.5 + vec2(n2, n1) * 0.4 + t * 0.3);

    // Mouse influence — subtle pull on the noise field
    float mouseDist = length((uv - mouse) * aspect);
    float mouseInfluence = smoothstep(0.8, 0.0, mouseDist) * 0.15;

    float combined = n2 * 0.5 + n3 * 0.5 + mouseInfluence;

    // Map to iridescent palette
    vec3 col = iridescence(combined * 0.6 + t * 0.15);

    // Subtle specular-like highlight near the mouse
    float highlight = pow(max(1.0 - mouseDist * 1.2, 0.0), 4.0) * 0.08;
    col += highlight;

    // Gentle vignette to keep edges dark
    float vig = smoothstep(1.4, 0.4, length((uv - 0.5) * 2.0));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;
// ---- End of replaceable shader source ----

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// ============================================================
// Module state
// ============================================================
let gl = null;
let program = null;
let animFrameId = null;
let isRunning = false;
let startTime = 0;

// Smoothed mouse position (pixels)
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;
const MOUSE_LERP = 0.06; // latency / smoothing factor

// Uniform locations
let uResolution = null;
let uMouse = null;
let uTime = null;

// ============================================================
// Helpers
// ============================================================

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(vsSrc, fsSrc) {
  const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('Program link error:', gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function resize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

// ============================================================
// Render loop
// ============================================================

function render() {
  if (!isRunning) return;

  const canvas = gl.canvas;
  resize(canvas);

  // Smooth mouse interpolation
  mouseX += (targetMouseX - mouseX) * MOUSE_LERP;
  mouseY += (targetMouseY - mouseY) * MOUSE_LERP;

  const elapsed = (performance.now() - startTime) / 1000;

  gl.useProgram(program);
  gl.uniform2f(uResolution, canvas.width, canvas.height);
  gl.uniform2f(uMouse, mouseX * (window.devicePixelRatio || 1),
               canvas.height - mouseY * (window.devicePixelRatio || 1)); // flip Y
  gl.uniform1f(uTime, elapsed);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  animFrameId = requestAnimationFrame(render);
}

function start() {
  if (isRunning) return;
  isRunning = true;
  startTime = performance.now();
  animFrameId = requestAnimationFrame(render);
}

function stop() {
  isRunning = false;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

// ============================================================
// Public mouse update function
// ============================================================

/**
 * Feed cursor coordinates (CSS pixels) into the shader.
 * Called externally from cursor.js or any other input handler.
 * @param {number} x
 * @param {number} y
 */
function updateMousePosition(x, y) {
  targetMouseX = x;
  targetMouseY = y;
}

// Expose globally so cursor.js can call it
window.shaderMouseUpdate = updateMousePosition;

// ============================================================
// Initialisation
// ============================================================

function init() {
  const canvas = document.getElementById('shader-canvas');
  if (!canvas) return;

  // Try to get a WebGL context — fail silently if unavailable
  gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });

  if (!gl) return; // WebGL not supported — canvas stays transparent

  program = createProgram(VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
  if (!program) return;

  // Full-screen quad (two triangles as a strip)
  const quad = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Cache uniform locations
  uResolution = gl.getUniformLocation(program, 'u_resolution');
  uMouse      = gl.getUniformLocation(program, 'u_mouse');
  uTime       = gl.getUniformLocation(program, 'u_time');

  // Set initial mouse to centre of viewport
  targetMouseX = window.innerWidth / 2;
  targetMouseY = window.innerHeight / 2;
  mouseX = targetMouseX;
  mouseY = targetMouseY;

  // Visibility-based pause / resume
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => resize(canvas));

  // Kick off
  start();
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Global API: window.shaderMouseUpdate(x, y) is available for cursor.js
