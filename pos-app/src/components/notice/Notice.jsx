import React, { useState } from 'react'
import styles from './Notice.module.css'

const Notice = ({notiInsert}) => {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [type, setType] = useState('notice')

    const changeTitle = (e) => { setTitle(e.target.value)}
    const changeContent = (e) => { setContent(e.target.value)}
    const changeType = (e) => { setType( e.target.value )}

    const noticeInsert = () => {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)
        formData.append("type", type)

    const headers = {
        'Constent-type' : 'multipart/form-data'
    }
    notiInsert(formData, headers)
    }
  return (
    <div className={styles['container']}>
    <form className={styles['notice']} id="notice-insert" onSubmit={(e) => e.preventDefault()}>
            <h1>공지사항</h1>
            <div className={styles['notice-title']}>
                <input type="hidden" name="type" onChange={changeType} />
                <a href="#">제목</a>
                <input type="text" id="notice-title" name="title" 
                defaultValue={title} onChange={changeTitle} placeholder="제목을 입력하세요" />
            </div>
                <div className={styles['notice-radio']}>
                    <div className={styles['radio-wrap']}>
                        <input type="checkbox" role="switch" name="enabled" id="enabled" />
                        <label for="enabled">활성화</label>
                    </div>
                </div>

                
            
            <div className={styles['notice-content']}>
                <a href="#">내용</a>
                <textarea name="content" id="notice-content" defaultValue={content} onChange={changeContent}
                    placeholder="내용을 입력하세요"></textarea>
            </div>
            <button  className={styles['insert-btn']} onClick={noticeInsert}>저장</button>
        </form>
    </div>
  )
}

export default Notice