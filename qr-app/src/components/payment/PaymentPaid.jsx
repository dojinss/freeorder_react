import { ANONYMOUS, loadPaymentWidget } from "@tosspayments/payment-widget-sdk"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as payments from '../../apis/payment'
import { LoginContext } from '../../contexts/LoginContextProvider'
import './css/payments.css'
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
const customerKey = ANONYMOUS

const PaymentPaid = () => {

  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(socket);

  const [paymentWidget, setPaymentWidget] = useState(null)

  const [price, setPrice] = useState(0)
  const [title, setTitle] = useState('')
  const [ordersId, setOrdersId] = useState('')

  const { usersId, orderType } = useContext(LoginContext)

  const navigator = useNavigate()

  const orderRef = useRef(false)

  // 결제창 호출하기
  const goPayments = async () => {
    console.log(`결제하기 호출`)
    try {
      await paymentWidget?.requestPayment({
        orderId: ordersId,
        orderName: title,
        customerName: "김토스",
        customerEmail: "customer123@gmail.com",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      })
    } catch (err) {
      console.log(err)
    }
  }

  // 결제취소
  const cancelPayments = () => {
    navigator(`/cart`)
  }

  useEffect(() => {
    (async () => {
      // 한번만 실행
      if (orderRef.current) return
      orderRef.current = true
      // 주문번호 생성후 불러오기
      const response = await payments.toPaid(usersId, orderType)
      const data = response.data
      const status = response.status
      if (status == 200) {
        setPrice(data.total)
        setTitle(data.title)
        setOrdersId(data.ordersId)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey)

      // console.log(`paymentWidget`)
      // console.log(paymentWidget)
      // console.dir(paymentWidget)

      paymentWidget.renderPaymentMethods("#payment-widget", price)

      setPaymentWidget(paymentWidget)
    })()
  }, [price])


  // 주문 전송
  function sendMessage() {
    console.log("주문 전송 : " + ordersId)
    let data = {
      id: ordersId
    }
    if (stompClient) {
      stompClient.send("/app/order.addorder/" + ordersId, {}, JSON.stringify(data));
    }
  }

  // 웹소켓
  useEffect(() => {
    // 2. WebSocket 연결 설정
    const setupWebSocket = () => {

      stompClient.connect({}, () => {
        console.log("WebSocket Connected");
      });

      // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
      return () => {
        stompClient.disconnect(() => {
          console.log("WebSocket Disconnected");
        });
      };
    };
    return () => {
      setupWebSocket();
    };
  }, []);

  return (
    <>
      <div id="payment-widget" />
      <div className="payment-btn-box">
        {/* <!-- 결제하기 버튼 --> */}
        <button className="button" id="payment-button" onClick={sendMessage}>결제하기</button>
        {/* <!-- 결제 취소 버튼 --> */}
        <button className="button" id="cart-button" onClick={cancelPayments}>결제취소</button>
      </div>
    </>
  )
}

export default PaymentPaid