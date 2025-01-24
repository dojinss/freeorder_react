import React, { useEffect, useState } from 'react';
import * as Swal from '../../apis/alert';

const ProductCart = ({ cartList, styles, openModal, totalPrice, removeCart, amountDecrement, amountIncrement, allRemoveCart }) => {

  const [newCartList, setNewCartList] = useState(cartList ?? [])

  // 값 변경 핸들러
  const handleChange = (id, newValue) => {
    setNewCartList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, amount: newValue } : item
      )
    );
  };

  // 증가/감소 핸들러
  const handleIncrement = (id) => {
    amountIncrement(id)
  };
  
  const handleDecrement = (id) => {
    amountDecrement(id)
  };

  // 전체 삭제 핸들러
  const handleAllDelete = () => {
    Swal.confirm(`장바구니를 비우시겠습니까?`,`모든 항목이 삭제됩니다.`,`warning`,allRemoveCart)
  }

  useEffect(()=>{
    setNewCartList(cartList)
  },[cartList])

  // 결제 목록에서 상품 삭제
  const handleRemoveProduct = async (name, CartsId) => {
    Swal.confirm(`삭제하시겠습니까?`, `[${name}] 상품이 삭제됩니다.`, 'warning', async () => await removeCart(CartsId))
  }
  return (
    <>
      <div className={styles['right-side']}>
        <div className={styles['right-header']}>
          <button className={styles['settings-btn']} onClick={()=>openModal()}>
            ⚙️
          </button>
          <button
            className={styles['delete-all-btn']}
            onClick={() => handleAllDelete()}
          >
            전체 삭제
          </button>
        </div>
        <div>
          <ul className={styles['cart-list']}>
            {newCartList.length > 0 ? (
              newCartList.map((cart, index) => (
                <li key={cart.id}>
                  <div className={styles["cart-top"]}>
                    <button className={styles["cart-item-del-btn"]} onClick={() => handleRemoveProduct(cart.productName, cart.id)}>X</button>
                    <span className={styles["cart-menu"]}>{cart.productName}</span>
                    <div className={styles["btn-box"]}>
                      <button className={styles["button"]} onClick={()=>handleDecrement(cart.id)}>-</button>
                      <input type="text" className={styles["cart-quantity"]} value={cart.amount} readOnly/>
                      <button className={styles["button"]} onClick={()=>handleIncrement(cart.id)} >+</button>
                    </div>
                    <span className={styles["amount"]}>{Number(cart.price).toLocaleString("ko-KR")}원</span>
                  </div>

                  <ul>
                    {
                      cart.optionList.map((option) => (
                        <li key={option.id}>
                          {/* {option.name}{option.price.toLocaleString()}원 */}
                          <span className={styles["cart-option"]}>ㄴ{option.name} :
                            <i className={styles["cart-option-price"]}>{Number(option.price).toLocaleString("ko-KR")}원</i>
                          </span>
                        </li>
                      ))
                    }

                  </ul>
                </li>
              ))
            ) : (
              <p>상품을 선택해주세요.</p>
            )}
          </ul>
        </div>

        <div className={styles['payment-buttons']}>
          <button className={styles['card-pay']} onClick={() => console.log('카드 결제')}>
            <span className='material-symbols-outlined'>credit_card</span>
            <p>카드 결제</p>
          </button>
          <button className={styles['cash-pay']} onClick={() => console.log('현금 결제')}>
            <span className='material-symbols-outlined'>paid</span>
            <p>현금 결제</p>
          </button>
        </div>
        <div className={styles['total-price']}>
          총 가격: <span>{totalPrice.toLocaleString()}</span>원
        </div>
      </div>
    </>
  )
}

export default ProductCart