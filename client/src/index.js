import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>)