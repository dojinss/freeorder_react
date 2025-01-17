import React, { useEffect, useState } from 'react'
import ProductInsert from '../../components/product/ProductInsert'
import * as products from '../../apis/product'
import * as categories from '../../apis/category'
import { useNavigate } from 'react-router-dom'

const ProductInsertContainer = () => {

  const navigate = useNavigate()
  const [cateList, setCateList] = useState([])
  
  // 카테고리 목록 불러오기
  const cateLoad = async () => {
    try {
      const response = await categories.list()
      const data = response.data
      const status = response.status
      if (status == 200) {
        setCateList(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const proInsert = async (formData, headers) => {
    try {
      const response = await products.insert(formData, headers)
      const data = await response.data
      console.log(data);
      alert('상품 등록 완료')
      
      // 상품 목록으로 이동
      navigate('/')
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    cateLoad()
    return () => {}
  }, [])
  

  return (
    <>
    <ProductInsert
    proInsert={proInsert}
    cateList={cateList}
    />
    </>
  )
}

export default ProductInsertContainer