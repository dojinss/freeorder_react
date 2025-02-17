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