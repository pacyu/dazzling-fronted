// src/vite-env.d.ts
/// <reference types="vite/client" />

declare global {
  interface Window {
    MathJax?: {
      typesetPromise: () => Promise<void>
    }
  }
}

export {}  // 确保这是一个模块声明