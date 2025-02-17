drop table if exists `user_auth`;

create table `user_auth` (
    `no` int primary key AUTO_INCREMENT,
    `username` varchar(100) not null,
    `auth` varchar(100) not null
);
