import React, { useState } from 'react';
import styles from './Option.module.css';

const OptionInsert = ({ optionInsert }) => {
    const [optionName, setOptionName] = useState('');
    const [optionItems, setOptionItems] = useState([]); // 추가된 옵션 항목들을 관리

    const changeOptionName = (e) => {
        setOptionName(e.target.value);
    };

    // 옵션 항목 추가
    const addOptionItem = () => {
        setOptionItems((prevItems) => [
            ...prevItems,
            { id: Date.now(), name: '', price: '' },
        ]);
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

    const onSubmit = () => {
        if (!optionName) {
            alert('옵션 이름을 입력해주세요.');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', optionName);
        
        // 옵션 항목을 추가
        optionItems.forEach((item, index) => {
            formData.append(`itemList[${index}].name`, item.name);
            formData.append(`itemList[${index}].price`, item.price);
        });
    
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
    
        optionInsert(formData, headers);
    };

    return (
        <div className={styles.container}>
            <div className={styles['i-container']}>
                <h2>옵션 그룹 추가</h2>
                <form onSubmit={(e) => e.preventDefault()} method="post" id="opt-insert">
                    <div className={styles['form-group']}>
                        <label htmlFor="name">옵션</label>
                        <input
                            type="text"
                            id="name"
                            onChange={changeOptionName}
                            placeholder="옵션 그룹명을 입력해주세요."
                            required
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <button
                            type="button"
                            className={styles['plus-box']}
                            onClick={addOptionItem} // 옵션 추가 시 호출
                        >
                            <i className='material-symbols-outlined'>add_circle</i>
                            <span>옵션 추가</span>
                        </button>
                    </div>
                    <div id="opt-item-list">
                        {optionItems.map((item, index) => (
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
                                    onClick={() => removeOptionItem(index)} // 항목 삭제 시 호출
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles['button-group']}>
                        <button
                            type="button"
                            className={styles['cancel-btn']}
                            onClick={() => window.location.href = '/options'}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className={styles['insert-btn']}
                            onClick={onSubmit}
                        >
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OptionInsert;
