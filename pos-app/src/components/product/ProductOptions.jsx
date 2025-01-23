import React, { useState } from 'react'

const ProductOptions = ({ optModalOpen, option, styles, closeOptSelect, selectedProduct, addCart }) => {

  console.log(`선택된 옵션`)
  console.dir(option)
  const [optionList, setOptionsList] = useState([])
  // 체크박스 상태 변경 처리
  const handleOptionSelect = (id) => {
    setOptionsList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  // 옵션 선택 완료 후 결제창으로 상품 추가
  const handleOptionConfirm = async () => {
    console.log(`장바구니에 추가`)
    const product = {
      id: selectedProduct.id,
      quantity: 1,
      option: {
        id: selectedProduct.optionsId,
        itemList: optionList
      }
    }
    addCart(product)

    // 옵션 선택 모달 닫기
    closeOptSelect();
  };
  return (
    <div className={optModalOpen ? `${styles.show} ${styles.modal}` : ``}>
      <div
        className={styles['modal-container']}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['so-container']}>
          <div className={styles['so-option-title']}>
            <h5>옵션 선택</h5>
            <span
              className="darkgray material-symbols-outlined"
              onClick={closeOptSelect}
            >
              close
            </span>
          </div>

          <div className={styles['so-option-select']}>

            {
              option != null ? (
                <div key={option.id} className={styles['so-option-card']}>
                  <div className={styles['opt-items']}>
                    {
                      option?.itemList.map((item) => (
                        <label
                          key={item.id}
                          className={styles['opt-item']}
                          htmlFor={item.id}
                        >
                          <input
                            type="checkbox"
                            onChange={(e) => handleOptionSelect(item.id)}
                            id={item.id}
                          />
                          <span>{item.name}</span>
                          <div className={styles['item-price']}>
                            {item.price.toLocaleString()}원
                          </div>
                        </label>
                      ))
                    }
                  </div>
                </div>
              ) : (
                <p>옵션이 없습니다.</p>
              )}
          </div>

          <div className={styles['option-btns']}>
            <button
              className={styles['select-btn']}
              onClick={handleOptionConfirm}
            >
              옵션 선택 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOptions