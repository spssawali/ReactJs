import React from 'react';
import { Button } from 'reactstrap';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import ContactModal from './ContactModal';
// import './App.scss';

function App(props) {
  const navigate = useNavigate()
  return (

    <div className="d-flex align-items-center justify-content-center App">
      <div className='d-flex align-items-center justify-content-center w-100'>
        <Button className='btn-a' style={{
                            background : "#46139f"
                        }} onClick={() => navigate('/modalA', {
          state: 'Modal A'
        })}>Button A</Button>
        {/* <Button className='btn-a' onClick={() => props.history.push('modalA')}>Button A</Button> */}
      </div>
      <div className='d-flex align-items-center justify-content-center w-100'>
        <Button className='btn-b' style={{background:'#ff7f50'}} onClick={() => navigate('/modalB', {
          state: 'Modal B'
        })}>Button B</Button>
        {/* <Button className='btn-b' onClick={() => props.history.push('modalB')}>Button B</Button> */}
      </div>
    </div >
  );
}

export default App;
