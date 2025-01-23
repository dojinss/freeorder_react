import React, { useContext, useEffect, useState } from 'react'
import ProductList from '../../components/product/ProductList'
import * as products from '../../apis/product'
import * as categories from '../../apis/category'
import * as options from '../../apis/option'

const ProductContainer = () => {

  const [cateList, setCateList] = useState([])
  const [proList, setProList] = useState([])
  const [filteredProList, setFilteredProList] = useState([]) // 필터링된 상품 목록
  const [optList, setOptList] = useState([])

  // 옵션 목록 불러오기
  const optLoad = async () => {
    try {
      const response = await options.list()
      const data = response.data
      const status = response.status
      if ( status == 200 ){
        setOptList(data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  // 카테고리 목록 불러오기
  const cateLoad = async () => {
    try {
      const response = await categories.list()
      const data = response.data
      const status = response.status
      if (status === 200) {
        setCateList(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 상품 목록 불러오기 (카테고리별로 필터링 없이 전체 상품 불러오기)
  const listLoad = async () => {
    try {
      const response = await products.list()
      const data = response.data
      const status = response.status
  
      if (status === 200 && data.length > 0) {
        setProList(data)
        setFilteredProList(data)  // 전체 상품 목록을 필터링된 목록에 저장
      } else {
        console.log('상품 목록이 없습니다.')
        setProList([])
        setFilteredProList([])  // 빈 배열로 설정
      }
    } catch (error) {
      console.error('상품 목록 로드 오류:', error)
    }
  }
  
  // 카테고리 변경 시 필터링된 상품 목록 업데이트
  const handleCategoryChange = (cateId) => {
    if (cateId) {
      // 선택된 카테고리로 필터링
      const filtered = proList.filter(product => product.categoriesId === cateId)
      setFilteredProList(filtered)
    } else {
      // "전체" 선택 시 전체 목록으로 복원
      setFilteredProList(proList)
    }
  }

  // 컴포넌트가 처음 렌더링될 때 카테고리 목록과 상품 목록 불러오기
  useEffect(() => {
    optLoad()
    cateLoad()
    listLoad()
  }, [])

  return (
    <>
      <ProductList 
        optLoad={optList}
        cateList={cateList}
        proList={filteredProList}  // 필터링된 상품 목록 전달
        onCategoryChange={handleCategoryChange}  // 카테고리 변경 시 핸들러
      />
    </>
  )
}

export default ProductContainer
