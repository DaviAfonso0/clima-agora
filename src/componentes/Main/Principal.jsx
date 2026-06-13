import LocationOnIcon from "@mui/icons-material/LocationOn";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./Principal.css";
import { useEffect, useState } from "react";

function Principal({cidade}) {
  const [dadosClima, setDadosClima] = useState(null);
  const [emojiTempo, setEmojiTempo] = useState("")
  const[clima,setClima] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [localizacao,setLocalizacao] = useState(null)
  const [previsaoDias,setPrevisaoDias] = useState([])
  const [tempoHora,setTempoHora] = useState([])
  const agora = new Date()
  const horaAtual = agora.getHours() 
  const dataFormatada = agora.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long"
  })


  useEffect(() => {
      navigator.geolocation.getCurrentPosition(
      (posicao) =>{
        setLatitude(posicao.coords.latitude)
        setLongitude(posicao.coords.longitude)
      }
    )
  },[])

   useEffect(() => {
      if(latitude !== null && longitude !== null){
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then((resposta) => resposta.json())
        .then((local) => {
          setLocalizacao(local)
        })
      }
  },[longitude,latitude])

  useEffect(() =>{
    if(!cidade) return
    fetch(`https://nominatim.openstreetmap.org/search?q=${cidade}&format=json`)
    .then((resposta) => resposta.json())
    .then((dados) => {
        setLatitude(dados[0].lat)
        setLongitude(dados[0].lon)
    })

  },[cidade])

  function traduzirTempo(code){
    if (code === 0) return ["☀️", "Céu Limpo"]
    if (code < 3) return ["⛅", "Parcialmente Nublado"]
    if (code <= 48) return ["🌫️", "Neblina"]
    if (code <= 67) return ["🌧️", "Chuva"]
    if (code <= 77) return ["❄️", "Neve"]
    if (code <= 82) return ["⚡", "Pancadas de chuva"]
    return ["❓", "Desconhecida"]
  }
  useEffect(() => {
    if(latitude !== null && longitude !== null && localizacao){
       fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code`)
    .then((resposta) => resposta.json())
    .then((dados) => {
      const dias = dados.daily.time.map((data,index) => ({
        data,
        maxima: Math.round(dados.daily.temperature_2m_max[index]),
        minima: Math.round(dados.daily.temperature_2m_min[index]),
        codigo: dados.daily.weather_code[index]
      }))
      setPrevisaoDias(dias)
      setDadosClima(dados)
      const code =  dados.current.weather_code
      const [emoji, descricao] = traduzirTempo(code)
      setEmojiTempo(emoji)

      const tempoHora = dados.hourly.time.map((data,index) => ({
          data,
          hora: data.split("T")[1].split(":")[0],
          temperatura: Math.round(dados.hourly.temperature_2m[index]),
          codigo: Math.round(dados.hourly.weather_code[index])
      }))

      const proximasHoras = tempoHora.filter((item) => {
           return Number(item.hora) > horaAtual
        
      })
      setTempoHora(proximasHoras)

      setClima({
          cidade: 
              localizacao?.address?.city ||
              localizacao?.address?.town ||
              localizacao?.address?.village,
          estado: localizacao?.address?.state,
          temperatura: Math.round(dados.current.temperature_2m) + "°C",
          tempo: descricao,
          senTermica: `Sensação Térmica: ${Math.round(dados.current.apparent_temperature)}°C · ${dataFormatada}`,
          umidade: dados.current.relative_humidity_2m,
          vento: Math.round(dados.current.wind_speed_10m),
          visibilidade: (dados.current.visibility / 1000).toFixed(1)


        }
      )
    })
    } 
  },[latitude,longitude,localizacao]);

  function traduzirEmoji(code){
  if (code === 0) return "☀️"
  if (code < 3) return "⛅"
  if (code <= 48) return "🌫️"
  if (code <= 67) return "🌧️"
  if (code <= 77) return "❄️"
  if (code <= 82) return "⚡"
  return "❓"
}

function converterDia(data){
    const [ano, mes, dia] = data.split("-")

    const dataObj = new Date(ano, mes - 1, dia)

    const diasSemana = [
      "Dom",
      "Seg",
      "Ter",
      "Qua",
      "Qui",
      "Sex",
      "Sáb"
    ]

    return diasSemana[dataObj.getDay()]
}
 

  return (
    <main className="main">
      <section className="section-clima-atual">
        <div className="icone-clima">{emojiTempo}</div>
        {
          clima && clima.cidade && (
                <div key={clima.cidade}>
                    <div className="div-cidade-atual">
                      <LocationOnIcon></LocationOnIcon>
                      <h3>{clima.cidade},{clima.estado}.</h3>
                    </div>
                    <h4 className="titulo-temperatura">{clima.temperatura}</h4>
                    <p>{clima.tempo}</p>
                    <p>{clima.senTermica}</p>
                </div>
          )
        }
        <div>
          <ul className="lista-dados-clima">
            <li>
              <WaterDropIcon sx={{ color: "#3683d1" }}></WaterDropIcon>
              <p className="umidade-km">{clima?.umidade}%</p>
              <p>Umidade</p>
            </li>
            <li>
              <AirIcon sx={{ color: "#0b8f3e" }}></AirIcon>
              <p className="umidade-km">{clima?.vento} km/h</p>
              <p>Vento</p>
            </li>
            <li>
              <VisibilityIcon sx={{ color: "#7972D1" }}></VisibilityIcon>
              <p className="umidade-km">{clima?.visibilidade} km</p>
              <p>Visib</p>
            </li>
          </ul>
        </div>
      </section>
      <section className="section-clima-prox">
        <h4 className="titulo-prox-dias">Próximos 6 dias</h4>
        <ul className="lista-clima-prox">
          {
            previsaoDias.slice(1).map((tempo) =>{
              return(
               <li key={tempo.data}>
                  <p className="dias-sem">{converterDia(tempo.data)}</p>
                  <p>
                    {traduzirEmoji(tempo.codigo)}
                  </p>
                  <p>{tempo.minima}</p>
                  <p className="temp-maxima">{tempo.maxima}</p>
              </li>
              )
            })
          }
        </ul>
      </section>
      <section className="previsao-por-hora">
        <h4>PREVISÃO POR HORA</h4>
        <ul className="lista-clima-hora">
          {clima && clima.cidade && 
              <li>
                  <p className= "temp-hora">agora</p>
                  <p className= "hora-clima">{clima.temperatura}</p>
              </li>
          }
          {tempoHora && tempoHora.slice(0,6).map((item) =>(
              <li key={item.data}>
                <p className= "temp-hora">{item.hora}h</p>
                <p className= "hora-clima">{item.temperatura}°C</p>
              </li>
            ))
          }
        </ul>
      </section>
    </main>
  );
}

export default Principal;