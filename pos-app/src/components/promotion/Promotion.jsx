import React from 'react';
import styles from './Promotion.module.css';
import { Link } from 'react-router-dom';

const Promotion = ({ proList, promotionDelete }) => {
  
  // 삭제 처리
  const handleDelete = (id) => {
    const check = window.confirm('정말로 삭제하시겠습니까?');
    if (check) {
      promotionDelete(id);  // 해당 프로모션을 삭제
    }
  };
  
  return (
    <div>
      <div className={styles['promotion-page']}>
        <h1>프로모션</h1>
        <Link to='/promotion/insert'>
          <a href="/promotion/insert" className={styles['insert-btn']}>
            프로모션 등록
          </a>
        </Link>
      </div>

      <table className={styles['promotion-list']}>
        <div className={styles['container']}>
          {proList && proList.length > 0 ? (
            <>
              <thead>
                <tr>
                  <th>No</th>
                  <th>프로모션명</th>
                  <th>썸네일</th>
                  <th>등록일자</th>
                  <th>수정일자</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {proList.map((pro, index) => (
                  <tr key={pro.id}>
                    <td>{index + 1}</td>
                    <td>{pro.title}</td>
                    <td>
                      <img
                        src={`/api/timg?id=${pro.id}`}
                        alt={`${pro.title} 썸네일`}
                        width="100px"
                      />
                    </td>
                    <td>{new Date(pro.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(pro.updatedAt).toLocaleDateString()}</td>
                    <td>
                    <Link
                        className={styles['update-btn']}
                        to={`/promotion/update/${pro.id}`}
                        >
                        수정
                    </Link>
                      <button
                        type="button"
                        className={styles['delete-btn']}
                        onClick={() => handleDelete(pro.id)}  // 각 프로모션의 id 전달
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  등록된 프로모션이 없습니다.
                </td>
              </tr>
            </tbody>
          )}
        </div>
      </table>
    </div>
  );
};

export default Promotion;
