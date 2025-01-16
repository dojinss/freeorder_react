import React from 'react'
import Header from '../../components/header/Header'
import LeftMenu from '../../components/leftmenu/LeftMenu'
import Footer from '../../components/footer/Footer'
import Sidebar from '../../components/sidebar/Sidebar'
import PromotionContainer from '../../containers/promotion/PromotionContainer'

const Promotion = () => {
  return (
    <>
      <div className="layout">
        <Header />
        <LeftMenu />
        <PromotionContainer />
        <Footer />
      </div>
      <Sidebar />
    </>
  )
}

export default Promotion