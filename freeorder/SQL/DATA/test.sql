
SELECT 
    pm.`PAYMENT_METHOD`,
    AVG(o.TOTAL_PRICE) AS AVG_SALES,
    SUM(o.TOTAL_PRICE) AS TOTAL_SALES,
    COUNT(o.ID) as total_count
FROM 
    ORDERS o LEFT JOIN payments pm ON o.`ID` = pm.`ORDERS_ID`
WHERE 
    o.STATUS = 'PAID'
    -- AND YEAR(o.ORDERED_AT) = YEAR('2024-11-1')
    -- AND MONTH(o.ORDERED_AT) = MONTH('2024-11-1')
    -- AND DAY(o.ORDERED_AT) = DAY('2024-11-1')
GROUP BY 
    pm.payment_method
;

INSERT INTO ORDERS (ID, USER_ID, TITLE, TOTAL_QUANTITY, TOTAL_COUNT, TOTAL_PRICE, STATUS, ORDERED_AT)
VALUES
    ('ORD001', 'USER001', 'Order 1', 2, 1, 50000, 'PAID', '2024-12-01 10:00:00'),
    ('ORD002', 'USER002', 'Order 2', 1, 1, 30000, 'PAID', '2024-12-01 11:00:00'),
    ('ORD003', 'USER003', 'Order 3', 1, 1, 20000, 'CANCELLED', '2024-12-02 14:00:00'),
    ('ORD004', 'USER004', 'Order 4', 3, 1, 90000, 'PAID', '2024-12-03 09:00:00'),
    ('ORD005', 'USER005', 'Order 5', 2, 1, 60000, 'PAID', '2024-12-03 15:00:00'),
    ('ORD006', 'USER006', 'Order 6', 1, 1, 25000, 'PAID', '2024-12-04 16:00:00');

INSERT INTO PAYMENTS (ID, ORDERS_ID, PAYMENT_METHOD, STATUS, PAID_AT)
VALUES
    ('PAY001', 'ORD001', 'CREDIT_CARD', 'PAID', '2024-12-01 10:05:00'),
    ('PAY002', 'ORD002', 'PAYPAL', 'PAID', '2024-12-01 11:10:00'),
    ('PAY003', 'ORD004', 'BANK_TRANSFER', 'PAID', '2024-12-03 09:15:00'),
    ('PAY004', 'ORD005', 'CREDIT_CARD', 'PAID', '2024-12-03 15:20:00'),
    ('PAY005', 'ORD006', 'PAYPAL', 'PAID', '2024-12-04 16:30:00');

INSERT INTO CANCELLATIONS (ID, ORDERS_ID, TYPE, STATUS, REFUNDED_AMOUNT, IS_REFUND, CANCELED_AT, COMPLETED_AT)
VALUES
    ('CAN001', 'ORD003', 'cancel', 'complete', 20000, 1, '2024-12-02 14:30:00', '2024-12-02 15:00:00');


SELECT * FROM carts WHERE users_id = 'f2a63b6b-6fb7-4d73-b9a2-0f0655153b73';

