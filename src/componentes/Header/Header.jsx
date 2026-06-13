import { useState } from "react";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./Header.css";

function Header({setCidade}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [nomeCidade,setNomeCidade] = useState("")

  function enviarForm(e){
    e.preventDefault()
    setCidade(nomeCidade)
  }

  return (
    <header className="header">
      <div className="div-titulo">
        <button className="menu" onClick={() => setMenuAberto(true)}>
          <MenuIcon />
        </button>
        <CloudQueueIcon sx={{ fontSize: "2rem" }} />
        <h1>ClimaAgora</h1>
      </div>

      <div className="div-form">
        <form className="search-form" onSubmit={enviarForm}>
          <SearchIcon className="search-icon" />
          <input 
            type="search" 
            value={nomeCidade}
            placeholder="Buscar cidade..."
            onChange={(e) => setNomeCidade(e.target.value.toLowerCase())}
           />
          <button type="submit">
            <SearchIcon className="icone-botao" />
          </button>
        </form>
      </div>

      <nav className="div-links">
        <ul>
          <li>Início</li>
          <li>Previsão</li>
          <li>Radar</li>
        </ul>
      </nav>

      <div
        className={`overlay ${menuAberto ? "overlay-ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
      />

      <nav className={`menu-lateral ${menuAberto ? "menu-aberto" : ""}`}>
        <button className="btn-fechar" onClick={() => setMenuAberto(false)}>
          <CloseIcon />
        </button>
        <ul>
          <li>Início</li>
          <li>Previsão</li>
          <li>Radar</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;