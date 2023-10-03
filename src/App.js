import { Routes, Route, BrowserRouter} from 'react-router-dom';
import UsuariosServices from './componetes/UsuariosServices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UsuariosServices></UsuariosServices>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
