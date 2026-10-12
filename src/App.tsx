import { Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './layouts/home-page/HomePage'
import { Footer } from './layouts/navigation-bars/Footer'

import { NavigationBar } from './layouts/navigation-bars/NavigationBar'
import { SearchBooksPage } from './layouts/search-books-page/SearchBooksPage'

function App() {
  return (
    <>
        <NavigationBar/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/search" element={<SearchBooksPage/>}/>
        </Routes>
        <Footer/>       
    </>
  )
}

export default App
