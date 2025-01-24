import React from 'react'
import * as format from '../../utils/format'

const PaymentRead = ({ payment, styles }) => {
  if (payment == null) {
    return
  }
  return (
    <div className={styles['ls-detail-part']}>
      <div className={styles['ls-pay-compl']}>
        {
          payment.status == 'PAID' ?
            <h3>결제 완료</h3>
            :
            ''
        }
        {
          payment.status == 'REFUND' ?
            <h3>환불</h3>
            :
            ''
        }
        <h4>결제 시간 : <span th:text="${#dates.format(,'yyyy-MM-dd (EE) hh:mm')}">{format.formatTotalDate(payment.paidAt)}</span></h4>
      </div>
      <div className={styles['ls-total-pay']}>
        <span className={styles['order-number']}>{`주문번호 : ${payment.order.orderNumber}`}</span>
        <div className={styles['total-box']}>
          <span className={styles['t-price-name']}>총 결제 금액</span>
          <span className={styles['t-price']}>{payment.order.totalPrice.toLocaleString()}원</span>
        </div>
      </div>
      {
        payment.status == 'PAID' ?
          <div className={styles['ls-cancel-price']}>
            <h4>환불 가능 금액</h4>
            <h4>{payment.order.totalPrice.toLocaleString()}</h4>
          </div>
          :
          ''
      }
      {
        payment.status == 'REFUND' ?
          <div className={styles['ls-cancel-total']}>
            <h4>환불된 금액</h4>
            <h4>{payment.order.totalPrice.toLocaleString()}</h4>
          </div>
          :
          ''
      }
      <div className={styles['ls-btns']}>
        {
          payment.status == 'PAID' ?
            <button type="button" className={styles['ls-save-btn']} id="cancel-order-btn">환불</button>
            :
            ''
        }
        {
          payment.status == 'REFUND' ?
            <button type="button" className={styles['ls-delete-btn']} id="del-order-btn">삭제</button>
            :
            ''
        }
      </div>
      <div>
        <button type="button" className={styles['ls-re-btn']} id="re-order-btn">주문 다시 담기</button>
      </div>
      <div className={styles['ls-detail-pay']}>
        <h4>결제 수단</h4>
        <h3 th:text="${payment.paymentMethod}">카드</h3>
      </div>
      <div className={styles['ls-pay-list']}>
        <h4>결제 내역</h4>
        {
          payment.order.itemList.map((item) => (
            <div className={styles['ls-list-detail']}>
              <div className={styles['main']}>
                <div className={styles['main-top']}>
                  <span>{`${item.name} X ${item.quantity}`}</span>
                  <span>{item.price.toLocaleString()}원</span>
                </div>
                {item.optionList.map((option) => (
                  <span className={styles['opt-price']}>
                    {`ㄴ${option.name}(${option.price.toLocaleString()}원)`}
                  </span>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default PaymentRead