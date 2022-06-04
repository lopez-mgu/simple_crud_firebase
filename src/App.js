import logo from './logo.svg';
import './App.css';
import { onSnapshot, query, collection, orderBy, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import React, {useState,useEffect} from 'react';
import { db } from './firebase.js'


function App() {
  
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({});

  const getData = () =>{
    const todosArr = []
    onSnapshot(collection(db, 'todos'), (snapshoot) =>{
      snapshoot.docs.forEach( (doc) => {
        todosArr.push({
          ...doc.data(),
          id: doc.id});
        setTodos(todosArr)
        console.log(doc.data())
      });
    
    });

  };

  const handleChange = (ev) => {
    const date = new Date(Date.now());
    setForm({
      ...form,
      [ev.name]: ev.name === 'check' ? ev.checked : ev.value,
      date: date
    });
    console.log(form);
  };

  const handleClick = async () => {
    await addDoc(collection(db, 'todos'), form)
    setForm({});
    getData();
  };

  const updateClick = async (collection_id, data) => {
    await setDoc(doc(db, 'todos', collection_id), data);
    getData();
  };

  const deleteClick = async (collection_id) => {
    await deleteDoc(doc(db, 'todos', collection_id))
    getData();
  };

  useEffect(() => {
    getData()
  }, []);

  return (
    <div className='App'>
      <div className='App-header'>
        <h1>Firebase APP</h1>
        <div>
          <input type='text' placeholder='titulo' name="titulo" onChange={(e) => {handleChange(e.target)}} />
          <input type="text" placeholder="descripcion" name="descripcion" onChange={(e) => handleChange(e.target)} />
          <input type="checkbox" placeholder="" name="check" onChange={(e) => handleChange(e.target)} />
          <button onClick={() => handleClick()}>Guardar</button>
        </div>
        <div>
          {
            todos.map( todo =>{
              return (
                <>
                  <h3>{todo.titulo}</h3>
                  <p>{todo.descripcion}</p>
                  <button onClick={() => deleteClick(todo.id)}>Borrar</button>
                  <button onClick={() => updateClick(todo.id, {...todo, check: !todo.check})}>
                  {todo.check ? 'Desmarcar' : 'Marcar'}
                  </button>
                </>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App;
