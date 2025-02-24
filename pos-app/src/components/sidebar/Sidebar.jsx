import React, { useContext, useEffect, useRef } from 'react'
import { OrderContext } from '../../contexts/OrderContextProvider'
import notificationSound from '/audio/alarm.mp3'

const Sidebar = () => {
  const { orderList, notification, updateOrder, setNotification } = useContext(OrderContext)

  const audioRef = useRef(null); // 오디오 재생을 위한 참조
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    if (notification && audioRef.current) {
      audioRef.current.play(); // 알림음 재생
      audioRef.current.onended = () => setNotification(false); // 알림음 종료 후 상태 변경
    }
  }, [notification]);

  const handleOrder = (ordersId) => {
    updateOrder(ordersId);
  };
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-title">
          <img src="/img/header/logo.png" alt="" className="logo-img" />
          <a href="#">FreeOrder</a>
        </div>
        {notification && (
          <>
            <div className={`sidebar-alarm`} id="order-alarm">
              <span className="material-symbols-outlined">notifications</span>
              <a href="#">새로운 주문이 있습니다.</a>
            </div>
          </>
        )}
        <div id="side-order-list"
          ref={listRef}
        >
          {
            orderList.map((order) => (
              <div key={order.id} className={`order-list sidebar-list ${order.status == 'COMPLETE' ? "done" : ""}`}>
                <span className="order-icon">{order.orderNumber}</span>
                <div className="order-type here">
                  {
                    order.type == 'HERE' ?
                      <i>매장</i>
                      :
                      <i>포장</i>
                  }
                </div>
                <div className="title-price">
                  <span className="order-title">{order.title}</span>
                  <span className="order-price">{order.totalPrice.toLocaleString()}원</span>
                </div>
                {
                  order.status == 'COMPLETE' ?
                    <button className="done-btn">접수완료</button>
                    :
                    <button className="complete-btn" onClick={() => handleOrder(order.id)} >주문접수</button>
                }
              </div>
            ))
          }
        </div>
      </div>
      <audio ref={audioRef} src={notificationSound} preload="auto" />
    </>
  )
}

export default Sidebar