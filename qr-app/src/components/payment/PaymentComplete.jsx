import React from 'react'
import { Link } from 'react-router-dom'
import './css/payments.css'

const PaymentComplete = () => {
  return (
    <div className="container" layout:fragment="content">
      <div className="allcenter">
        <div className="flex flex-column justify-content-center align-items-center">
          {/* <!-- 완료 메시지 --> */}
          <div className="payComplete"><img src="/img/payComplete.png" alt="결제 완료" width="300" /></div>
          <div className="compl-text flex align-items-center justify-content-center">결제 완료!</div>
          {/* <!-- 결제 영수증 출력 --> */}
          {/* <!-- 확인, 결제 내역 --> */}
          <div className="ok-btn-border flex flex-column align-items-center justify-content-center">
            <Link to="/list" className="ok-button white mb-5"><span
              className="ok-button-text white flex flex-column justify-content-center align-items-center mt-2">OK</span></Link>
            <Link to="/order/list" className="pay-list white"><span
              className="color-white flex flex-column justify-content-center align-items-center mt-2">결제
              내역</span></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentComplete