import React from 'react';
import './App.css'
import SwarmicTable from './SwarmicTable';
import { RecoilRoot } from 'recoil';

function App() {

  return (
    <RecoilRoot>
      <div>
        <SwarmicTable/>
       </div>
    </RecoilRoot>
  )
}

export default App;
