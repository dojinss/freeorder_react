import React, { createContext, useEffect, useState } from 'react';

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import * as orders from '../apis/order';
import * as Swal from '../apis/alert';

export const OrderContext = createContext()
const OrderContextProvider = ({ children }) => {

  const [orderList, setOrderList] = useState([]);
  const [notification, setNotification] = useState(false);

  // 주문 접수하기
  const updateOrder = async (ordersId) => {
    const order = {
      id: ordersId,
      status: "COMPLETE"
    }
    const response = await orders.update(order)
    const data = response.data
    const status = response.status
    if (status == 200) {
      Swal.alert(`주문이 접수 되었습니다.`, `주문 접수 완료`, 'success')
      orderLoad()
    }
  }
  // 1. 기존 주문 목록 가져오기
  const orderLoad = async () => {
    const response = await orders.list()
    const data = response.data
    const status = response.status
    if (status == 200) {
      setOrderList(data)
    }
  }
  useEffect(() => {


    // 2. WebSocket 연결 설정
    const setupWebSocket = () => {
      const socket = new SockJS("/wsapi/ws");
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        console.log("WebSocket Connected");

        // 주문 채널 구독
        stompClient.subscribe("/orders", (messageOutput) => {
          const newOrder = JSON.parse(messageOutput.body);
          console.log("새 주문 수신:", newOrder);
          setOrderList((prevOrders) => [...prevOrders, newOrder]); // 새로운 주문 추가
          setNotification(true); // 알림 표시
        });
      });

      // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
      return () => {
        stompClient.disconnect(() => {
          console.log("WebSocket Disconnected");
        });
      };
    };

    // 기존 주문 목록 가져오기와 WebSocket 설정 실행
    orderLoad();

    return () => {
      setupWebSocket();
    };
  }, []);

  // 알림을 닫는 함수
  const handleNotificationClose = () => {
    setNotification(false);
  };

  return (
    <OrderContext.Provider value={{ orderList, handleNotificationClose, notification, updateOrder, setNotification }}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderContextProvider