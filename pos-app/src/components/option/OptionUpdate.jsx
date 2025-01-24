import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Option.module.css';

const OptionUpdate = ({ option, optionUpdate, optionDelete }) => {
    console.log(`옵션 : `)
    console.dir(option)
    const { id } = useParams();
    const navigate = useNavigate();
    const [optionName, setOptionName] = useState(option?.name);  // 옵션 이름 상태
    const [optionItems, setOptionItems] = useState(option?.itemList);  // 옵션 항목 리스트 상태

    // 옵션 이름 입력 값 변경
    const changeOptionName = (e) => {
        setOptionName(e.target.value);
    };

    // 옵션 항목 이름 및 가격 변경
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...optionItems];
        updatedItems[index][field] = value;
        setOptionItems(updatedItems);
    };

    // 옵션 항목 삭제
    const removeOptionItem = (index) => {
        const updatedItems = optionItems.filter((_, i) => i !== index);
        setOptionItems(updatedItems);
    };

    // 옵션 추가
    const addOptionItem = () => {
        // 새로운 항목을 추가할 때 id를 유니크하게 설정
        setOptionItems((prevItems) => [
            ...prevItems,
            { id: prevItems.length + Date.now(), name: '', price: '' },  // 기존 아이템의 길이와 Date.now()를 사용해 고유 id 생성
        ]);
    };

    // 수정된 옵션 데이터를 서버로 전송
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!optionName) {
            alert('옵션 이름을 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', optionName);

        // 옵션 항목 추가 (기존 항목 + 새로운 항목들)
        optionItems.forEach((item, index) => {
            formData.append(`itemList[${index}].name`, item.name);
            formData.append(`itemList[${index}].price`, item.price);
        });

        const headers = {
            'Content-Type': 'multipart/form-data',
        };

        try {
            await optionUpdate(formData, headers);
            navigate('/options');  // 수정 후 옵션 목록으로 이동
        } catch (error) {
            console.error('옵션 수정 실패', error);
            alert('옵션 수정에 실패했습니다.');
        }
    };

    // 삭제 처리
    const handleDelete = () => {
        const check = window.confirm('정말로 삭제하시겠습니까?');
        if (check) {
            optionDelete(id);  // 옵션 삭제
            navigate('/options');  // 삭제 후 옵션 목록으로 이동
        }
    };

    useEffect(() => {
        if (option && option.name) {
            setOptionName(option.name);
        }
    
        // 기존 옵션 항목을 로드
        if (option && option.itemList) {
            setOptionItems(option.itemList);
        }
    }, [option]);

    return (
        <div className={styles.container}>
            <div className={styles['i-container']}>
                <h2>옵션 그룹 수정</h2>
                <form onSubmit={onSubmit} method="post" id="opt-insert">
                    <div className={styles['form-group']}>
                        <label htmlFor="name">옵션 그룹명</label>
                        <input
                            type="text"
                            id="name"
                            value={optionName}
                            onChange={changeOptionName}
                            placeholder="옵션 그룹명을 입력해주세요."
                            required
                        />
                    </div>

                    {/* 옵션 아이템 추가 버튼 */}
                    <div className={styles['form-group']}>
                        <button
                            type="button"
                            className={styles['plus-box']}
                            onClick={addOptionItem}  // 옵션 항목 추가 시 호출
                        >
                            <i className='material-symbols-outlined'>add_circle</i>
                            <span>옵션 추가</span>
                        </button>
                    </div>

                    {/* 옵션 아이템 리스트 */}
                    <div id="opt-item-list">
                        {optionItems?.map((item, index) => (
                            <div key={item.id} className={styles['opt-item']}>
                                <input
                                    type="text"
                                    value={item.name}
                                    placeholder="옵션명"
                                    onChange={(e) =>
                                        handleItemChange(index, 'name', e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    value={item.price}
                                    placeholder="금액"
                                    onChange={(e) =>
                                        handleItemChange(index, 'price', e.target.value)
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles['remove-btn']}
                                    onClick={() => removeOptionItem(index)}  // 항목 삭제 시 호출
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 수정 및 삭제 버튼 */}
                    <div className={styles['button-group']}>
                        <button
                            type="button"
                            className={styles['delete-btn']}
                            onClick={handleDelete}
                        >
                            삭제
                        </button>
                        <button
                            type="button"
                            className={styles['update-btn']}
                            onClick={onSubmit}
                        >
                            수정
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OptionUpdate;
