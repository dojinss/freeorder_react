import React, { useEffect, useState } from 'react'
import PaymentList from '../../components/payment/PaymentList'
import * as payments from '../../apis/payment'

const PaymentContainer = () => {

  const [payList, setPayList] = useState([])
  const [payment, setPayment] = useState(null)

  // 결제내역 목록 불러오기
  const payLoad = async (searchOptions) => {
    console.log(`호출하기전 서치옵션`)
    console.dir(searchOptions)
    const response = await payments.list(searchOptions)
    const data = response.data
    const status = response.status
    if (status == 200) {
      setPayList(data)
    }
  }

  // 결제 내역 조회
  const paymentRead = async (paymentsId) => {
    const response = await payments.select(paymentsId)
    const data = response.data
    const status = response.status
    console.log(data)
    if (status == 200) {
      setPayment(data)
    }
  }

  useEffect(() => {
    payLoad()
  }, [])

  return (
    <PaymentList
      payList={payList}
      payLoad={payLoad}
      paymentRead={paymentRead}
      payment={payment}
    />
  )
}

export default PaymentContainer