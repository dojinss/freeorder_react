import React, { useEffect, useState } from 'react';
import * as carts from '../../apis/cart'; // options API 호출
import * as options from '../../apis/option'; // options API 호출
import styles from './Product.module.css';
import { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContextProvider';
import ProductCart from '../../containers/product/ProductCart';
import * as Swal from '../../apis/alert'

const ProductList = ({ cateList, proList, onCategoryChange }) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const [optModalOpen, setOptModalOpen] = useState(false); // 옵션 선택 모달 열기
  const [selectedProduct, setSelectedProduct] = useState(null); // 선택된 상품
  const [selectedOption, setSelectedOption] = useState([]); // 선택된 옵션
  const [option, setOption] = useState(null);  // 선택한 상품의 옵션
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격
  const [cartList, setCartList] = useState([])    // 장바구니 목록
  const [optionList, setOptionsList] = useState([])


  const { isLogin, userInfo } = useContext(LoginContext)
  const usersId = userInfo?.username

  // 옵션 목록 불러오기
  const optionLoad = async () => {
    if (selectedProduct == null) return
    try {
      const response = await options.read(selectedProduct.optionsId)
      const data = response.data;
      const status = response.status;
      if (status === 200) {
        setOption(data);  // 옵션 리스트 상태 업데이트
      }
    } catch (error) {
      console.error('옵션 불러오기 오류:', error);
    }
  };

  // 옵션 목록을 한 번만 불러오기
  useEffect(() => {
    optionLoad();
  }, [selectedProduct]);

  // 모달 열기 함수
  const openModal = () => {
    setModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
  };

  // 아이템 옵션 열기 함수
  const openOptSelect = (product) => {
    console.dir(product)
    if (product.optionsId != null) {
      setSelectedProduct(product);  // 선택된 상품 설정
      setSelectedOption(product.option);  // 기존 선택된 옵션 초기화
      setOptModalOpen(true);  // 옵션 모달 열기
      setOptionsList(product.option.itemList)
    } else {
      const newProduct = {
        id: product.id,
        quantity: 1
      }
      addCart(newProduct)
    }

  }

  // 아이템 옵션 닫기 함수
  const closeOptSelect = () => {
    setOptModalOpen(false);  // 옵션 모달 닫기
  };



  // 체크박스 상태 변경 처리
  const handleOptionSelect = (id) => {
    setOptionsList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
    console.dir(optionList)
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
  const addCart = async (product) => {
    console.log(`장바구니 정보`)
    console.dir(product)
    // 장바구니에 추가
    const response = await carts.insert(product, usersId)
    const data = response.data
    const status = response.status
    if (status == 200) {
      // console.log(`data : ${data}`)
      cartsLoad()
    }

  }

  // 장바구니 목록 불러오기
  const cartsLoad = async () => {
    console.log(`장바구니 목록 불러오기`)
    const response = await carts.list()
    const data = response.data
    const status = response.status
    if (status == 200) {
      setCartList(data)
      calcPrice(data)
    }
  }
  // 장바구니 하나 삭제
  const removeCart = async (CartsId) => {
    const response = await carts.remove(CartsId)
    const data = response.data
    const status = response.status
    if (status == 200) {
      Swal.alert(`상품이 삭제되었습니다.`, `상품 삭제 완료`, "success")
      cartsLoad()
    }
  }
  const calcPrice = (data) => {
    // 총 가격 업데이트
    let total = 0
    data.map((cart) => {
      let itemTotal = Number(cart.price)

      cart.optionList.map((option) => {
        itemTotal += Number(option.price)
      })
      total += (itemTotal * Number(cart.amount))
    })
    setTotalPrice(total);
  }

  // 증가
  const amountIncrement = async (id) => {
    const response = await carts.increment(id)
    const data = response.data
    const status = response.status
    if (status == 200) {
      cartsLoad()
    }
  }

  // 감소
  const amountDecrement = async (id) => {
    const response = await carts.decrement(id)
    const data = response.data
    const status = response.status
    if (status == 200) {
      cartsLoad()
    }
  }
  useEffect(() => {
    if (isLogin) {
      cartsLoad()
    }
  }, [totalPrice, isLogin])


  return (
    <div className={styles.container}>
      <div className={styles['main-container']}>
        {/* 왼쪽 사이드 - 카테고리 */}
        <div className={styles['left-side']}>
          <div className={styles['category-list']}>
            <div className={styles['cate-wrap']}>
              <div className={styles['tab-menu-container']}>
                <ul className={styles['tab-menu']} id="cate-tab-menu">
                  <li>
                    <a href="/" className={styles['tab-menu-item']}>
                      <span>전체</span>
                    </a>
                  </li>
                  {cateList.map((cate) => (
                    <li key={cate.id}>
                      <a
                        className={styles['tab-menu-item']}
                        onClick={() => onCategoryChange(cate.id)}
                      >
                        <span>{cate.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['cate-btn']}>
                <button
                  type="button"
                  className={styles['btn-left']}
                  id="cate-left-btn"
                >
                  ◀
                </button>
                <button
                  type="button"
                  className={styles['btn-right']}
                  id="cate-right-btn"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className={styles['product-page']}>
            <div className={styles['product-header']}>
              <h1>상품 목록</h1>
              <a className={styles['add-product-btn']} href="/products/insert">
                + 상품 추가
              </a>
            </div>
            <div className={styles['product-list']}>
              {proList && proList.length > 0 ? (
                proList.map((product) => (
                  <div
                    className={styles['product-item']}
                    key={product.id}
                    onClick={() => openOptSelect(product)} // 상품 클릭 시 옵션 모달 열기
                  >
                    <div className={styles['product-image-placeholder']}>
                      <img
                        src={`/api/pimg?id=${product.id}`}
                        alt={product.name}
                        width="100%"
                        height="100%"
                      />
                    </div>
                    <span className={styles['product-name']}>{product.name}</span>
                    <span className={styles['product-price']}>
                      {product.price}원
                    </span>
                  </div>
                ))
              ) : (
                `상품이 없습니다.`
              )}
            </div>
          </div>
        </div>
        <ProductCart
          cartList={cartList}
          styles={styles}
          openModal={openModal}
          totalPrice={totalPrice}
          removeCart={removeCart}
          amountIncrement={amountIncrement}
          amountDecrement={amountDecrement}
        />
      </div>

      {/* 세팅 모달 */}
      {ModalOpen && (
        <div className={ModalOpen ? `${styles.show} ${styles['modal']}` : ``}>
          <div
            className={styles['modal-container']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles['modal-header']}>
              <h5>상품 설정</h5>
              <span className={styles['close-btn']} onClick={closeModal}>
                &times;
              </span>
            </div>

            <div className={styles['modal-section']}>
              <h3 className={styles['section-title']}>상품</h3>
              <div className={styles['card-container']}>
                <a href="/products/insert" className={styles['card']}>
                  <img src="/img/상품 정보 수정.png" alt="상품 등록" />
                  <h4>상품 등록</h4>
                </a>
                <a href="/products/updateList" className={styles['card']}>
                  <img src="/img/상품 정보 수정.png" alt="상품 정보 수정" />
                  <h4>상품 정보 수정</h4>
                </a>
                <a href="/products/locate" className={styles['card']}>
                  <img src="/img/상품 배치 수정.png" alt="상품 배치 수정" />
                  <h4>상품 배치 수정</h4>
                </a>
              </div>
            </div>

            <div className={styles['modal-section']}>
              <h3 className={styles['section-title']}>카테고리</h3>
              <div className={styles['card-container']}>
                <a href="/categories" className={styles['card']}>
                  <img src="/img/카테고리 정보수정.png" alt="카테고리 정보 수정" />
                  <h4>카테고리 정보 수정</h4>
                </a>
                <a href="/categories/seqList" className={styles['card']}>
                  <img src="/img/카테고리 순서변경.png" alt="카테고리 순서 변경" />
                  <h4>카테고리 순서 변경</h4>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 옵션 아이템 선택 모달 */}
      {optModalOpen && selectedProduct && (
        <div
          className={optModalOpen ? `${styles.show} ${styles.modal}` : ``}
        >
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
                        {option.itemList && option.itemList.length > 0 ? (
                          option.itemList.map((item) => (
                            <label
                              key={item.id}
                              className={styles['opt-item']}
                              htmlFor={item.id}
                            >
                              <input
                                type="checkbox"
                                defaultChecked={selectedOption?.id === item.id}
                                onChange={(e) => handleOptionSelect(item.id)}
                                id={item.id}
                              />
                              <span>{item.name}</span>
                              <div className={styles['item-price']}>
                                {item.price.toLocaleString()}원
                              </div>
                            </label>
                          ))
                        ) : (
                          <p>아이템이 없습니다.</p>
                        )}
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
      )}
    </div>
  );
};

export default ProductList;
