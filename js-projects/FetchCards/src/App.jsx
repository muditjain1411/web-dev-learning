import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import logo from "./assets/logo.svg"
import Card from './components/Card'

function App() {
  let [card, setcard] = useState([])
  useEffect(() => {
    (async function () {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      setcard(data);
    })();
  }, []);


  return (
    <>
      <Navbar logoSrc={logo} name="CARDBOX" />
      <div className='flex flex-col md:flex-row gap-[10px] flex-wrap items-center-safe md:items-stretch justify-center pt-3.5'>
        {card.map((post) => (
          <Card key={post.id} userid={post.userId} title={post.title} desc={post.body} src={`./card image/${Math.floor(Math.random()*10)+1}.png`}/>
        ))}
      </div>
    </>
  )
}

export default App
