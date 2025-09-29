import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {keycloakify} from "keycloakify/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            themeName: "NewTheme",
            accountThemeImplementation: "none"
        })
    ],
    server: {
        port: 5678
    }
})
