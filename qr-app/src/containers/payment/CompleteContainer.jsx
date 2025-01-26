import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as payments from '../../apis/payment';
import PaymentComplete from '../../components/Payment/PaymentComplete';
import { Stomp } from "@stomp/stompjs"
const CompleteContainer = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  // 웹소켓
  const stompClient = Stomp.client("/ws");

  const paymentType = searchParams.get("paymentType")
  const ordersId = searchParams.get("orderId")
  const paymentKey = searchParams.get("paymentKey")
  const amount = searchParams.get("amount")

  const payRef = useRef(false)

  const paymentSend = async () => {
    const response = await payments.confirm({
      paymentType : paymentType,
      ordersId : ordersId,
      paymentKey : paymentKey,
      amount : amount
    })
    const data = response.data
    const status = response.status
    if (status == 200) {
      console.log(`결제완료`)
    }
  }

  useEffect(() => {
    if (payRef.current) return
    payRef.current = true
    paymentSend()
  }, [])
  
  // 주문 전송
  function sendMessage() {
    console.log("주문 전송 : " + ordersId)
    let data = {
      id: ordersId
    }
    if (stompClient) {
      stompClient.send(`/app/order.addorder/${ordersId}`, {}, JSON.stringify(data));
    }
  }


  // 웹소켓 연결
  useEffect(() => {
    if (!ordersId) return; // ordersId가 없으면 연결하지 않음

    const setupWebSocket = () => {
      stompClient.connect({}, () => {
        console.log("WebSocket Connected");
        sendMessage(); // 연결 후 메시지 전송
      });

      // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
      return () => {
        stompClient.disconnect(() => {
          console.log("WebSocket Disconnected");
        });
      };
    };

    return setupWebSocket();
  }, [ordersId]); // ordersId가 변경될 때마다 WebSocket 연결

  return (
    <PaymentComplete/>
  )
}

export default CompleteContainer