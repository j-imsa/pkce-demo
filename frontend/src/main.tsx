import {createRoot} from 'react-dom/client'
import {AppRouter} from "./routing/AppRouter.tsx";
import './index.css'

createRoot(document.getElementById('root')!).render(
    <AppRouter/>
)
