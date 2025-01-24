import React from 'react'
import styles from './Sale.module.css'

const Sale = () => {
    return (
        <div className={styles['sales']}>
            <a href="#" className={styles['today-date']} id="selectedDate">2024.12.06</a>

            <div className={styles['sales-sr']}>
                <div className={styles['sr-sr']}>
                    <div className={styles['sr-sales']}>
                        <a href="#" className={styles['sr-title']}>이번 달 실 매출</a>
                        <a href="#" className={styles['sales-price']} id="totalSales">로딩 중...</a>
                    </div>
                    <div className={styles['sr-refund']}>
                        <a href="#" className={styles['sr-title']}>이번 달 총 환불</a>
                        <a href="#" className={styles['refund-price']} id="totalRefund">로딩 중...</a>
                    </div>
                </div>
                <div className={styles['calendar']}>
                    <div className={styles['calendar-header']}>
                        <button className={styles['prevMonth']}><img src="/img/back2.png"/></button>
                        <span id="monthYear"></span>
                        <button className={styles['nextMonth']}><img src="/img/next.png"/></button>
                    </div>
                    <div className={styles['calendar-days']}>
                        <div>월</div>
                        <div>화</div>
                        <div>수</div>
                        <div>목</div>
                        <div>금</div>
                        <div>토</div>
                        <div>일</div>
                    </div>
                    <div id="calendarDates"></div>
                </div>
            </div>

            <div id="dailySales"></div>
        </div>
    )
}

export default Sale