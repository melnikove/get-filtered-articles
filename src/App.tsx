import React from 'react';
import './App.css'
import SwarmicaTable from './SwarmicaTable/SwarmicaTable';
import { RecoilRoot } from 'recoil';

function App() {

  return (
    <RecoilRoot>
        <SwarmicaTable/>
    </RecoilRoot>
  )
}

export default App;
