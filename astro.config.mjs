import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  server: {
    headers: {
      "access-control-allow-origin": "http://localhost:4321/",
    },
    port: 3000,
    host: "localhost"
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/squoosh',
      config: {
        quality: 75,
        format: 'webp'
      }
    }
  },
});