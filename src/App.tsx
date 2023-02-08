import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library, IconPack } from '@fortawesome/fontawesome-svg-core';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Home } from './components/Home';
import { Helden } from './components/Helden';
import { HeldIdx } from './components/Held';
import { Layout } from './Layout';

function App() {
    library.add(fas as IconPack);
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="helden" element={<Helden />} />
                <Route path="helden/:idx" element={<HeldIdx />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
}

export default App;
