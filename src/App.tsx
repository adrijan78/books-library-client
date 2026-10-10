import './App.css'
import { HomePage } from './layouts/home-page/HomePage'
import { Footer } from './layouts/navigation-bars/Footer'

import { NavigationBar } from './layouts/navigation-bars/NavigationBar'

function App() {
  return (
    <>
        <NavigationBar/>
        <HomePage/>  
        <Footer/>       
    </>
  )
}

export default App
