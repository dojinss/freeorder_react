-- 기본 데이터

-- BCryptPasswordEncoder - 암호화 시
-- 사용자
INSERT INTO users ( username, password, name )
VALUES ( 'user', '$2a$12$TrN..KcVjciCiz.5Vj96YOBljeVTTGJ9AUKmtfbGpgc9hmC7BxQ92', '사용자' );

-- 관리자
INSERT INTO users ( username, password, name )
VALUES ( 'admin', '$2a$12$TrN..KcVjciCiz.5Vj96YOBljeVTTGJ9AUKmtfbGpgc9hmC7BxQ92', '관리자' );

INSERT INTO users ( username, password, name )
VALUES ( 'test', '$2a$12$TrN..KcVjciCiz.5Vj96YOBljeVTTGJ9AUKmtfbGpgc9hmC7BxQ92', '테스트' );



-- 권한
-- 사용자 
-- * 권한 : ROLE_USER
INSERT INTO user_auth ( username,  auth )
VALUES ( 'user', 'ROLE_USER' );

INSERT INTO user_auth ( username,  auth )
VALUES ( 'test', 'ROLE_USER' );

-- 관리자
-- * 권한 : ROLE_USER, ROLE_ADMIN
INSERT INTO user_auth ( username,  auth )
VALUES ( 'admin', 'ROLE_USER' );

INSERT INTO user_auth ( username,  auth )
VALUES ( 'admin', 'ROLE_ADMIN' );