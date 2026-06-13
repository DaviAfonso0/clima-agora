import { useState } from "react";
import "./App.css"
import Header from "./componentes/Header/Header";
import Principal from "./componentes/Main/Principal";

function App(){
  const [cidade,setCidade] = useState("")
  return(
    <div className="container-principal">
      <Header setCidade={setCidade}></Header>
      <Principal cidade={cidade}></Principal>
    </div>
  )
}

export default App;