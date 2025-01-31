import React, { useState } from 'react'
import styles from './Payment.module.css'
import * as format from '../../utils/format'
import PaymentRead from './PaymentRead'

const PaymentList = ({ payList, payLoad, paymentRead, payment }) => {

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [method, setMethod] = useState("ALL")
  const [date, setDate] = useState(7)

  /**
   * 검색어 설정
   */
  // 기간 선택
  const handleDate = (e) => {
    const value = e.target.value
    setDate(value)
  }
  // 결제 방식 선택
  const handleMethod = (e) => {
    const value = e.target.value
    setMethod(value)
  }
  // 최소 금액 변경
  const handleMinPrice = (e) => {
    const value = e.target.value
    setMinPrice(value)
  }
  // 최대 금액 변경
  const handleMaxPrice = (e) => {
    const value = e.target.value
    setMaxPrice(value)
  }

  // 검색 폼 전송
  const onSubmitSearch = (e) => {
    e.preventDefault();
    let formData = new FormData()
    formData.append("date", date)
    formData.append("paymentMethods", method)
    formData.append("minPrice", minPrice)
    formData.append("maxPrice", maxPrice)
    payLoad(formData)
  }

  return (
    <>
      <div className={styles['ls-container']}>
        <div className={styles['ls-left-container']}>
          <div className={styles['ls-back-title']}>
            <div className={styles['ls-payment-title']}>
              <h3>결제 내역</h3>
            </div>
          </div>
          <form onSubmit={(e) => onSubmitSearch(e)}>
            <div className={styles['ls-filter-part']}>
              <div>
                <select value={date} onChange={(e) => handleDate(e)}>
                  <option value="1">오늘</option>
                  <option value="7">1주</option>
                  <option value="30">1달</option>
                  <option value="365">1년</option>
                </select>
                <select value={method} onChange={(e) => handleMethod(e)}>
                  <option value="ALL">전체</option>
                  <option value="CASH">현금</option>
                  <option value="CARD">카드</option>
                </select>
              </div>
              <div className={styles['ls-input-filter']}>
                <input type="text" name="minPrice" value={minPrice} onChange={(e) => handleMinPrice(e)} placeholder="최소금액" />
                <input type="text" name="maxPrice" value={maxPrice} onChange={(e) => handleMaxPrice(e)} placeholder="최대금액" />
                <button type="submit" className={styles['ls-read-btn']} id="search-payment-btn">조회</button>
              </div>
            </div>
          </form>

          <ul className={styles['ls-list-part']}>
            {
              payList.map((payment) => (
                <li key={payment.id}>
                  <div className={styles['ls-time']}>
                    <p>{format.getDayOfWeek(payment.paidAt)}</p>
                    <p>{format.formatDate(payment.paidAt)}</p>
                  </div>
                  <div className={styles['ls-detail-link']} onClick={() => paymentRead(payment.id)}>
                    <div className={styles['ls-payment']}>{payment.paymentMethod}</div>
                    <div className={styles['ls-simple']}>
                      <h3>{payment.order.totalPrice.toLocaleString()}원</h3>
                      <h5>{payment.order.title}</h5>
                    </div>
                    <div className={styles['ls-table']}>
                      <h5>{format.formatHour(payment.paidAt)}</h5>
                      <h6>주문번호 : {payment.order.orderNumber}</h6>
                    </div>
                  </div>
                </li>
              ))
            }
            {
              payList == null &&
              (
                <li>
                  <span>결제 내역이 없습니다.</span>
                </li>
              )
            }
          </ul>

        </div>
        <div className={styles['ls-right-container']} id="right-payment-info">
          <PaymentRead
            payment={payment}
            styles={styles}
          />
        </div>
      </div>
    </>
  )
}

export default PaymentList