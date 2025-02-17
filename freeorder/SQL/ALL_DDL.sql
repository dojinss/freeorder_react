drop table if exists `users`;

create table `users` (
    `id` char(50) primary key not null,
    `username` varchar(100) not null,
    `password` varchar(100) not null,
    `name` varchar(100) not null,
    `email` varchar(100) null,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp,
    `enabled` int not null default 1
);

drop table if exists `user_auth`;

create table `user_auth` (
    `no` int primary key AUTO_INCREMENT,
    `username` varchar(100) not null,
    `auth` varchar(100) not null
);

drop table if exists `products`;

create table `products` (
    `id` char(50) primary key not null,
    `options_id` char(50) null,
    `name` varchar(100) not null,
    `categories_id` char(50) not null,
    `product_img` varchar(255) null,
    `description` varchar(200) null,
    `content` text null,
    `price` int not null,
    `stock_check` boolean not null default false,
    `stock` int null default 0,
    `seq` int not null default 0,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `carts`;

create table `carts` (
    `id` char(50) primary key not null,
    `products_id` char(50) not null,
    `options_id` char(50) null,
    `users_id` char(50) not null,
    `amount` int not null default 1,
    `price` int not null,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `cart_options`;

create table `cart_options` (
    `id` char(50) not null,
    `users_id` char(50) not null,
    `carts_id` char(50) not null,
    `option_items_id` char(50) not null,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `orders`;

create table `orders` (
    `id` char(50) primary key not null,
    `type` enum('HERE','TOGO') not null default 'HERE',
    `users_id` char(50) not null,
    `order_number` int not null default 1,
    `title` varchar(100) not null,
    `total_quantity` int not null default 1,
    `total_count` int not null default 1,
    `total_price` int not null default 0,
    `status` enum(
        'PENDING',
        'PAID',
        'COMPLETE',
        'CANCELLED'
    ) not null default 'PENDING' comment '결제대기, 결제완료, 접수완료, 주문취소',
    `ordered_at` timestamp not null default current_timestamp,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `order_items`;

create table `order_items` (
    `id` char(50) primary key not null,
    `orders_id` char(50) not null,
    `products_id` char(50) not null,
    `options_id` char(50) null,
    `name` char(100) not null,
    `quantity` int not null default 1,
    `price` int not null default 0,
    `amount` int null,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `order_options`;

create table `order_options` (
    `id` char(50) primary key not null,
    `order_items_id` char(50) not null,
    `option_items_id` char(50) not null,
    `name` char(100) not null,
    `price` int not null default 0,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `payments`;

create table `payments` (
    `id` char(50) primary key not null,
    `orders_id` char(50) not null,
    `payment_key`	varchar(100)	not null,
    `payment_method` varchar(100) null,
    `status` enum('PENDING', 'PAID', 'REFUND') not null default 'PENDING' comment '결제대기, 결제완료, 환불',
    `paid_at` timestamp not null default current_timestamp,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `cancellations`;

create table `cancellations` (
    `id` char(50) primary key not null,
    `orders_id` char(50) not null,
    `type` enum(
        'CANCEL',
        'RETURN',
        'EXCHANGE'
    ) not null default 'cancel' comment '주문취소,반품,교환',
    `status` enum('PENDING', 'COMPLETE') null default 'PENDING' comment '취소요청(대기), 처리완료',
    `reason` text null,
    `refunded_amount` int not null default 0,
    `is_confirmed` tinyint(1) not null default 0 comment '0: 미승인, 1: 승인',
    `is_refund` tinyint(1) not null default 0 comment '0: 대기, 1: 처리완료',
    `account_number` varchar(100) null,
    `bank_name` varchar(100) null,
    `depositor` varchar(100) null,
    `canceled_at` timestamp null,
    `completed_at` timestamp null,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `categories`;

create table `categories` (
    `id` char(50) primary key not null,
    `name` varchar(100) not null,
    `seq` int not null default 0,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `files`;

create table `files` (
    `id` char(50) primary key not null,
    `parent_table` varchar(100) not null,
    `parent_id` char(50) not null,
    `name` text not null,
    `origin_name` text not null,
    `path` text not null,
    `size` int not null default 0,
    `is_main` boolean not null default false,
    `seq` int not null default 0,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `options`;

create table `options` (
    `id` char(50) not null,
    `name` varchar(100) not null,
    `stock_check` boolean not null default false,
    `stock` int null default 0,
    `essential` boolean not null default false,
    `select_min` int null,
    `select_max` int null,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `option_items`;

create table `option_items` (
    `id` char(50) not null,
    `options_id` char(50) not null,
    `name` varchar(100) not null,
    `price` int not null default 0,
    `seq` int not null default 0,
    `created_at` timestamp not null default current_timestamp,
    `updated_at` timestamp not null default current_timestamp
);

drop table if exists `notices`;

create table `notices` (
    `id` char(50) primary key not null,
    `thumbnail` varchar(255) null comment '이벤트 섬네일파일경로',
    `type` varchar(30) not null comment '타입(notice, promotion)',
    `title` varchar(100) null comment '공지사항 제목',
    `content` varchar(1000) null comment '공지사항 내용',
    `enabled` boolean not null default false,
    `created_at` timestamp not null default current_timestamp comment '등록일자',
    `updated_at` timestamp not null default current_timestamp comment '수정일자'
);

drop table if exists `recommended_products`;

create table `recommended_products` (
    `id` char(50) primary key not null comment '추천메뉴 id',
    `products_id` char(50) not null comment '추천할 상품 id',
    `reason` varchar(255) null comment '추천 이유',
    `created_at` timestamp not null default current_timestamp comment '추천 등록일자',
    `updated_at` timestamp not null default current_timestamp comment '추천 수정일자'
);

drop table if exists `system_logs`;

create table `system_logs` (
    `id` char(50) primary key not null,
    `status` enum('START', 'END') null,
    `started_at` timestamp null,
    `ended_at` timestamp null
);

drop table if exists `setting`;

create table `setting` (
    `status` enum('START', 'END') not null,
    `started_at` timestamp null,
    `ended_at` timestamp null,
    `id` char(50) not null
);

insert into `setting` (`status`, `id`) values ('END', 'SETTING');