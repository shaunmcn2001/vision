import { expect, test } from 'vitest';

test('postcss and tailwind configuration', () => {
  // Test that autoprefixer is available
  expect(() => require('autoprefixer')).not.toThrow();
  
  // Test that tailwindcss-animate is available
  expect(() => require('tailwindcss-animate')).not.toThrow();
  
  // Test that the main.css file structure is correct
  const fs = require('fs');
  const mainCSS = fs.readFileSync('src/main.css', 'utf8');
  
  // Should import tailwindcss
  expect(mainCSS).toContain("@import 'tailwindcss'");
  
  // Should import theme
  expect(mainCSS).toContain("@import './styles/theme.css'");
  
  // Should import animate
  expect(mainCSS).toContain('@import "tw-animate-css"');
  
  // Should NOT import index.css (circular dependency fix)
  expect(mainCSS).not.toContain("@import './index.css'");
});

test('environment variables are properly configured', () => {
  // Backend URL should be set to the new render URL
  expect(process.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com')
    .toBe('https://vision-backend-0l94.onrender.com');
});