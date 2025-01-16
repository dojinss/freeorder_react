import React from 'react'

const OptionInsert = () => {
  return (
    <div class="container" layout:fragment="content">
        <div class="i-container">
            <h2>옵션 그룹 추가</h2>
            <form onsubmit="return false" method="post" id="opt-insert">
                <input type="hidden" name="id" th:value="${option.id}"/>
                <div class="form-group">
                    <label for="name">옵션</label>
                    <input type="text" id="name" name="name" placeholder="옵션 그룹명을 입력해주세요." required/>
                </div>
                <div class="form-group">
                    <button type="button" class="plus-box" onclick="addOptionItem()">
                        <i class="material-symbols-outlined">add_circle</i>
                        <a href="#">옵션 추가</a>
                    </button>
                    <ul id="opt-item-list"></ul>
                </div>
                <div class="button-group">
                    <button type="button" onclick="location.href='/pos/option'" class="cancel-btn">취소</button>
                    <button type="button" class="insert-btn" onclick="optInsert()">등록</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default OptionInsert