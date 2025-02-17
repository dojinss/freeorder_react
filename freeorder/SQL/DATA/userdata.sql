TRUNCATE TABLE `users`;

TRUNCATE Table `user_auth`;
-- 기본 데이터

-- BCryptPasswordEncoder - 암호화 시
-- 사용자
INSERT INTO
    `users` (id, username, password, name)
VALUES (
        UUID(),
        'user',
        '$2a$12$PLuvmD4iQT/E/tT7bQKUdO.HHc/Ujm3PZMHbR6hfBrjUQ2Ys7KGJi',
        '사용자'
    );

-- 관리자
INSERT INTO
    `users` (id, username, password, name)
VALUES (
        UUID(),
        'admin',
        '$2a$12$PLuvmD4iQT/E/tT7bQKUdO.HHc/Ujm3PZMHbR6hfBrjUQ2Ys7KGJi',
        '관리자'
    );

INSERT INTO
    `users` (id, username, password, name)
VALUES (
        UUID(),
        'test',
        '$2a$12$PLuvmD4iQT/E/tT7bQKUdO.HHc/Ujm3PZMHbR6hfBrjUQ2Ys7KGJi',
        '테스트'
    );

-- 권한
-- 사용자
-- * 권한 : ROLE_USER
INSERT INTO
    `user_auth` (id, username, auth)
VALUES ( 'user', 'ROLE_USER');

INSERT INTO
    `user_auth` (id, username, auth)
VALUES ( 'test', 'ROLE_USER');

-- 관리자
-- * 권한 : ROLE_USER, ROLE_ADMIN
INSERT INTO
    `user_auth` (id, username, auth)
VALUES ( 'admin', 'ROLE_USER');

INSERT INTO
    `user_auth` (id, username, auth)
VALUES ( 'admin', 'ROLE_ADMIN');