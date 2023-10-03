import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';

const ShowProducts = () => {
    const url = 'https://localhost:44337/api/UsuariosApi';
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaDeNacimiento, setFechaDeNacimiento] = useState('');
    const [nickname, setNickname] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getUsuarios();
    }, [currentPage]);

    // Traer datos
    const getUsuarios = async () => {
        const response = await axios.get(url);
        setUsuarios(response.data);
    }

    // Funciones para control
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const openModal = (op, id, name, descripcion, nickname, fechaDeNacimiento) => {
        setId('');
        setName('');
        setDescripcion('');
        setNickname('');
        setFechaDeNacimiento('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Producto');
        } else if (op === 2) {
            setTitle('Editar Producto');
            setId(id);
            setName(name);
            setDescripcion(descripcion);
            setNickname(nickname);
            setFechaDeNacimiento(fechaDeNacimiento);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            show_alerta('Escribe el nombre del Usuario', 'warning');
        } else if (descripcion.trim() === '') {
            show_alerta('Escribe la descripción del Usuario', 'warning');
        } else if (nickname.trim() === '') {
            show_alerta('Escribe el nickname del Usuario', 'warning');
        } else if (!fechaDeNacimiento) {
            show_alerta('Selecciona una fecha de nacimiento', 'warning');
        } else {
            if (operation === 1) {
                parametros = { name: name.trim(), nickname: nickname.trim(), fechaDeNacimiento: fechaDeNacimiento, descripcion: descripcion.trim() };
                metodo = 'POST';
            } else {
                parametros = { id: id, name: name.trim(), nickname: nickname.trim(), fechaDeNacimiento: fechaDeNacimiento, descripcion: descripcion.trim() };
                metodo = 'PUT';
            }
            envarSolicitud(metodo, parametros);
        }
    }

    const searchUsuarios = async (term) => {
        try {
            if(term ===''){
                getUsuarios();
            }else{
               const response = await axios.get(`${url}/search?searchTerm=${term}`);
                setUsuarios(response.data); 
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = usuarios.slice(indexOfFirstItem, indexOfLastItem);

    const envarSolicitud = async (metodo, parametros) => {
        let urlToSend = url;
        if (metodo === 'PUT') {
            urlToSend = `${url}/${parametros.id}`;
        }
        try {
            const respuesta = await axios({ method: metodo, url: urlToSend, data: parametros });

            if (respuesta.status >= 200 && respuesta.status < 300) {
                show_alerta('Solicitud exitosa', 'success');
                document.getElementById('btnCerrar').click();
                getUsuarios();
            } else {
                show_alerta('Error en la solicitud', 'error');
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.log(error);
        }
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
                    <div className='col-md-4 offset-md-4'>
                        <div className='input-group mb-3'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Buscar'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className='btn btn-outline-secondary'
                                type='button'
                                onClick={() => searchUsuarios(searchTerm)}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Nickname</th>
                                        <th>FechaDeNacimiento</th>
                                        <th>Descripcion</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {currentUsers.map((usuario, i) => (
                                        <tr key={usuario.id}>
                                            <td>{i + 1 + indexOfFirstItem}</td>
                                            <td>{usuario.name}</td>
                                            <td>{usuario.nickname}</td>
                                            <td>{formatDate(usuario.fechaDeNacimiento)}</td>
                                            <td>{usuario.descripcion}</td>
                                            <td>
                                                <button onClick={() => openModal(2, usuario.id, usuario.name, usuario.descripcion, usuario.nickname, usuario.fechaDeNacimiento)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pagination">
                <button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastItem >= usuarios.length}
                >
                    Siguiente
                </button>
            </div>
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nickname' className='form-control' placeholder='Nickname' value={nickname} onChange={(e) => setNickname(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-calendar'></i></span>
                                <input type='date' id='fechaNacimiento' className='form-control' value={fechaDeNacimiento} onChange={(e) => setFechaDeNacimiento(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
                            </div>

                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowProducts;
