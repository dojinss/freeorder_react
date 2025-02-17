SELECT
    p.CATEGORY_ID,
    c.NAME AS CATEGORY_NAME,
    p.ID AS PRODUCT_ID,
    p.NAME,
    p.DESCRIPTION,
    p.PRICE,
    p.STOCK_CHECK,
    p.STOCK,
    -- 인기메뉴 여부 (주문 횟수 100회 이상이면 TRUE, 아니면 FALSE)
    IF(
        oc.ORDER_COUNT >= 100,
        TRUE,
        FALSE
    ) AS IS_POPULAR,
    -- 신메뉴 여부 (2주 이내에 생성된 상품이면 TRUE, 아니면 FALSE)
    IF(
        p.CREATED_AT >= NOW() - INTERVAL 2 WEEK,
        TRUE,
        FALSE
    ) AS IS_NEW,
    -- 추천메뉴 여부 (추천 상품이면 TRUE, 아니면 FALSE)
    IF(
        rp.PRODUCTS_ID IS NOT NULL,
        TRUE,
        FALSE
    ) AS IS_RECOMMENDED
FROM
    PRODUCTS p
    -- 카테고리 테이블 조인
    JOIN CATEGORIES c ON p.CATEGORY_ID = c.ID
    -- 주문 횟수 계산을 위한 서브쿼리
    LEFT JOIN (
        SELECT oi.PRODUCTS_ID, COUNT(oi.ID) AS ORDER_COUNT
        FROM ORDER_ITEMS oi
            JOIN ORDERS o ON oi.ORDERS_ID = o.ID
        WHERE
            o.STATUS = 'PAID' -- 결제 완료된 주문만 계산
        GROUP BY
            oi.PRODUCTS_ID
    ) oc ON p.ID = oc.PRODUCTS_ID
    -- 추천 상품 여부를 위한 조인
    LEFT JOIN RECOMMENDED_PRODUCTS rp ON p.ID = rp.PRODUCTS_ID
ORDER BY p.seq asc;

SELECT *
FROM files
WHERE
    parent_id = 'f99062c3-01f4-4f84-87c2-a6070d0dfa28'
    AND parent_table = 'notice'
    AND not is_main;

SELECT *
FROM files
WHERE
    parent_id = '9145fc40-bc4a-46fd-a245-65e1ed403f86'
    AND parent_table = 'product'
    AND NOT is_main;

SELECT * FROM files;

SELECT * FROM notices;

SELECT * FROM files WHERE parent_table = 'product';

SELECT * from products;

SELECT *
FROM files
WHERE
    id = '72fca0aa-fa0b-4080-8b7b-901054d37ea2';

SELECT *
FROM files
WHERE
    PARENT_ID = '8c981b05-10ef-4005-aa8a-33a39a8ae3b8';

SELECT * FROM files;

SELECT * FROM `options`;

SELECT * FROM option_items;

SELECT * FROM products;

SELECT * FROM carts;

SELECT * FROM cart_options;

SELECT * FROM orders;

SELECT * FROM order_options;

SELECT * FROM order_items;

TRUNCATE TABLE orders;

TRUNCATE TABLE order_options;

TRUNCATE TABLE order_items;

-- af0e4b32-53ec-47be-98c7-f8d771f61b56
TRUNCATE TABLE carts;

SELECT * FROM products;

SELECT * FROM options;

SELECT * FROM option_items;

SELECT * FROM system_logs;

SELECT * FROM payments;

SELECT
    p.*,
    o.TOTAL_PRICE,
    o.TITLE,
    o.ORDER_NUMBER,
    o.STATUS,
    oi.id as order_items_id,
    oi.products_id,
    oi.name,
    oi.quantity,
    oi.price,
    oi.amount,
    op.id as order_options_id,
    op.option_items_id,
    op.name as options_name,
    op.price as options_price
FROM
    payments p
    LEFT JOIN orders o ON p.orders_id = o.id
    LEFT OUTER JOIN order_items oi ON o.id = oi.orders_id
    LEFT OUTER JOIN order_options op ON oi.id = op.order_items_id
ORDER BY p.created_at desc;

SELECT p.*
              ,o.TOTAL_PRICE
              ,o.TITLE
              ,o.ORDER_NUMBER
              ,o.STATUS
              ,oi.id as order_items_id
              ,oi.products_id
              ,oi.name
              ,oi.quantity
              ,oi.price
              ,oi.amount
              ,op.id as order_options_id
              ,op.option_items_id
              ,op.name as options_name
              ,op.price as options_price
        FROM payments p 
        LEFT JOIN orders o
            ON p.orders_id = o.id
        LEFT OUTER JOIN order_items oi
            ON o.id = oi.orders_id
        LEFT OUTER JOIN order_options op
            ON oi.id = op.order_items_id
        WHERE p.paid_at between ('2024-12-01' AND '2024-12-31')
          AND ( p.payment_method = '카드' OR p.`PAYMENT_METHOD` = '현금' )
          AND o.TOTAL_PRICE >= 0
        ORDER BY p.created_at desc;


SELECT COUNT(o.id) as cnt
        FROM orders o
        WHERE o.ORDERED_AT >= (SELECT STARTED_AT FROM SETTING);

SELECT 
            AVG(o.TOTAL_PRICE) AS AVG_SALES,
            SUM(o.TOTAL_PRICE) AS TOTAL_SALES,
            COUNT(o.ID) as total_count
        FROM 
            ORDERS o LEFT JOIN payments pm
            ON pm.`ORDERS_ID` = o.`ID`
        WHERE 
            o.STATUS = 'PAID'
            AND YEAR(o.ORDERED_AT) = YEAR("2024-12-01")
            AND MONTH(o.ORDERED_AT) = MONTH("2024-12-01")
            AND DAY(o.ORDERED_AT) = DAY("2024-12-01")
        GROUP BY 
            pm.payment_method;


SELECT 
    AVG(o.TOTAL_PRICE) AS avg_sales,
    SUM(o.TOTAL_PRICE) AS total_sales,
    COUNT(o.ID) as sales_count
FROM ORDERS o 
LEFT JOIN payments pm
    ON pm.orders_id = o.id
WHERE 
    DATE_FORMAT(o.ORDERED_AT, '%Y-%m-%d') = '2024-12-19'
GROUP BY 
    pm.payment_method;

SELECT 
    p.*
    , o.TOTAL_PRICE
    , o.TITLE
    , o.ORDER_NUMBER
    , o.STATUS
    , oi.id as order_items_id
    , oi.products_id
    , oi.name
    , oi.quantity
    , oi.price
    , oi.amount
    , op.id as order_options_id
    , op.option_items_id
    , op.name as options_name
    , op.price as options_price
FROM payments p 
LEFT JOIN orders o
    ON p.orders_id = o.id
LEFT OUTER JOIN order_items oi
    ON o.id = oi.orders_id
LEFT OUTER JOIN order_options op
    ON oi.id = op.order_items_id;


