import React, { useContext } from 'react'
import { OrderContext } from '../../contexts/OrderContextProvider'
import notificationSound from '/audio/alarm.mp3'

const Sidebar = () => {
  const { orderList, notification, updateOrder, setNotification } = useContext(OrderContext)

  const handleOrder = (ordersId) => {
    updateOrder(ordersId)
  }
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-title">
          <img src="/img/header/logo.png" alt="" className="logo-img" />
          <a href="#">FreeOrder</a>
        </div>
        {notification && (
          <>
            <Sound
              url={notificationSound}
              playStatus={Sound.status.PLAYING}
              onFinishedPlaying={() => setNotification(false)}
            />
            <div className={`sidebar-alarm`} id="order-alarm">
              <span className="material-symbols-outlined">notifications</span>
              <a href="#">새로운 주문이 있습니다.</a>
            </div>
          </>
        )}
        <div id="side-order-list">
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
      <audio id="alarm-sound" src="/audio/alarm.mp3" controls preload="auto"></audio>
    </>
  )
}

export default Sidebar