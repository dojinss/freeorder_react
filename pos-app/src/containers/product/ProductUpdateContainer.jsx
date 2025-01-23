import React, { useState, useEffect } from 'react';
import ProductUpdate from '../../components/product/ProductUpdate';
import * as products from '../../apis/product';
import * as options from '../../apis/option'
import { useParams, useNavigate } from 'react-router-dom';

const ProductUpdateContainer = () => {
  const { id } = useParams(); // URL에서 id 추출
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    categoriesId: '',
    optionsId: '',
    productFile: null,
  });
  const [cateList, setCateList] = useState([]); // 카테고리 목록
  const [optList, setOptList] = useState([])

  // 상품 정보 가져오기
  const getProductDetails = async () => {
    try {
      const response = await products.getById(id); // 상품 상세 조회
      setProduct(response.data); // 상품 정보 설정
    } catch (error) {
      console.error('상품을 불러오는 데 실패했습니다.', error);
    }
  };

  // 옵션 목록 불러오기
  const optLoad = async () => {
    try {
      const response = await options.list()
      const data = response.data
      const status = response.status
      if (status == 200) {
        setOptList(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 카테고리 목록 가져오기
  const getCategories = async () => {
    try {
      const response = await products.getCategories(); // 카테고리 목록 조회 API
      setCateList(response.data); // 카테고리 목록 설정
    } catch (error) {
      console.error('카테고리를 불러오는 데 실패했습니다.', error);
    }
  };

  // 상품 수정 처리 함수
  const handleUpdate = async (formData, headers) => {
    try {
      const response = await products.update(formData, headers); // 수정 API 호출
      const data = await response.data;
      console.log('수정 성공:', data);

      alert('수정이 완료되었습니다.');
      navigate('/products/updateList'); // 수정 완료 후 목록 페이지로 이동
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  useEffect(() => {
    getProductDetails();
    getCategories();
    optLoad()
  }, [id]);

  // 상품 삭제 처리 함수
  const handleDelete = async () => {
    try {
      const response = await products.remove(id); // remove 함수 호출
      console.log('상품 삭제 성공:', response.data);
      if (confirm('정말로 상품을 삭제하시겠습니까?')) {
        navigate('/products/updateList'); // 삭제 후 목록 페이지로 리다이렉트
      }
    } catch (error) {
      console.error('상품 삭제 실패:', error);
    }
  };

  return (
    <ProductUpdate
      product={product}
      cateList={cateList}
      setProduct={setProduct}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      optList={optList}
    />
  );
};

export default ProductUpdateContainer;
