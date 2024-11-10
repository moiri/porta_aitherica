import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library, IconPack } from '@fortawesome/fontawesome-svg-core';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Helden } from './components/Helden';
import { Kampf } from './components/Kampf';
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
                <Route path="kampf" element={<Kampf />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
}

export default App;
